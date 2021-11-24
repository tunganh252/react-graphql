import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";

import { User } from "../entities/User";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { RegisterInput } from "../types/RegisterInput";
import { validateRegisterInput } from "../utils/validateRegisterInput";
import { LoginInput } from "../types/LoginInput";
import { Context } from "../types/Context";
import { COOKIE_NAME } from "../constants";
import { ForgotPasswordInput } from "../types/ForgotPasswordInput";
import { sendEmail } from "../utils/sendEmail";
import { TokenModel } from "../models/Token";
import { ChangePasswordInput } from "../types/ChangePasswordInput";

@Resolver()
export class UserResolver {
  @Query((_return) => User, { nullable: true })
  async me(@Ctx() { req }: Context): Promise<User | undefined | null> {
    if (!req.session.userId) return null;
    const user = await User.findOne(req.session.userId);
    return user;
  }

  @Mutation((_return) => UserMutationResponse, { nullable: true })
  async register(
    @Arg("registerInput") registerInput: RegisterInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    const validateRegisterInputErrors = validateRegisterInput(registerInput);

    if (validateRegisterInputErrors !== null)
      return { code: 400, success: false, ...validateRegisterInputErrors };

    try {
      const { email, username, password } = registerInput;
      const existingUser = await User.findOne({
        where: [{ username }, { email }],
      });
      if (existingUser)
        return {
          code: 400,
          success: false,
          message: "Duplicated username or email",
          errors: [
            {
              field: existingUser.username === username ? "username" : "email",
              message: `${
                existingUser.username === username ? "Username" : "Email"
              } already taken`,
            },
          ],
        };

      const hashPassword = await argon2.hash(password);

      let newUser = User.create({
        email,
        username,
        password: hashPassword,
      });

      newUser = await User.save(newUser);

      req.session.userId = newUser.id;

      return {
        code: 200,
        success: true,
        message: "User registration successfully",
        user: newUser,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  @Mutation((_return) => UserMutationResponse)
  async login(
    @Arg("loginInput") { usernameOrEmail, password }: LoginInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    try {
      const existingUser = await User.findOne(
        usernameOrEmail.includes("@")
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail }
      );

      if (!existingUser) {
        return {
          code: 400,
          success: false,
          message: "User not found",
          errors: [
            {
              field: "usernameOrEmail",
              message: "Username or email incorrect",
            },
          ],
        };
      }

      const passwordValid = await argon2.verify(
        existingUser.password,
        password
      );

      if (!passwordValid) {
        return {
          code: 400,
          success: false,
          message: "Wrong password",
          errors: [
            {
              field: "password",
              message: "Password incorrect",
            },
          ],
        };
      }

      // Create session and return cookie
      req.session.userId = existingUser.id;

      return {
        code: 200,
        success: true,
        message: "Login successfully",
        user: existingUser,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  @Mutation((_return) => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<Boolean> {
    return new Promise((resolve, _reject) => {
      res.clearCookie(COOKIE_NAME);
      req.session.destroy((err) => {
        if (err) {
          console.log("Destroying session error", err);
          resolve(false);
        }
        resolve(true);
      });
    });
  }

  @Mutation((_return) => Boolean)
  async forgotPassword(
    @Arg("forgotPasswordInput") { email }: ForgotPasswordInput
  ): Promise<Boolean> {
    const user = await User.findOne({ email });
    console.log(111, user);

    if (!user) return false;

    await TokenModel.findOneAndDelete({ userId: `${user.id}` });

    const resetToken = uuidv4();
    const hashedRequestToken = await argon2.hash(resetToken);

    // save token to db
    await new TokenModel({
      userId: `${user.id}`,
      token: hashedRequestToken,
    }).save();

    // send reset password link to user via email
    await sendEmail(
      email,
      `<a href="http://localhost:5050/change-password?token=${resetToken}&userId=${user.id}">Click here to reset your password</a>`
    );

    return true;
  }

  @Mutation((_return) => UserMutationResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("userId") userId: string,
    @Arg("changePasswordInput") changePasswordInput: ChangePasswordInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    if (changePasswordInput.newPassword.length <= 2)
      return {
        code: 400,
        success: false,
        message: "Invalid password",
        errors: [
          { field: "newPassword", message: "Password must be greater than 2" },
        ],
      };

    try {
      const resetPasswordTokenRecord = await TokenModel.findOne({ userId });

      if (!resetPasswordTokenRecord) {
        return {
          code: 400,
          success: false,
          message: "Invalid or expired password reset token",
          errors: [
            {
              field: "token",
              message: "Invalid or expired password reset token",
            },
          ],
        };
      }

      const resetPasswordTokenValid = argon2.verify(
        resetPasswordTokenRecord.token,
        token
      );

      if (!resetPasswordTokenValid) {
        return {
          code: 400,
          success: false,
          message: "Invalid password",
          errors: [
            {
              field: "newPassword",
              message: "Password must be greater than 2",
            },
          ],
        };
      }

      const userIdNum = parseInt(userId);
      const user = await User.findOne(userIdNum);

      if (!user)
        return {
          code: 400,
          success: false,
          message: "User no longer exist",
          errors: [
            {
              field: "token",
              message: "User no longer exist",
            },
          ],
        };

      const updatedPassword = await argon2.hash(
        changePasswordInput.newPassword
      );

      await User.update({ id: userIdNum }, { password: updatedPassword });
      await resetPasswordTokenRecord.deleteOne();
      req.session.userId = user.id;

      return {
        code: 200,
        success: true,
        message: "User password reset successfully",
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }
}
