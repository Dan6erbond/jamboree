import { Group } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useCallback, useEffect, useState } from "react";

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
}

export const DateTimePicker = ({
  disabled,
  value,
  onChange,
}: DateTimePickerProps) => {
  const [date, setDate] = useState(new Date());

  const updateDate = useCallback(
    (date: Date | null, setter: "time" | "date") => {
      setDate((dt) => {
        if (disabled) {
          return dt;
        }
        if (date === null) {
          return dt;
        }
        const newDate = new Date();
        switch (setter) {
          case "date":
            newDate.setHours(dt.getHours());
            newDate.setMinutes(dt.getMinutes());

            newDate.setDate(date.getDate());
            newDate.setMonth(date.getMonth());
            newDate.setFullYear(date.getFullYear());
            break;
          case "time":
            newDate.setDate(dt.getDate());
            newDate.setMonth(dt.getMonth());
            newDate.setFullYear(dt.getFullYear());

            newDate.setHours(date.getHours());
            newDate.setMinutes(date.getMinutes());
            break;
        }
        onChange(newDate);
        return newDate;
      });
    },
    [setDate, onChange, disabled]
  );

  useEffect(() => {
    setDate(value);
  }, [value, setDate]);

  return (
    <Group>
      <DatePicker
        placeholder="Date"
        withAsterisk
        size="md"
        disabled={disabled}
        value={date}
        onChange={(date) => updateDate(date, "date")}
      />
      <TimeInput
        withAsterisk
        size="md"
        disabled={disabled}
        value={date}
        onChange={(date) => updateDate(date, "time")}
      />
    </Group>
  );
};
