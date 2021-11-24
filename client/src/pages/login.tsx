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
  LoginInput,
  MeDocument,
  MeQuery,
  useLoginMutation,
} from "@/generated/graphql";
import { mapFieldErrors } from "@/helpers/mapFieldErrors";
import { useRouter } from "next/dist/client/router";
import { useCheckAuth } from "src/utils/useCheckAuth";
import { Link } from "@chakra-ui/layout";
import NextLink from "next/link";

const Login = ({}) => {
  const router = useRouter();
  const { data: authData, loading: authLoading } = useCheckAuth();
  const toast = useToast();

  const initialValues: LoginInput = {
    usernameOrEmail: "",
    password: "",
  };

  const [loginUser, { loading: _loginUserLoading, data: _data, error }] =
    useLoginMutation();

  const _onLoginSubmit = async (
    values: LoginInput,
    { setErrors }: FormikHelpers<LoginInput>
  ) => {
    const response = await loginUser({
      variables: {
        loginInput: values,
      },
      update(cache, { data }) {
        if (data?.login.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: data.login.user,
            },
          });
        }
      },
    });

    if (response.data?.login?.errors) {
      console.log(mapFieldErrors(response.data?.login?.errors));

      setErrors(mapFieldErrors(response.data?.login?.errors));
    } else if (response.data?.login?.user) {
      // Login successfully
      toast({
        title: "Welcome.",
        description: `${response.data.login.user.username}`,
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
          {error && <p>Error login</p>}
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
                  <Box mt={15}>
                    <NextLink href="/forgot-password">
                      <Link ml={"auto"}>Forgot Password</Link>
                    </NextLink>
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
      )}
    </>
  );
};

export default Login;
