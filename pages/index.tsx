import { gql, useMutation } from "@apollo/client";
import { Box, Button, Container, Stack, TextInput, Title } from "@mantine/core";
import { IconArrowBigRightLine, IconHash } from "@tabler/icons";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { UsernameModal } from "../src/components/UsernameModal";
import { useUsername } from "../src/hooks/useUsername";
import { CreateParty, CreatePartyVariables } from "./__generated__/CreateParty";

const CREATE_PARTY = gql`
  mutation CreateParty($username: String!) {
    createParty(username: $username) {
      name
      adminCode
    }
  }
`;

const Home: NextPage = () => {
  const router = useRouter();

  const [modalOpened, setModalOpened] = useState(false);
  const [onUsernameSetAction, setOnUsernameSetAction] = useState<
    "" | "createParty" | "joinParty"
  >("");

  const [partyCode, setPartyCode] = useState("");
  const [partyCodeValid, setPartyCodeValid] = useState(true);

  const [username, setUsername] = useUsername();

  const [createPartyMutation, { data, loading, error }] = useMutation<
    CreateParty,
    CreatePartyVariables
  >(CREATE_PARTY, { variables: { username } });

  useEffect(() => {
    if (data?.createParty.adminCode) {
      router.push(`/parties/admin/${data?.createParty.adminCode}`);
    }
  }, [router, data]);

  const createParty = useCallback(() => {
    if (!username) {
      setModalOpened(true);
      setOnUsernameSetAction("createParty");
      return;
    }
    createPartyMutation();
  }, [username, createPartyMutation]);

  const joinParty = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!partyCode) {
        setPartyCodeValid(false);
      } else if (!username) {
        setModalOpened(true);
        setOnUsernameSetAction(`joinParty`);
      } else {
        router.push(`/parties/join/${partyCode}`);
      }
    },
    [username, router, partyCode]
  );

  const onNameSubmit = useCallback(
    (username: string) => {
      setUsername(username);
      switch (onUsernameSetAction) {
        case "createParty":
          createPartyMutation();
          break;
        case "joinParty":
          router.push(`/parties/join/${partyCode}`);
      }
    },
    [setUsername, router, onUsernameSetAction, partyCode, createPartyMutation]
  );

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 64,
      }}
    >
      <UsernameModal opened={modalOpened} onSubmit={onNameSubmit} />
      <Box sx={{ height: 64 }} />
      <Title
        sx={{ fontFamily: "Lobster", fontSize: "4rem", textAlign: "center" }}
      >
        Plan your own Party Right
      </Title>
      <Button
        sx={{ margin: "0 auto" }}
        rightIcon={<IconArrowBigRightLine />}
        variant="filled"
        color="pink"
        radius="lg"
        size="md"
        onClick={createParty}
        loading={loading}
      >
        Plan Now
      </Button>
      <form onSubmit={joinParty}>
        <Stack>
          <Title>Have a Party Code?</Title>
          <TextInput
            icon={<IconHash />}
            placeholder="your-party-code"
            size="md"
            error={!partyCodeValid}
            onChange={(e) => setPartyCode(e.target.value)}
          />
        </Stack>
      </form>
    </Container>
  );
};

export default Home;
