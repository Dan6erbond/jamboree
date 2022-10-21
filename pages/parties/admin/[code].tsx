import {
  ActionIcon,
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
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useClipboard } from "@mantine/hooks";
import { IconCopy, IconMapPin, IconPlus } from "@tabler/icons";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { BotttsAvatar } from "../../../src/components/BotttsAvatar";
import { useGetParty } from "../../../src/hooks/useGetParty";

const PartyLink = dynamic(
  () => {
    return import("../../../src/components/PartyLink").then(
      (mod) => mod.PartyLink
    );
  },
  { ssr: false }
);

const Admin: NextPage = () => {
  const router = useRouter();

  const clipboard = useClipboard({ timeout: 500 });

  const { party, partyId } = useGetParty({
    adminCode: Array.isArray(router.query.code)
      ? router.query.code[0]
      : router.query.code!,
  });

  return (
    <Container>
      <Stack>
        <Group>
          <Title sx={{ fontFamily: "Lobster" }} order={1}>
            Admin
          </Title>
          <Box sx={{ flex: 1 }} />
          {party && party.creator && <BotttsAvatar username={party.creator} />}
        </Group>
        <Group>
          <PartyLink partyId={partyId!} />
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
