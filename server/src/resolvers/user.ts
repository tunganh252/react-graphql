import { Arg, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";
import { User } from "../entities/User";
import { UserMutationReponse } from "../types/UserMutationResponse";
import { RegisterInput } from "../types/RegisterInput";
import { validateRegisterInput } from "../utils/validateRegisterInput";

@Resolver()
export class UserResolver {
  @Mutation((_returns) => UserMutationReponse, { nullable: true })
  async register(
    @Arg("registerInput") registerInput: RegisterInput
  ): Promise<UserMutationReponse> {
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

      const newUser = User.create({
        email,
        username,
        password: hashPassword,
      });

      return {
        code: 200,
        success: true,
        message: "User registration successful",
        user: await User.save(newUser),
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
