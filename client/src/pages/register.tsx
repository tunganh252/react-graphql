import { Form, Formik, FormikHelpers } from "formik";
import Wrapper from "@/components/Wrapper";
import InputField from "@/components/InputField";
import {
  Button,
  Spinner,
  Flex,
  Box,
  FormControl,
  useToast,
} from "@chakra-ui/react";

import {
  MeDocument,
  MeQuery,
  RegisterInput,
  useRegisterMutation,
} from "@/generated/graphql";
import { mapFieldErrors } from "@/helpers/mapFieldErrors";
import { useRouter } from "next/dist/client/router";
import { useCheckAuth } from "src/utils/useCheckAuth";

const Register = ({}) => {
  const router = useRouter();
  const { data: authData, loading: authLoading } = useCheckAuth();
  const toast = useToast();

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
      update(cache, { data }) {
        if (data?.register?.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: data.register.user,
            },
          });
        }
      },
    });

    if (response.data?.register?.errors) {
      setErrors(mapFieldErrors(response.data?.register?.errors));
    } else if (response.data?.register?.user) {
      // Register successfully
      toast({
        title: "Welcome.",
        description: `${response.data.register.user.username}`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      router.push(`/`);
    }
  };
  return (
    <>
      {authLoading || (!authLoading && authData?.me) ? (
        <Flex minH="100vh" justifyContent="center" alignItems="center">
          <Spinner />
        </Flex>
      ) : (
        <Wrapper>
          {error && <p>Error register</p>}
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
      )}
    </>
  );
};

export default Register;
