import React, { useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { Button, Box, FormControl, Flex, Spinner } from "@chakra-ui/react";
import { Link } from "@chakra-ui/layout";
import NextLink from "next/link";

import Wrapper from "@/components/Wrapper";
import {
  ChangePasswordInput,
  useChangePasswordMutation,
} from "@/generated/graphql";
import InputField from "@/components/InputField";
import { useRouter } from "next/dist/client/router";
import { mapFieldErrors } from "@/helpers/mapFieldErrors";
import { useCheckAuth } from "../utils/useCheckAuth";

const ChangePassword = ({}) => {
  const router = useRouter();
  const initialValues: ChangePasswordInput = {
    newPassword: "",
  };

  const { data: authData, loading: _authLoading } = useCheckAuth();

  const [changePassword, { loading: _changePasswordLoading }] =
    useChangePasswordMutation();

  const [tokenError, setTokenError] = useState("");

  const _onChangePasswordSubmit = async (
    values: ChangePasswordInput,
    { setErrors }: FormikHelpers<ChangePasswordInput>
  ) => {
    if (!!router.query.userId && !!router.query.token) {
      const response = await changePassword({
        variables: {
          userId: (router.query.userId as string) || "",
          token: (router.query.token as string) || "",
          changePasswordInput: {
            newPassword: values.newPassword,
          },
        },
      });

      if (response.data?.changePassword.errors) {
        const fieldError = mapFieldErrors(response.data?.changePassword.errors);

        if ("token" in fieldError) setTokenError(fieldError.token);
        setErrors(fieldError.token);
      }
    }
  };
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
          onSubmit={_onChangePasswordSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormControl>
                <InputField
                  name="newPassword"
                  label="New password"
                  placeholder="New Password"
                  type="password"
                />
                {tokenError && (
                  <Flex>
                    <Box color="red" mr={2}>
                      {tokenError}
                    </Box>
                    <NextLink href="/forgot-password">
                      <Link ml={"auto"}>Go back to Forgot Password</Link>
                    </NextLink>
                  </Flex>
                )}
                <Button
                  type="submit"
                  colorScheme="teal"
                  mt={4}
                  isLoading={isSubmitting}
                >
                  Change Password
                </Button>
              </FormControl>
            </Form>
          )}
        </Formik>
      </Wrapper>
    );
};

export default ChangePassword;
