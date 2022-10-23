import { gql, useMutation, useQuery } from "@apollo/client";
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
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BotttsAvatar } from "../../../src/components/BotttsAvatar";
import { EmojiPickerButton } from "../../../src/components/EmojiPickerButton";
import { UsernameModal } from "../../../src/components/UsernameModal";
import { GET_PARTY } from "../../../src/queries/GetParty";
import {
  GetParty,
  GetPartyVariables,
} from "../../../src/queries/__generated__/GetParty";
import { getRandomEmoji } from "../../../src/utils/getRandomEmoji";
import { isValidUrl } from "../../../src/utils/utils";
import { AddSupply, AddSupplyVariables } from "./__generated__/AddSupply";
import {
  DeleteSupply,
  DeleteSupplyVariables,
} from "./__generated__/DeleteSupply";
import { EditSupply, EditSupplyVariables } from "./__generated__/EditSupply";
import {
  ToggleDateVote,
  ToggleDateVoteVariables,
} from "./__generated__/ToggleDateVote";
import { ToggleLocationVote } from "./__generated__/ToggleLocationVote";

const PartyLink = dynamic(
  () => {
    return import("../../../src/components/PartyLink").then(
      (mod) => mod.PartyLink
    );
  },
  { ssr: false }
);

const ADD_SUPPLY = gql`
  mutation AddSupply($payload: AddSupplyPayload!) {
    addSupply(payload: $payload) {
      id
      name
      quantity
      assignee
      isUrgent
      emoji
    }
  }
`;

const DELETE_SUPPLY = gql`
  mutation DeleteSupply($supplyId: Int!) {
    deleteSupply(supplyId: $supplyId) {
      success
    }
  }
`;

const EDIT_SUPPLY = gql`
  mutation EditSupply($payload: EditSupplyPayload!) {
    editSupply(payload: $payload) {
      id
      assignee
      emoji
      isUrgent
      name
      quantity
    }
  }
`;

const TOGGLE_DATE_VOTE = gql`
  mutation ToggleDateVote($id: Int!, $username: String!) {
    toggleDateVote(partyDateId: $id, username: $username) {
      id
      username
    }
  }
`;

const TOGGLE_LOCATION_VOTE = gql`
  mutation ToggleLocationVote($id: Int!, $username: String!) {
    toggleLocationVote(partyLocationId: $id, username: $username) {
      id
      username
    }
  }
`;

