import { uuidv4 } from "@firebase/util";
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
  Progress,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  IconCheck,
  IconExternalLink,
  IconHandStop,
  IconMinus,
  IconPlus,
  IconThumbUp,
  IconUrgent,
  IconZzz,
} from "@tabler/icons";
import { Timestamp, updateDoc } from "firebase/firestore";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { BotttsAvatar } from "../../../src/components/BotttsAvatar";
import { EmojiPickerButton } from "../../../src/components/EmojiPickerButton";
import { UsernameModal } from "../../../src/components/UsernameModal";
import { useGetParty } from "../../../src/hooks/useGetParty";
import { getRandomEmoji } from "../../../src/utils/getRandomEmoji";
import { isValidUrl } from "../../../src/utils/utils";

const PartyLink = dynamic(
  () => {
    return import("../../../src/components/PartyLink").then(
      (mod) => mod.PartyLink
    );
  },
  { ssr: false }
);

const Join: NextPage = () => {
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();

  const [username, setUsername] = useLocalStorage<string>({
    key: "jamboree-username",
    getInitialValueInEffect: true,
  });

  const { party, docRef, getParty } = useGetParty({
    id: Array.isArray(router.query.id) ? router.query.id[0] : router.query.id!,
  });

  const [showNotification, setShowNotification] = useState(true);

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

  const [newSupplyEmoji, setNewSupplyEmoji] = useState(getRandomEmoji().u);
  const [newSupplyText, setNewSupplyText] = useState("");
  const [newSupplyUrgent, setNewSupplyUrgent] = useState(false);

  const addNewSupply = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (party) {
        const newParty = {
          supplies: [
            ...party.supplies,
            {
              uuid: uuidv4(),
              name: newSupplyText,
              quantity: 1,
              assignee: null,
              isUrgent: newSupplyUrgent,
              emoji: newSupplyEmoji,
            },
          ],
        };
        await updateDoc(docRef!, newParty);
        getParty();
        setNewSupplyEmoji(getRandomEmoji().u);
      }
    },
    [
      newSupplyText,
      newSupplyUrgent,
      newSupplyEmoji,
      setNewSupplyEmoji,
      party,
      docRef,
      getParty,
    ]
  );

  const updateSupply = useCallback(
    async (
      uuid: string,
      newValue: {
        emoji?: string;
        quantity?: number;
        isUrgent?: boolean;
        assignee?: string | null;
      }
    ) => {
      if (party) {
        if (newValue.quantity === 0) {
          await updateDoc(docRef!, {
            supplies: party.supplies.filter((supply) => supply.uuid !== uuid),
          });
          getParty();
          return;
        }
        await updateDoc(docRef!, {
          supplies: party.supplies.map((supply) => {
            if (supply.uuid === uuid) {
              if (newValue.emoji) {
                return {
                  ...supply,
                  emoji: newValue.emoji,
                };
              }
              if (newValue.quantity) {
                return {
                  ...supply,
                  quantity: newValue.quantity,
                };
              }
              if (newValue.isUrgent !== undefined) {
                return {
                  ...supply,
                  isUrgent: newValue.isUrgent,
                };
              }
              if (newValue.assignee !== undefined) {
                return {
                  ...supply,
                  assignee: newValue.assignee,
                };
              }
            }
            return supply;
          }),
        });
        getParty();
      }
    },
    [party, docRef, getParty]
  );

  const toggleDateVote = useCallback(
    async (uuid: string) => {
      if (party) {
        const newParty = {
          dates: party.dates.map((dt) => {
            if (dt.uuid === uuid) {
              if (dt.votes.includes(username)) {
                return {
                  ...dt,
                  votes: dt.votes.filter((val) => val !== username),
                };
              } else {
                return {
                  ...dt,
                  votes: [...dt.votes, username],
                };
              }
            }
            return dt;
          }),
        };
        await updateDoc(docRef!, newParty);
        getParty();
      }
    },
    [username, party, docRef, getParty]
  );

  const toggleLocationVote = useCallback(
    async (uuid: string) => {
      if (party) {
        const newParty = {
          locations: party.locations.map((loc) => {
            if (loc.uuid === uuid) {
              if (loc.votes.includes(username)) {
                return {
                  ...loc,
                  votes: loc.votes.filter((val) => val !== username),
                };
              } else {
                return {
                  ...loc,
                  votes: [...loc.votes, username],
                };
              }
            }
            return loc;
          }),
        };
        await updateDoc(docRef!, newParty);
        getParty();
      }
    },
    [username, party, docRef, getParty]
  );

  return (
    <Container>
      <UsernameModal opened={!username} onSubmit={setUsername} />
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
        <Group>
          <Title sx={{ fontFamily: "Lobster" }} order={1}>
            Join Party
          </Title>
          {party && party.creator && <BotttsAvatar username={party.creator} />}
        </Group>
        <PartyLink
          partyId={
            Array.isArray(router.query.id)
              ? router.query.id[0]
              : router.query.id!
          }
        />
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
                onClick={() => toggleDateVote(uuid)}
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
                  <BotttsAvatar key={user} username={user} />
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
              <Group>
                <Button
                  color="pink"
                  variant={votes.includes(username) ? "light" : "default"}
                  rightIcon={
                    <IconThumbUp
                      fill={votes.includes(username) ? "white" : "none"}
                    />
                  }
                  sx={{ flex: 1 }}
                  onClick={() => toggleLocationVote(uuid)}
                >
                  {location}
                </Button>
                {isValidUrl(location) && (
                  <ActionIcon component="a" href={location}>
                    <IconExternalLink />
                  </ActionIcon>
                )}
              </Group>
              <Progress
                color="pink"
                value={(votes.length / totalLocationVotes) * 100}
                striped
              />
              <Avatar.Group spacing="sm">
                {votes.map((user) => (
                  <BotttsAvatar key={user} username={user} />
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
                      <EmojiPickerButton
                        value={emoji}
                        onChange={(e) =>
                          updateSupply(uuid, { emoji: e.unified })
                        }
                      />
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
                          variant={isUrgent ? "filled" : "light"}
                          onClick={() =>
                            updateSupply(uuid, { isUrgent: !isUrgent })
                          }
                        >
                          <IconUrgent />
                        </ActionIcon>
                      </Tooltip>
                      <Button.Group>
                        <Button
                          variant="default"
                          onClick={() =>
                            updateSupply(uuid, { quantity: ++quantity })
                          }
                        >
                          <IconPlus />
                        </Button>
                        <Button
                          variant="default"
                          onClick={() =>
                            updateSupply(uuid, { quantity: --quantity })
                          }
                        >
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
            <form onSubmit={addNewSupply}>
              <Group>
                <EmojiPickerButton
                  value={newSupplyEmoji}
                  onChange={(e) => setNewSupplyEmoji(e.unified)}
                />
                <TextInput
                  sx={{
                    flex: 1,
                    minWidth: 250,
                  }}
                  value={newSupplyText}
                  onChange={(e) => setNewSupplyText(e.target.value)}
                />
                <Switch
                  color="red"
                  size="lg"
                  onLabel={<IconUrgent />}
                  offLabel={<IconZzz />}
                  checked={newSupplyUrgent}
                  onChange={(event) =>
                    setNewSupplyUrgent(event.currentTarget.checked)
                  }
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
