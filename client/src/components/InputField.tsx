import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { useField } from "formik";

interface InputFieldProps {
  name: string;
  label: string;
  placeholder: string;
  type: string;
}

const InputField = (props: InputFieldProps) => {
  const [field, { error }] = useField(props);

  return (
    <div>
      <FormControl>
        <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
        <Input
          {...field}
          id={field.name}
          placeholder={props.placeholder}
          type={props.type}
          //   value={field.value}
          //   onChange={field.onChange}
        />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    </div>
  );
};

export default InputField;