const Join: NextPage = () => {
  const router = useRouter();
  const partyName = useMemo(
    () =>
      Array.isArray(router.query.id) ? router.query.id[0] : router.query.id!,
    [router]
  );
  const { colorScheme } = useMantineColorScheme();

  const [username, setUsername] = useLocalStorage<string>({
    key: "jamboree-username",
    getInitialValueInEffect: true,
  });

  const { data, refetch, startPolling } = useQuery<GetParty, GetPartyVariables>(
    GET_PARTY,
    {
      variables: {
        partyName,
      },
    }
  );
  useEffect(() => {
    // https://github.com/apollographql/apollo-client/issues/9819
    startPolling(500);
  });

  const [showNotification, setShowNotification] = useState(true);

  const totalDateVotes = useMemo(() => {
    let total = 0;
    if (data?.party) {
      for (const date of data?.party.dates) {
        total += date.votes.length;
      }
    }
    return total;
  }, [data]);

  const totalLocationVotes = useMemo(() => {
    let total = 0;
    if (data?.party) {
      for (const location of data?.party.locations) {
        total += location.votes.length;
      }
    }
    return total;
  }, [data]);

  const [newSupplyEmoji, setNewSupplyEmoji] = useState(getRandomEmoji().u);
  const [newSupplyText, setNewSupplyText] = useState("");
  const [newSupplyUrgent, setNewSupplyUrgent] = useState(false);

  const [addNewSupplyMutation] = useMutation<AddSupply, AddSupplyVariables>(
    ADD_SUPPLY,
    {
      variables: {
        payload: {
          partyName: data?.party?.name as string,
          name: newSupplyText,
          emoji: newSupplyEmoji,
          isUrgent: newSupplyUrgent,
        },
      },
    }
  );

  const addNewSupply = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await addNewSupplyMutation();
      refetch();
    },
    [addNewSupplyMutation, refetch]
  );

  const [deleteSupply] = useMutation<DeleteSupply, DeleteSupplyVariables>(
    DELETE_SUPPLY
  );

  const [editSupply] = useMutation<EditSupply, EditSupplyVariables>(
    EDIT_SUPPLY
  );

  const updateSupply = useCallback(
    async (
      id: number,
      newValue: {
        emoji?: string;
        quantity?: number;
        isUrgent?: boolean;
        assignee?: string | null;
      }
    ) => {
      if (newValue.quantity === 0) {
        await deleteSupply({ variables: { supplyId: id } });
        await refetch();
      } else {
        await editSupply({ variables: { payload: { id, ...newValue } } });
      }
    },
    [deleteSupply, editSupply, refetch]
  );

  const [toggleDateVoteMutation] = useMutation<
    ToggleDateVote,
    ToggleDateVoteVariables
  >(TOGGLE_DATE_VOTE);

  const toggleDateVote = useCallback(
    async (id: number) => {
      await toggleDateVoteMutation({ variables: { id, username } });
      await refetch();
    },
    [username, toggleDateVoteMutation, refetch]
  );

  const [toggleLocationVoteMutation] = useMutation<
    ToggleLocationVote,
    ToggleDateVoteVariables
  >(TOGGLE_LOCATION_VOTE);

  const toggleLocationVote = useCallback(
    async (id: number) => {
      await toggleLocationVoteMutation({ variables: { id, username } });
      await refetch();
    },
    [username, toggleLocationVoteMutation, refetch]
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
          {data?.party && data?.party.creator && (
            <BotttsAvatar username={data.party.creator} />
          )}
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
          {data?.party!.dates.map(({ id, date, votes }) => (
            <Stack key={id}>
              <Button
                color="pink"
                variant={
                  votes.findIndex((vote) => vote.username === username) !== -1
                    ? "light"
                    : "default"
                }
                rightIcon={
                  <IconThumbUp
                    fill={
                      votes.findIndex((vote) => vote.username === username) !==
                      -1
                        ? "white"
                        : "none"
                    }
                  />
                }
                onClick={() => toggleDateVote(id)}
              >
                {new Date(Date.parse(date)).toLocaleString()}
              </Button>
              <Progress
                color="pink"
                value={(votes.length / totalDateVotes) * 100}
                striped
              />
              <Avatar.Group spacing="sm">
                {votes.map((vote) => (
                  <BotttsAvatar key={vote.username} username={vote.username} />
                ))}
              </Avatar.Group>
            </Stack>
          ))}
          {data?.party!.settings.dates.optionsEnabled && (
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
          {data?.party!.locations.map(({ id, location, votes }) => (
            <Stack key={id}>
              <Group>
                <Button
                  color="pink"
                  variant={
                    votes.findIndex((vote) => vote.username === username) !== -1
                      ? "light"
                      : "default"
                  }
                  rightIcon={
                    <IconThumbUp
                      fill={
                        votes.findIndex(
                          (vote) => vote.username === username
                        ) !== -1
                          ? "white"
                          : "none"
                      }
                    />
                  }
                  sx={{ flex: 1 }}
                  onClick={() => toggleLocationVote(id)}
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
                {votes.map((vote) => (
                  <BotttsAvatar key={vote.username} username={vote.username} />
                ))}
              </Avatar.Group>
            </Stack>
          ))}
          {data?.party!.settings.locations.optionsEnabled && (
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
          {data
            ?.party!.supplies.sort((supply) => (supply.isUrgent ? 1 : -1))
            .map(({ assignee, isUrgent, name, quantity, id, emoji }) => (
              <Group key={id}>
                <Paper
                  sx={(theme) => ({
                    padding: theme.spacing.md,
                    flex: 1,
                    borderColor: isUrgent
                      ? theme.colors.red[7]
                      : theme.colors.gray[8],
                    borderWidth: 2,
                    borderStyle: "solid",
                  })}
                >
                  <Stack>
                    <Group>
                      <EmojiPickerButton
                        value={emoji}
                        onChange={(e) => updateSupply(id, { emoji: e.unified })}
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
                            updateSupply(id, { isUrgent: !isUrgent })
                          }
                        >
                          <IconUrgent />
                        </ActionIcon>
                      </Tooltip>
                      <Button.Group>
                        <Button
                          variant="default"
                          onClick={() =>
                            updateSupply(id, { quantity: ++quantity })
                          }
                        >
                          <IconPlus />
                        </Button>
                        <Button
                          variant="default"
                          onClick={() =>
                            updateSupply(id, { quantity: --quantity })
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
                  onClick={() =>
                    updateSupply(id, {
                      assignee: assignee === username ? "" : username,
                    })
                  }
                >
                  <IconHandStop />
                </ActionIcon>
              </Group>
            ))}
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
