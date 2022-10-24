import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Group,
  Loader,
  Stack,
  Title,
} from "@mantine/core";
import { IconMapPin, IconPlus } from "@tabler/icons";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BotttsAvatar } from "../../../src/components/bottts-avatar";
import { DateTimePicker } from "../../../src/components/date-time-picker";
import { DebouncedTextInput } from "../../../src/components/debounced-text-input";
import { GET_PARTY } from "../../../src/queries/get-party";
import {
  GetParty,
  GetPartyVariables,
} from "../../../src/queries/__generated__/GetParty";
import { AddDate, AddDateVariables } from "./__generated__/AddDate";
import { AddLocation, AddLocationVariables } from "./__generated__/AddLocation";
import { EditDate, EditDateVariables } from "./__generated__/EditDate";
import {
  EditLocation,
  EditLocationVariables,
} from "./__generated__/EditLocation";
import { EditParty, EditPartyVariables } from "./__generated__/EditParty";

const AdminZoneBanner = dynamic(
  () =>
    import("../../../src/components/admin-zone-banner").then(
      (mod) => mod.AdminZoneBanner
    ),
  { ssr: false }
);

const PartyLink = dynamic(
  () =>
    import("../../../src/components/party-link").then((mod) => mod.PartyLink),
  { ssr: false }
);

const EDIT_PARTY = gql`
  mutation EditParty($options: EditPartyRequest!) {
    editParty(partyOptions: $options) {
      name
      settings {
        dates {
          optionsEnabled
          votingEnabled
        }
        locations {
          votingEnabled
          optionsEnabled
        }
      }
    }
  }
`;

const ADD_LOCATION = gql`
  mutation AddLocation($partyName: String!, $location: String!) {
    addLocation(partyName: $partyName, location: $location) {
      id
      location
      votes {
        id
        username
      }
    }
  }
`;

const ADD_DATE = gql`
  mutation AddDate($partyName: String!, $date: String!) {
    addDate(partyName: $partyName, date: $date) {
      id
      date
      votes {
        id
        username
      }
    }
  }
`;

const EDIT_DATE = gql`
  mutation EditDate($payload: EditDatePayload!) {
    editDate(payload: $payload) {
      id
      date
      votes {
        id
        username
      }
    }
  }
`;

const EDIT_LOCATION = gql`
  mutation EditLocation($payload: EditLocationPayload!) {
    editLocation(payload: $payload) {
      id
      location
      votes {
        id
        username
      }
    }
  }
`;

