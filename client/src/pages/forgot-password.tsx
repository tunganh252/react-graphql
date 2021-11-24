import InputField from "@/components/InputField";
import Wrapper from "@/components/Wrapper";
import {
  ForgotPasswordInput,
  useForgotPasswordMutation,
} from "@/generated/graphql";
import { Button } from "@chakra-ui/button";
import { FormControl } from "@chakra-ui/form-control";
import { Box, Flex } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { Formik, Form, FormikHelpers } from "formik";
import React from "react";
import { useCheckAuth } from "../utils/useCheckAuth";

const ForgotPassword = ({}) => {
  const initialValues = { email: "" };

  const { data: authData, loading: _authLoading } = useCheckAuth();

  const [forgotPassword, { loading, data }] = useForgotPasswordMutation();

  const _onForgotPasswordSubmit = async (
    value: ForgotPasswordInput,
    { setErrors }: FormikHelpers<ForgotPasswordInput>
  ) => {
    const response = await forgotPassword({
      variables: {
        forgotPasswordInput: value,
      },
    });
    if (!response.data?.forgotPassword) {
      setErrors({ email: "Không có thông tin" });
    }
  };
  console.log(1111, authData);

  if (authData?.me)
    return (
      <Flex minH="100vh" justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    );
  else
    return (
      <Wrapper>
        <Formik
          initialValues={initialValues}
          onSubmit={_onForgotPasswordSubmit}
        >
          {({ isSubmitting }) =>
            !loading && !!data?.forgotPassword ? (
              <Box>Please check your inbox</Box>
            ) : (
              <Form>
                <FormControl>
                  <InputField
                    name="email"
                    label="Email"
                    placeholder="Email"
                    type="email"
                  />
                  <Button
                    type="submit"
                    colorScheme="teal"
                    mt={4}
                    isLoading={isSubmitting}
                  >
                    Forgot Password
                  </Button>
                </FormControl>
              </Form>
            )
          }
        </Formik>
      </Wrapper>
    );
};

export default ForgotPassword;
