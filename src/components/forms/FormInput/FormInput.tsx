import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Input, InputProps } from "@/components/ui/Input";

export interface FormInputProps<T extends FieldValues>
  extends Omit<InputProps, "value" | "onChangeText"> {
  control: Control<T>;
  name: Path<T>;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  ...props
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <Input
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          {...props}
        />
      )}
    />
  );
}
