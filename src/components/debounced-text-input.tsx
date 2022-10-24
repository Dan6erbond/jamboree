import { TextInput, TextInputProps } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";

interface DebouncedTextInputProps
  extends Omit<TextInputProps, "onChange">,
    Omit<React.RefAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (newValue: string) => void;
  debounceTime?: number;
  value: string;
}

export const DebouncedTextInput = ({
  onChange,
  debounceTime = 1500,
  value: initValue = "",
  ...props
}: DebouncedTextInputProps) => {
  const [value, setValue] = useState(initValue);
  const [previousValue, setPreviousValue] = useState(value);
  const [debouncedValue] = useDebouncedValue(value, debounceTime);

  useEffect(() => {
    if (previousValue === debouncedValue) return;
    setPreviousValue(debouncedValue);
    onChange?.(debouncedValue);
  }, [debouncedValue, onChange, previousValue]);

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  return (
    <TextInput
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
