import {
  ActionIcon,
  Button,
  Checkbox,
  Container,
  Group,
  Loader,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useClipboard, useLocalStorage } from "@mantine/hooks";
import { IconHash, IconMapPin, IconPlus } from "@tabler/icons";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { firestore } from "../../src/firebase/firestore";
import { useRandomName } from "../../src/hooks/useRandomName";
import { Party } from "../../src/types/party";
import { generateString } from "../../src/utils/generateRandomString";

interface PartyFormValues {
  allowVotingWhere: boolean;
  allowOptionsWhere: boolean;
  allowVotingWhen: boolean;
  allowOptionsWhen: boolean;
}

const Create: NextPage = () => {
  const router = useRouter();
  const { randomName, generateRandomName } = useRandomName();
  const [randomNameUnique, setRandomNameUnique] = useState(false);
  const [creatingParty, setCreatingParty] = useState(false);

  const [username, setUsername] = useLocalStorage<string>({
    key: "jamboree-username",
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    const checkName = async () => {
      if (!randomNameUnique && randomName) {
        const docRef = doc(firestore, "parties", randomName);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          generateRandomName();
        } else {
          setRandomNameUnique(true);
        }
      }
    };
    checkName();
  }, [randomName, randomNameUnique, generateRandomName]);

  const clipboard = useClipboard({ timeout: 500 });

  const copyRandomName = useCallback(() => {
    clipboard.copy(`${window.location.origin}/parties/join/${randomName}`);
  }, [clipboard, randomName]);

  const form = useForm<PartyFormValues>({
    initialValues: {
      allowVotingWhere: true,
      allowOptionsWhere: true,
      allowVotingWhen: true,
      allowOptionsWhen: true,
    },
  });

  const [dates, setDates] = useState<{ uuid: string; date: Date | null }[]>([
    { uuid: uuidv4(), date: new Date() },
  ]);

  const setDate = useCallback(
    (uuid: string, date: Date | null, setter: "time" | "date") => {
      setDates((dates) =>
        dates.map((dt) => {
          if (dt.uuid === uuid) {
            if (date === null) {
              return { uuid, date: null };
            }
            const newDate = new Date();
            if (dt.date) {
              switch (setter) {
                case "date":
                  newDate.setHours(dt.date.getHours());
                  newDate.setMinutes(dt.date.getMinutes());

                  newDate.setDate(date.getDate());
                  newDate.setMonth(date.getMonth());
                  newDate.setFullYear(date.getFullYear());
                  break;
                case "time":
                  newDate.setDate(dt.date.getDate());
                  newDate.setMonth(dt.date.getMonth());
                  newDate.setFullYear(dt.date.getFullYear());

                  newDate.setHours(date.getHours());
                  newDate.setMinutes(date.getMinutes());
                  break;
              }
            }
            return { uuid, date: newDate };
          }
          return dt;
        })
      );
    },
    [setDates]
  );

  const [locations, setLocations] = useState([
    { uuid: uuidv4(), location: "" },
  ]);

  const setLocation = useCallback(
    (uuid: string, location: string) => {
      setLocations((locations) =>
        locations.map((l) => (l.uuid === uuid ? { uuid, location } : l))
      );
    },
    [setLocations]
  );

  const createParty = useCallback(
    (values: PartyFormValues) => {
      if (creatingParty) return;
      const adminCode = generateString(64);
      const party: Party = {
        adminCode,
        dates: dates.map((d) => ({
          ...d,
          date: d.date!,
          votes: new Array<string>(),
        })),
        locations: locations.map((l) => ({ ...l, votes: [] })),
        creator: username,
        settings: {
          date: {
            votingEnabled: values.allowVotingWhen,
            userOptions: values.allowOptionsWhen,
          },
          location: {
            votingEnabled: values.allowVotingWhere,
            userOptions: values.allowOptionsWhere,
          },
        },
        supplies: [],
        songPlaylists: [],
      };
      const saveToFirestore = async () => {
        const docRef = doc(firestore, "parties", randomName);
        setCreatingParty(true);
        await setDoc(docRef, party);
        router.replace(`/parties/admin/${adminCode}`);
      };
      saveToFirestore();
    },
    [
      creatingParty,
      dates,
      locations,
      randomName,
      router,
      setCreatingParty,
      username,
    ]
  );

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
            onClick={randomNameUnique ? copyRandomName : undefined}
          >
            <IconHash />
          </ActionIcon>
          {randomNameUnique ? (
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
          ) : (
            <Loader />
          )}
        </Group>
        <form onSubmit={form.onSubmit(createParty)}>
          <Stack>
            <Title order={3}>When?</Title>
            <Group>
              <Checkbox
                label="Allow Voting"
                color="pink"
                {...form.getInputProps("allowVotingWhen", { type: "checkbox" })}
              />
              {form.values.allowVotingWhen && (
                <Checkbox
                  label="Allow User Suggestions"
                  color="pink"
                  {...form.getInputProps("allowOptionsWhen", {
                    type: "checkbox",
                  })}
                />
              )}
            </Group>
            <Stack>
              <Stack>
                {dates.map(({ uuid, date }, idx) => (
                  <Group key={uuid}>
                    <DatePicker
                      placeholder="Date"
                      withAsterisk
                      size="md"
                      disabled={!form.values.allowVotingWhen && idx !== 0}
                      value={date}
                      onChange={(d) => setDate(uuid, d, "date")}
                    />
                    <TimeInput
                      withAsterisk
                      size="md"
                      disabled={!form.values.allowVotingWhen && idx !== 0}
                      value={date}
                      onChange={(d) => setDate(uuid, d, "time")}
                    />
                  </Group>
                ))}
              </Stack>
              {form.values.allowVotingWhen && (
                <Button
                  rightIcon={<IconPlus />}
                  variant="default"
                  sx={{ alignSelf: "start" }}
                  onClick={() =>
                    setDates((dates) => [
                      ...dates,
                      { uuid: uuidv4(), date: new Date() },
                    ])
                  }
                >
                  New Option
                </Button>
              )}
            </Stack>
            <Stack>
              <Title order={3}>Where?</Title>
              <Group>
                <Checkbox
                  label="Allow Voting"
                  color="pink"
                  {...form.getInputProps("allowVotingWhere", {
                    type: "checkbox",
                  })}
                />
                {form.values.allowVotingWhere && (
                  <Checkbox
                    label="Allow User Suggestions"
                    color="pink"
                    {...form.getInputProps("allowOptionsWhere", {
                      type: "checkbox",
                    })}
                  />
                )}
              </Group>
              <Stack>
                {locations.map(({ uuid, location }, idx) => (
                  <TextInput
                    withAsterisk
                    icon={<IconMapPin />}
                    description="A Google Maps link is recommended"
                    size="md"
                    sx={(theme) => ({ maxWidth: theme.breakpoints.xs })}
                    inputWrapperOrder={[
                      "label",
                      "input",
                      "error",
                      "description",
                    ]}
                    key={uuid}
                    value={location}
                    onChange={(e) => setLocation(uuid, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        location.trim() !== "" &&
                          setLocations((locations) => [
                            ...locations,
                            { uuid: uuidv4(), location: "" },
                          ]);
                      }
                    }}
                    autoFocus
                    onFocus={(e) => e.currentTarget.select()}
                    disabled={!form.values.allowVotingWhere && idx !== 0}
                  />
                ))}
                {form.values.allowVotingWhere && (
                  <Button
                    rightIcon={<IconPlus />}
                    variant="default"
                    sx={{ alignSelf: "start" }}
                    onClick={() =>
                      setLocations((locations) => [
                        ...locations,
                        { uuid: uuidv4(), location: "" },
                      ])
                    }
                    disabled={
                      locations[locations.length - 1].location.trim() === ""
                    }
                  >
                    New Option
                  </Button>
                )}
              </Stack>
            </Stack>
            <Button
              color="pink"
              variant="outline"
              size="md"
              sx={{ marginLeft: "auto" }}
              type="submit"
              loading={creatingParty}
            >
              Create
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};

export default Create;