const Admin: NextPage = () => {
  const router = useRouter();
  const adminCode = useMemo(
    () =>
      Array.isArray(router.query.code)
        ? router.query.code[0]
        : router.query.code!,
    [router]
  );

  const { data, refetch, startPolling } = useQuery<GetParty, GetPartyVariables>(
    GET_PARTY,
    {
      variables: {
        adminCode,
      },
    }
  );
  useEffect(() => {
    // https://github.com/apollographql/apollo-client/issues/9819
    startPolling(500);
  });

  const [newLocation, setNewLocation] = useState("");
  const [showNewLocationOption, setShowNewLocationOption] = useState(true);
  const [addLocation, { loading: addingNewLocation }] = useMutation<
    AddLocation,
    AddLocationVariables
  >(ADD_LOCATION, {
    context: {
      headers: { "x-admin-code": adminCode },
    },
  });

  const newLocationOnChange = useCallback(
    (newLocation: string) => {
      if (newLocation !== "" && !addingNewLocation) {
        setNewLocation(newLocation);
        (async () => {
          await addLocation({
            variables: {
              location: newLocation,
              partyName: data?.party?.name!,
            },
          });
          setShowNewLocationOption(false);
          setNewLocation("");
          refetch();
        })();
      }
    },
    [addingNewLocation, addLocation, data, refetch, setShowNewLocationOption]
  );

  const [editLocation] = useMutation<EditLocation, EditLocationVariables>(
    EDIT_LOCATION,
    {
      context: {
        headers: { "x-admin-code": adminCode },
      },
    }
  );

  // FIXME: onChange parameter isn't correctly cached, causing rerenders and resulting in multiple calls to the "same" handler
  const updateLocation = useCallback(
    (id: number) => (location: string) =>
      editLocation({
        variables: { payload: { id, location } },
      }).then(() => {
        refetch();
      }),
    [refetch, editLocation]
  );

  const [newDate, setNewDate] = useState(new Date());
  const [addDate, { loading: addingNewDate }] = useMutation<
    AddDate,
    AddDateVariables
  >(ADD_DATE, {
    context: {
      headers: { "x-admin-code": adminCode },
    },
  });
  const addNewDate = useCallback(
    (date?: Date) => {
      addDate({
        variables: {
          date: Math.round((date ?? newDate).getTime() / 1000).toString(),
          partyName: data?.party?.name!,
        },
      }).then(() => {
        refetch();
        setNewDate(new Date());
      });
    },
    [newDate, setNewDate, addDate, data, refetch]
  );

  const [editDate] = useMutation<EditDate, EditDateVariables>(EDIT_DATE, {
    context: {
      headers: { "x-admin-code": adminCode },
    },
  });

  const [editParty, { loading: editingParty, data: updateData }] = useMutation<
    EditParty,
    EditPartyVariables
  >(EDIT_PARTY, {
    context: { headers: { "x-admin-code": adminCode } },
  });

  const updateParty = useCallback(
    ({
      dateVotingEnabled,
      dateOptionsEnabled,
      locationVotingEnabled,
      locationOptionsEnabled,
    }: {
      dateVotingEnabled?: boolean;
      dateOptionsEnabled?: boolean;
      locationVotingEnabled?: boolean;
      locationOptionsEnabled?: boolean;
    }) => {
      if (data?.party) {
        editParty({
          variables: {
            options: {
              dateVotingEnabled,
              dateOptionsEnabled,
              locationVotingEnabled,
              locationOptionsEnabled,
              partyName: data.party.name,
            },
          },
        });
      }
    },
    [editParty, data]
  );

  return (
    <Container>
      <Stack>
        <Group>
          <Title sx={{ fontFamily: "Lobster" }} order={1}>
            Admin
          </Title>
          <Box sx={{ flex: 1 }} />
          {data && data.party && data.party.creator && (
            <BotttsAvatar username={data.party.creator} />
          )}
        </Group>
        <PartyLink partyId={data?.party!.name} />
        <Stack>
          <Title order={3}>When?</Title>
          <Group>
            <Group>
              <Checkbox
                label="Allow Voting"
                color="pink"
                checked={data?.party?.settings.dates.votingEnabled}
                onChange={(e) =>
                  updateParty({ dateVotingEnabled: e.target.checked })
                }
                disabled={editingParty}
              />
              {editingParty && <Loader />}
            </Group>
            {data?.party?.settings.dates.votingEnabled && (
              <Group>
                <Checkbox
                  label="Allow User Suggestions"
                  color="pink"
                  checked={data?.party?.settings.dates.optionsEnabled}
                  onChange={(e) =>
                    updateParty({ dateOptionsEnabled: e.target.checked })
                  }
                  disabled={editingParty}
                />
                {editingParty && <Loader />}
              </Group>
            )}
          </Group>
          <Stack>
            {data?.party?.dates.map(({ id, date }) => (
              <DateTimePicker
                key={id}
                value={new Date(Date.parse(date))}
                onChange={(date) => {
                  editDate({
                    variables: {
                      payload: {
                        id,
                        date: Math.round(date.getTime() / 1000).toString(),
                      },
                    },
                  }).then(() => {
                    refetch();
                  });
                }}
              />
            ))}
            <Group>
              {(data?.party?.settings.dates.votingEnabled ||
                data?.party?.dates.length === 0) && (
                <DateTimePicker
                  value={newDate}
                  onChange={(date) => {
                    addNewDate(date);
                  }}
                  disabled={addingNewDate}
                />
              )}
              {addingNewDate && <Loader />}
            </Group>
            <Button
              rightIcon={<IconPlus />}
              variant="default"
              sx={{ alignSelf: "start" }}
              disabled={!data?.party?.settings.dates.votingEnabled}
              onClick={() => addNewDate()}
            >
              New Option
            </Button>
          </Stack>
          <Stack>
            <Title order={3}>Where?</Title>
            <Group>
              <Group>
                <Checkbox
                  label="Allow Voting"
                  color="pink"
                  checked={data?.party?.settings.locations.votingEnabled}
                  onChange={(e) =>
                    updateParty({ locationVotingEnabled: e.target.checked })
                  }
                  disabled={editingParty}
                />
                {editingParty && <Loader />}
              </Group>
              {data?.party?.settings.locations.votingEnabled && (
                <Group>
                  <Checkbox
                    label="Allow User Suggestions"
                    color="pink"
                    checked={data?.party?.settings.locations.optionsEnabled}
                    onChange={(e) =>
                      updateParty({ locationOptionsEnabled: e.target.checked })
                    }
                    disabled={editingParty}
                  />
                  {editingParty && <Loader />}
                </Group>
              )}
            </Group>
            <Stack>
              {data?.party?.locations.map(({ id, location }) => (
                <form
                  key={id}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowNewLocationOption(true);
                  }}
                >
                  <DebouncedTextInput
                    withAsterisk
                    icon={<IconMapPin />}
                    description="A Google Maps link is recommended"
                    size="md"
                    sx={(theme) => ({ maxWidth: theme.breakpoints.xs })}
                    value={location}
                    onChange={updateLocation(id)}
                    inputWrapperOrder={[
                      "label",
                      "input",
                      "error",
                      "description",
                    ]}
                    autoFocus
                    onFocus={(e) => e.currentTarget.select()}
                  />
                </form>
              ))}
              {showNewLocationOption && (
                <Group>
                  {data?.party?.settings.locations.votingEnabled ||
                    (data?.party?.locations.length === 0 && (
                      <DebouncedTextInput
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
                        placeholder="Add new Location"
                        value={newLocation}
                        onChange={newLocationOnChange}
                        disabled={addingNewLocation}
                        autoFocus
                        onFocus={(e) => e.currentTarget.select()}
                      />
                    ))}
                  {addingNewLocation && <Loader />}
                </Group>
              )}
              <Button
                rightIcon={<IconPlus />}
                variant="default"
                sx={{ alignSelf: "start" }}
                onClick={() => setShowNewLocationOption(true)}
                disabled={!data?.party?.settings.locations.votingEnabled}
              >
                New Option
              </Button>
            </Stack>
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
        <AdminZoneBanner />
      </Stack>
    </Container>
  );
};

export default Admin;
