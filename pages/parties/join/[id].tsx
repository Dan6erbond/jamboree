import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Notification,
  Paper,
  Popover,
  Progress,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import {
  IconHandStop,
  IconHash,
  IconPlus,
  IconThumbUp,
  IconUrgent,
} from "@tabler/icons";
import {
  default as EmojiPicker,
  Emoji,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import { NextPage } from "next";
import { useCallback, useState } from "react";
import { useRandomName } from "../../../src/hooks/useRandomName";

const Join: NextPage = () => {
  const { randomName } = useRandomName();

  const clipboard = useClipboard({ timeout: 500 });

  const copyRandomName = useCallback(() => {
    clipboard.copy(randomName);
  }, [clipboard, randomName]);

  const [showNotification, setShowNotification] = useState(true);

  return (
    <Container>
      <Stack>
        {showNotification && (
          <Notification
            title="Want to help out?"
            color="pink"
            onClose={() => setShowNotification(false)}
          >
            Scroll down to see supplies you can buy or bring!
          </Notification>
        )}
        <Title sx={{ fontFamily: "Lobster" }} order={1}>
          Join Party
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
          <Box sx={{ flex: 1 }} />
          <Tooltip label="Dan6erbond">
            <Avatar color="cyan" radius="xl">
              D6
            </Avatar>
          </Tooltip>
        </Group>
        <Stack>
          <Title order={3}>When?</Title>
          <Button variant="default" rightIcon={<IconThumbUp />}>
            21.10.2022 17:00
          </Button>
          <Progress color="pink" value={50} striped />
          <Avatar.Group spacing="sm">
            <Tooltip label="Dan6erbond">
              <Avatar color="cyan" radius="xl">
                D6
              </Avatar>
            </Tooltip>
            <Tooltip label="Dan6erbond">
              <Avatar color="indigo" radius="xl">
                FF
              </Avatar>
            </Tooltip>
            <Tooltip label="Dan6erbond">
              <Avatar color="red" radius="xl">
                AG
              </Avatar>
            </Tooltip>
          </Avatar.Group>
          <Button rightIcon={<IconPlus />} variant="default">
            New Option
          </Button>
          <Title order={3}>Where?</Title>
          <Button variant="default" rightIcon={<IconThumbUp />}>
            Aarau, Aarau, Schweiz
          </Button>
          <Progress color="pink" value={50} striped />
          <Avatar.Group spacing="sm">
            <Tooltip label="Dan6erbond">
              <Avatar color="cyan" radius="xl">
                D6
              </Avatar>
            </Tooltip>
            <Tooltip label="Dan6erbond">
              <Avatar color="indigo" radius="xl">
                FF
              </Avatar>
            </Tooltip>
            <Tooltip label="Dan6erbond">
              <Avatar color="red" radius="xl">
                AG
              </Avatar>
            </Tooltip>
          </Avatar.Group>
          <Button rightIcon={<IconPlus />} variant="default" disabled>
            New Option
          </Button>
          <Text color="dimmed">
            Voting is disabled for this party, ask an admin to enable it
          </Text>
        </Stack>
        <Stack>
          <Title order={3} size="h2">
            Supplies
          </Title>
          <Divider />
          <Group>
            <Paper sx={(theme) => ({ padding: theme.spacing.md, flex: 1 })}>
              <Stack>
                <Group>
                  <Popover width={350} position="top" shadow="md">
                    <Popover.Target>
                      <Button variant="default">
                        <Emoji
                          unified="1f423"
                          size={25}
                          emojiStyle={EmojiStyle.TWITTER}
                        />
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
                        theme={Theme.DARK}
                        emojiStyle={EmojiStyle.TWITTER}
                      />
                    </Popover.Dropdown>
                  </Popover>
                  <Title>Firewood</Title>
                  <Box sx={{ flex: 1 }}></Box>
                  <Group>
                    <Title size="h6">Quantity</Title>
                    <Text>6</Text>
                  </Group>
                  <Tooltip label="Dan6erbond">
                    <Avatar color="cyan" radius="xl">
                      D6
                    </Avatar>
                  </Tooltip>
                  <Tooltip label="Mark as Urgent">
                    <ActionIcon color="red">
                      <IconUrgent />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Stack>
            </Paper>
            <ActionIcon
              variant="default"
              size="xl"
              sx={{ alignSelf: "stretch", height: "auto", width: 64 }}
            >
              <IconHandStop />
            </ActionIcon>
          </Group>
          <Group>
            <Paper sx={(theme) => ({ padding: theme.spacing.md, flex: 1 })}>
              <Stack>
                <Group>
                  <Popover width={350} position="top" shadow="md">
                    <Popover.Target>
                      <Button variant="default">
                        <Emoji
                          unified="1f423"
                          size={25}
                          emojiStyle={EmojiStyle.TWITTER}
                        />
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
                        theme={Theme.DARK}
                        emojiStyle={EmojiStyle.TWITTER}
                      />
                    </Popover.Dropdown>
                  </Popover>
                  <Title>Firewood</Title>
                  <Box sx={{ flex: 1 }}></Box>
                  <Group>
                    <Title size="h6">Quantity</Title>
                    <Text>6</Text>
                  </Group>
                  <Tooltip label="Dan6erbond">
                    <Avatar color="cyan" radius="xl">
                      D6
                    </Avatar>
                  </Tooltip>
                  <Tooltip label="Mark as Urgent">
                    <ActionIcon color="red" variant="filled">
                      <IconUrgent />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Stack>
            </Paper>
            <ActionIcon
              variant="gradient"
              size="xl"
              sx={{ alignSelf: "stretch", height: "auto", width: 64 }}
            >
              <IconHandStop />
            </ActionIcon>
          </Group>
          <Button rightIcon={<IconPlus />} variant="default">
            Add
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Join;
