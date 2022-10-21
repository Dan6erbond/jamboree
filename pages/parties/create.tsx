import { uuidv4 } from "@firebase/util";
import {
  Button,
  Checkbox,
  Container,
  Group,
  Stack,
  TextInput,
  Title
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMapPin, IconPlus } from "@tabler/icons";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { DateTimePicker } from "../../src/components/DateTimePicker";
import { firestore, partiesCollection } from "../../src/firebase/firestore";
import { useRandomName } from "../../src/hooks/useRandomName";
import { useUsername } from "../../src/hooks/useUsername";
import { Party } from "../../src/types/party";
import { generateString } from "../../src/utils/generateRandomString";

interface PartyFormValues {
  allowVotingWhere: boolean;
  allowOptionsWhere: boolean;
  allowVotingWhen: boolean;
  allowOptionsWhen: boolean;
}

const PartyLink = dynamic(
  () => {
    return import("../../src/components/PartyLink").then(
      (mod) => mod.PartyLink
    );
  },
  { ssr: false }
);

const Create: NextPage = () => {
  const router = useRouter();
  const { randomName, generateRandomName } = useRandomName();
  const [randomNameUnique, setRandomNameUnique] = useState(false);
  const [creatingParty, setCreatingParty] = useState(false);

  const [username] = useUsername();

  useEffect(() => {
    const checkName = async () => {
      if (!randomNameUnique && randomName) {
        const docRef = doc(partiesCollection, randomName);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log(docSnap.exists());
          generateRandomName();
        } else {
          setRandomNameUnique(true);
        }
      }
    };
    checkName();
  }, [randomName, randomNameUnique, generateRandomName]);

  const form = useForm<PartyFormValues>({
    initialValues: {
      allowVotingWhere: true,
      allowOptionsWhere: true,
      allowVotingWhen: true,
      allowOptionsWhen: true,
    },
  });

  const [dates, setDates] = useState<{ uuid: string; date: Date }[]>([
    { uuid: uuidv4(), date: new Date() },
  ]);

  const setDate = useCallback(
    (uuid: string, date: Date) => {
      setDates((dates) =>
        dates.map((dt) => (dt.uuid === uuid ? { ...dt, date } : dt))
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
        <PartyLink partyId={randomName} loadingPartyId={!randomNameUnique} />
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
                  <DateTimePicker
                    key={uuid}
                    value={date}
                    onChange={(date) => setDate(uuid, date)}
                  />
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
