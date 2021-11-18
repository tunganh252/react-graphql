import InputField from "@/components/InputField";
import Wrapper from "@/components/Wrapper";
import {
  ForgotPasswordInput,
  useForgotPasswordMutation,
} from "@/generated/graphql";
import { mapFieldErrors } from "@/helpers/mapFieldErrors";
import { Button } from "@chakra-ui/button";
import { FormControl } from "@chakra-ui/form-control";
import { Box } from "@chakra-ui/layout";
import { Formik, Form, FormikHelpers } from "formik";
import React from "react";

const ForgotPassword = ({}) => {
  const initialValues = { email: "" };

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

  return (
    <Wrapper>
      <Formik initialValues={initialValues} onSubmit={_onForgotPasswordSubmit}>
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
                  Sendm Forgot Password
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
