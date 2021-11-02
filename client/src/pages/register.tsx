import { Form, Formik } from "formik";
import { FormControl } from "@chakra-ui/form-control";
import Wrapper from "@/components/Wrapper";
import InputField from "@/components/InputField";
import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/react";

const Register = ({}) => {
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
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
