import { FieldError } from "@/generated/graphql";

/**
 * 
[
    {field: "username", message: "username error"}
]
-->
{
    user: "username error"
}
 */
export const mapFieldErrors = (
  errors: FieldError[]
): { [key: string]: any } => {
  return errors.reduce((ack, err) => {
    return {
      ...ack,
      [err.field]: err.message,
    };
  }, {});
};
