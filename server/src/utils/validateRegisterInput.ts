import { RegisterInput } from "../types/RegisterInput";

export const validateRegisterInput = (registerInput: RegisterInput) => {
  if (!registerInput.email.includes("@")) {
    return {
      message: "Invalid email",
      errors: [{ field: "email", message: "Email must include @ symbol" }],
    };
  }
  if (registerInput.username.length <= 3) {
    return {
      message: "Invalid username",
      errors: [{ field: "username", message: "Length must be greater than 2" }],
    };
  }
  if (registerInput.password.length <= 3) {
    return {
      message: "Invalid password",
      errors: [{ field: "password", message: "Length must be greater than 2" }],
    };
  }
  return {
    message: "Error internal server",
  };
};
