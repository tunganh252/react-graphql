import { Form, Formik, FormikHelpers } from "formik";
import { FormControl } from "@chakra-ui/form-control";
import Wrapper from "@/components/Wrapper";
import InputField from "@/components/InputField";
import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/react";
import { RegisterInput, useRegisterMutation } from "@/generated/graphql";
import { mapFieldErrors } from "@/helpers/mapFieldErrors";
import { useRouter } from "next/dist/client/router";

const Register = ({}) => {
  const router = useRouter();
  const initialValues: RegisterInput = {
    username: "",
    email: "",
    password: "",
  };

  const [registerUser, { loading: _registerUserLoading, data, error }] =
    useRegisterMutation();

  const _onRegisterSubmit = async (
    values: RegisterInput,
    { setErrors }: FormikHelpers<RegisterInput>
  ) => {
    const response = await registerUser({
      variables: {
        registerInput: values,
      },
    });

    if (response.data?.register?.errors) {
      setErrors(mapFieldErrors(response.data?.register?.errors));
    } else if (response.data?.register?.user) {
      // Register successfully
      router.push(`/`);
    }
  };
  return (
    <Wrapper>
      {error && <p>Error register</p>}
      {data && data.register?.success ? (
        <p>Register Successfully {JSON.stringify(data)}</p>
      ) : (
        <p>Register Failed {JSON.stringify(data)}</p>
      )}
      <Formik initialValues={initialValues} onSubmit={_onRegisterSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField
                name="username"
                label="Username"
                placeholder="Username"
                type="text"
              />
              <Box mt={15}>
                <InputField
                  name="email"
                  label="Email"
                  placeholder="Email"
                  type="text"
                />
              </Box>
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
                Register
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
