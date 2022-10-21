import { Button, Popover, useMantineColorScheme } from "@mantine/core";
import {
  default as EmojiPicker,
  Emoji,
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";

interface EmojiPickerButtonProps {
  value: string;
  onChange?: (emoji: EmojiClickData) => void;
}

export const EmojiPickerButton = ({
  value,
  onChange,
}: EmojiPickerButtonProps) => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Popover width={350} position="top" shadow="md">
      <Popover.Target>
        <Button variant="default">
          <Emoji unified={value} size={25} emojiStyle={EmojiStyle.TWITTER} />
        </Button>
      </Popover.Target>
      <Popover.Dropdown
        sx={{
          height: 450,
          overflow: "visible",
          padding: 0,
          border: "none",
        }}
      >
        <EmojiPicker
          theme={colorScheme === "dark" ? Theme.DARK : Theme.LIGHT}
          emojiStyle={EmojiStyle.TWITTER}
          onEmojiClick={(emoji) => onChange?.(emoji)}
        />
      </Popover.Dropdown>
    </Popover>
  );
};
