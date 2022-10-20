import {
  ActionIcon,
  Button,
  Checkbox,
  Container,
  Grid,
  Group,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useClipboard } from "@mantine/hooks";
import { IconHash, IconMapPin, IconPlus } from "@tabler/icons";
import { NextPage } from "next";
import { useCallback } from "react";
import { useRandomName } from "../../src/hooks/useRandomName";

const Create: NextPage = () => {
  const { randomName } = useRandomName();

  const clipboard = useClipboard({ timeout: 500 });

  const copyRandomName = useCallback(() => {
    clipboard.copy(randomName);
  }, [clipboard, randomName]);

  return (
    <Container>
      <Stack>
        <Title sx={{ fontFamily: "Lobster" }} order={1}>
          New Party
        </Title>
        <Group>
          <ActionIcon
            color="pink"
            variant="light"
            sx={{ padding: 4 }}
            onClick={copyRandomName}
          >
            <IconHash />
          </ActionIcon>
          <Title
            order={2}
            size="h1"
            sx={(theme) => ({
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.gray[6]
                  : theme.colors.dark[6],
              fontWeight: "lighter",
            })}
          >
            {randomName}
          </Title>
        </Group>
        <Stack>
          <Title order={3}>General Info</Title>
          <Title order={4}>When?</Title>
          <Checkbox label="Allow Voting" color="pink" />
          <Checkbox label="Allow User Suggestions" color="pink" />
          <Grid columns={2}>
            <Grid.Col span={1}>
              <DatePicker
                placeholder="Date"
                withAsterisk
                size="md"
                inputWrapperOrder={["label", "input", "error", "description"]}
              />
            </Grid.Col>
            <Grid.Col span={1}>
              <TimeInput
                withAsterisk
                size="md"
                inputWrapperOrder={["label", "input", "error", "description"]}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <Button rightIcon={<IconPlus />} variant="default">
                New Option
              </Button>
            </Grid.Col>
          </Grid>
          <Stack>
            <Title order={4}>Where?</Title>
            <Checkbox label="Allow Voting" color="pink" />
            <Checkbox label="Allow User Suggestions" color="pink" />
            <Grid columns={2}>
              <Grid.Col>
                <TextInput
                  withAsterisk
                  icon={<IconMapPin />}
                  description="A Google Maps link is recommended"
                  size="md"
                  sx={(theme) => ({ maxWidth: theme.breakpoints.xs })}
                  inputWrapperOrder={["label", "input", "error", "description"]}
                />
              </Grid.Col>
              <Grid.Col>
                <Button rightIcon={<IconPlus />} variant="default">
                  New Option
                </Button>
              </Grid.Col>
            </Grid>
          </Stack>
          <Button
            color="pink"
            variant="outline"
            size="md"
            sx={{ marginLeft: "auto" }}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Create;
