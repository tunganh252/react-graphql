import { Form, Formik, FormikHelpers } from "formik";
import { FormControl } from "@chakra-ui/form-control";
import Wrapper from "@/components/Wrapper";
import InputField from "@/components/InputField";
import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/react";
import { LoginInput, useLoginMutation } from "@/generated/graphql";
import { mapFieldErrors } from "@/helpers/mapFieldErrors";
import { useRouter } from "next/dist/client/router";

const Login = ({}) => {
  const router = useRouter();
  const initialValues: LoginInput = {
    usernameOrEmail: "",
    password: "",
  };

  const [loginUser, { loading: _loginUserLoading, data, error }] =
    useLoginMutation();

  const _onLoginSubmit = async (
    values: LoginInput,
    { setErrors }: FormikHelpers<LoginInput>
  ) => {
    const response = await loginUser({
      variables: {
        loginInput: values,
      },
    });

    if (response.data?.login?.errors) {
      console.log(mapFieldErrors(response.data?.login?.errors));

      setErrors(mapFieldErrors(response.data?.login?.errors));
    } else if (response.data?.login?.user) {
      // Login successfully
      router.push(`/`);
    }
  };
  return (
    <Wrapper>
      {error && <p>Error login</p>}
      {data && data.login.success ? (
        <p>Login Successfully {JSON.stringify(data)}</p>
      ) : (
        <p>Login Failed {JSON.stringify(data)}</p>
      )}
      <Formik initialValues={initialValues} onSubmit={_onLoginSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField
                name="usernameOrEmail"
                label="Username or email"
                placeholder="Username or email"
                type="text"
              />
              <Box mt={15}>
                <InputField
                  name="password"
                  label="Password"
                  placeholder="Password"
                  type="password"
                />
              </Box>
              <Button
                type="submit"
                colorScheme="teal"
                mt={4}
                isLoading={isSubmitting}
              >
                Login
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
