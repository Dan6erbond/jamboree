import {
  Button,
  Modal,
  Stack,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { IconUser } from "@tabler/icons";
import { useCallback, useState } from "react";

interface UsernameModalProps {
  opened: boolean;
  onClose?: () => void;
  onSubmit: (username: string) => void;
}

export const UsernameModal = ({
  opened,
  onClose,
  onSubmit,
}: UsernameModalProps) => {
  const theme = useMantineTheme();

  const [nameInput, setNameInput] = useState("");
  const [nameInputValid, setNameInputValid] = useState(true);

  const onNameSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (nameInput) {
        onSubmit(nameInput);
      } else {
        setNameInputValid(false);
      }
    },
    [onSubmit, nameInput, setNameInputValid]
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose || (() => {})}
      title="Introduce yourself!"
      centered
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
    >
      <form onSubmit={onNameSubmit}>
        <Stack>
          <TextInput
            label="Enter your Name"
            icon={<IconUser />}
            onChange={(e) => setNameInput(e.target.value)}
            error={!nameInputValid}
          />
          <Button
            sx={{ marginLeft: "auto" }}
            color="pink"
            variant="outline"
            type="submit"
          >
            Go!
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
