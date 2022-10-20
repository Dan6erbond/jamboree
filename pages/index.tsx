import {
  Box,
  Button,
  Container,
  Modal,
  Stack,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconArrowBigRightLine, IconHash, IconUser } from "@tabler/icons";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  const theme = useMantineTheme();

  const [modalOpened, setModalOpened] = useState(false);
  const [nextRoute, setNextRoute] = useState("");

  const [nameInput, setNameInput] = useState("");
  const [nameInputValid, setNameInputValid] = useState(true);

  const [partyCode, setPartyCode] = useState("");
  const [partyCodeValid, setPartyCodeValid] = useState(true);

  const [username, setUsername] = useLocalStorage<string>({
    key: "jamboree-username",
    getInitialValueInEffect: true,
  });

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

  const onModalClose = useCallback(() => {}, []);

  const onNameSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (nameInput) {
        setUsername(nameInput);
        router.push(nextRoute);
      } else {
        setNameInputValid(false);
      }
    },
    [setUsername, nameInput, nextRoute, router, setNameInputValid]
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
      <Modal
        opened={modalOpened}
        onClose={onModalClose}
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
