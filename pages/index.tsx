import { Box, Button, Container, Stack, TextInput, Title } from "@mantine/core";
import { IconArrowBigRightLine, IconHash } from "@tabler/icons";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { UsernameModal } from "../src/components/UsernameModal";
import { useUsername } from "../src/hooks/useUsername";

const Home: NextPage = () => {
  const router = useRouter();

  const [modalOpened, setModalOpened] = useState(false);
  const [nextRoute, setNextRoute] = useState("");

  const [partyCode, setPartyCode] = useState("");
  const [partyCodeValid, setPartyCodeValid] = useState(true);

  const [username, setUsername] = useUsername();

  const createParty = useCallback(() => {
    if (!username) {
      setModalOpened(true);
      setNextRoute("/parties/create");
      return;
    }
    router.push("/parties/create");
  }, [username, router]);

  const joinParty = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!partyCode) {
        setPartyCodeValid(false);
      } else if (!username) {
        setModalOpened(true);
        setNextRoute(`/parties/join/${partyCode}`);
      } else {
        router.push(`/parties/join/${partyCode}`);
      }
    },
    [username, router, partyCode]
  );

  const onNameSubmit = useCallback(
    (username: string) => {
      setUsername(username);
      router.push(nextRoute);
    },
    [setUsername, router, nextRoute]
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
