import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useClipboard } from "@mantine/hooks";
import { IconCopy, IconHash, IconMapPin, IconPlus } from "@tabler/icons";
import { NextPage } from "next";
import Link from "next/link";
import { useRandomName } from "../../../src/hooks/useRandomName";

const Admin: NextPage = () => {
  const { randomName } = useRandomName();

  const clipboard = useClipboard({ timeout: 500 });

  return (
    <Container>
      <Stack>
        <Title sx={{ fontFamily: "Lobster" }} order={1}>
          Admin
        </Title>
        <Group>
          <ActionIcon
            color="pink"
            variant="light"
            sx={{ padding: 4 }}
            onClick={() => clipboard.copy(randomName)}
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
          <Box sx={{ flex: 1 }} />
          <Tooltip label="Dan6erbond">
            <Avatar color="cyan" radius="xl">
              D6
            </Avatar>
          </Tooltip>
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
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[2],
            })}
          >
            <Title>Admin Zone</Title>
            <Text>
              This is your admin page, make sure you save the link or copy it so
              you can use it later to edit your party. You can also share this
              link with others.
            </Text>
            <Group position="center">
              <ActionIcon
                color="pink"
                variant="light"
                sx={{ padding: 4 }}
                onClick={() => clipboard.copy(window.location.href)}
              >
                <IconCopy />
              </ActionIcon>
              <Link href={window.location.href} passHref>
                <Text component="a" color="dimmed">
                  {window.location.href}
                </Text>
              </Link>
            </Group>
          </Card>
          <Button
            color="pink"
            variant="outline"
            size="md"
            sx={{ marginLeft: "auto" }}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Admin;