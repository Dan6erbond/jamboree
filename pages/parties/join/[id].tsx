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
  Switch,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useClipboard, useLocalStorage } from "@mantine/hooks";
import {
  IconCheck,
  IconHandStop,
  IconHash,
  IconMinus,
  IconPlus,
  IconThumbUp,
  IconUrgent,
  IconZzz,
} from "@tabler/icons";
import {
  default as EmojiPicker,
  Emoji,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import emojis from "emoji-picker-react/src/data/emojis.json";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { firestore } from "../../../src/firebase/firestore";
import { useRandomName } from "../../../src/hooks/useRandomName";
import { Party } from "../../../src/types/party";

const Join: NextPage = () => {
  const router = useRouter();
  const { randomName } = useRandomName();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const [username, setUsername] = useLocalStorage<string>({
    key: "jamboree-username",
    getInitialValueInEffect: true,
  });

  const [party, setParty] = useState<Party | null>(null);
  console.log(party);

  const clipboard = useClipboard({ timeout: 500 });

  const copyRandomName = useCallback(() => {
    clipboard.copy(randomName);
  }, [clipboard, randomName]);

  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    (async () => {
      const docRef = doc(
        firestore,
        "parties",
        Array.isArray(router.query.id) ? router.query.id[0] : router.query.id!
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setParty(docSnap.data() as Party);
      }
    })();
  }, [setParty, router]);

  const totalDateVotes = useMemo(() => {
    let total = 0;
    if (party) {
      for (const date of party.dates) {
        total += date.votes.length;
      }
    }
    return total;
  }, [party]);

  const totalLocationVotes = useMemo(() => {
    let total = 0;
    if (party) {
      for (const location of party.locations) {
        total += location.votes.length;
      }
    }
    return total;
  }, [party]);

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
          <Tooltip label="Copy URL">
            <ActionIcon
              color="pink"
              variant="light"
              sx={{ padding: 4 }}
              onClick={copyRandomName}
            >
              <IconHash />
            </ActionIcon>
          </Tooltip>
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
          <Tooltip label={party?.creator}>
            <Avatar
              radius="xl"
              src={`https://avatars.dicebear.com/api/bottts/${party?.creator}.svg`}
            />
          </Tooltip>
        </Group>
        <Stack>
          <Title order={3}>When?</Title>
          {party?.dates.map(({ uuid, date, votes }) => (
            <Stack key={uuid}>
              <Button
                color="pink"
                variant={votes.includes(username) ? "light" : "default"}
                rightIcon={
                  <IconThumbUp
                    fill={votes.includes(username) ? "white" : "none"}
                  />
                }
              >
                {(date as unknown as Timestamp).toDate().toLocaleString()}
              </Button>
              <Progress
                color="pink"
                value={(votes.length / totalDateVotes) * 100}
                striped
              />
              <Avatar.Group spacing="sm">
                {votes.map((user) => (
                  <Tooltip label={user} key={user}>
                    <Avatar
                      radius="xl"
                      src={`https://avatars.dicebear.com/api/bottts/${user}.svg`}
                    />
                  </Tooltip>
                ))}
              </Avatar.Group>
            </Stack>
          ))}
          {party?.settings.date.userOptions && (
            <Stack>
              <Button rightIcon={<IconPlus />} variant="default" disabled>
                New Option
              </Button>
              <Text color="dimmed">
                User suggestions are disabled for this party, ask an admin to
                enable it
              </Text>
            </Stack>
          )}
          <Title order={3}>Where?</Title>
          {party?.locations.map(({ uuid, location, votes }) => (
            <Stack key={uuid}>
              <Button
                color="pink"
                variant={votes.includes(username) ? "light" : "default"}
                rightIcon={
                  <IconThumbUp
                    fill={votes.includes(username) ? "white" : "none"}
                  />
                }
              >
                {location}
              </Button>
              <Progress
                color="pink"
                value={(votes.length / totalLocationVotes) * 100}
                striped
              />
              <Avatar.Group spacing="sm">
                {votes.map((user) => (
                  <Tooltip label={user} key={user}>
                    <Avatar
                      radius="xl"
                      src={`https://avatars.dicebear.com/api/bottts/${user}.svg`}
                    />
                  </Tooltip>
                ))}
              </Avatar.Group>
            </Stack>
          ))}
          {party?.settings.location.userOptions && (
            <Stack>
              <Button rightIcon={<IconPlus />} variant="default" disabled>
                New Option
              </Button>
              <Text color="dimmed">
                User suggestions are disabled for this party, ask an admin to
                enable it
              </Text>
            </Stack>
          )}
        </Stack>
        <Stack>
          <Title order={3} size="h2">
            Supplies
          </Title>
          <Divider />
          {party?.supplies.map(
            ({ assignee, isUrgent, name, quantity, uuid, emoji }) => (
              <Group key={uuid}>
                <Paper
                  sx={(theme) => ({
                    padding: theme.spacing.md,
                    flex: 1,
                    background: isUrgent ? theme.colors.red[5] : undefined,
                  })}
                >
                  <Stack>
                    <Group>
                      <Popover width={350} position="top" shadow="md">
                        <Popover.Target>
                          <Button variant="default">
                            <Emoji
                              unified={emoji}
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
                            theme={
                              colorScheme === "dark" ? Theme.DARK : Theme.LIGHT
                            }
                            emojiStyle={EmojiStyle.TWITTER}
                          />
                        </Popover.Dropdown>
                      </Popover>
                      <Group spacing={4} align="top">
                        <Text size="xl">{quantity}</Text>
                        <Text size="xl" color="dimmed">
                          x
                        </Text>
                        <Title>{name}</Title>
                      </Group>
                      <Box sx={{ flex: 1 }}></Box>
                      {assignee && (
                        <Tooltip label={assignee}>
                          <Avatar
                            radius="xl"
                            src={`https://avatars.dicebear.com/api/bottts/${assignee}.svg`}
                          />
                        </Tooltip>
                      )}
                      <Tooltip label="Mark as Urgent">
                        <ActionIcon
                          color="red"
                          variant={isUrgent ? "light" : "filled"}
                        >
                          <IconUrgent />
                        </ActionIcon>
                      </Tooltip>
                      <Button.Group>
                        <Button variant="default">
                          <IconPlus />
                        </Button>
                        <Button variant="default">
                          <IconMinus />
                        </Button>
                      </Button.Group>
                    </Group>
                  </Stack>
                </Paper>
                <ActionIcon
                  variant={assignee === username ? "gradient" : "default"}
                  size="xl"
                  sx={{ alignSelf: "stretch", height: "auto", width: 64 }}
                >
                  <IconHandStop />
                </ActionIcon>
              </Group>
            )
          )}
          <Paper
            sx={(theme) => ({
              padding: theme.spacing.md,
              flex: 1,
              background: true ? undefined : theme.colors.red[5],
            })}
          >
            <form>
              <Group>
                <Popover width={350} position="top" shadow="md">
                  <Popover.Target>
                    <Button variant="default">
                      <Emoji
                        unified={
                          emojis.smileys_people[
                            Math.round(
                              Math.random() * (emojis.smileys_people.length - 1)
                            )
                          ].u
                        }
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
                      theme={colorScheme === "dark" ? Theme.DARK : Theme.LIGHT}
                      emojiStyle={EmojiStyle.TWITTER}
                    />
                  </Popover.Dropdown>
                </Popover>
                <TextInput sx={{ flex: 1 }} />
                <Switch
                  color="red"
                  size="lg"
                  onLabel={<IconUrgent />}
                  offLabel={<IconZzz />}
                />
                <Button variant="default" type="submit">
                  <IconCheck />
                </Button>
              </Group>
            </form>
          </Paper>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Join;
