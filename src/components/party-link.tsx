import { ActionIcon, Group, Loader, Title, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconHash } from "@tabler/icons";
import { useCallback } from "react";

type PartyLinkProps =
  | { partyId: string; loadingPartyId: undefined | false }
  | { partyId: undefined | string; loadingPartyId?: boolean };

export const PartyLink = ({ partyId, loadingPartyId }: PartyLinkProps) => {
  const clipboard = useClipboard();

  const copyPartyUrl = useCallback(() => {
    clipboard.copy(`${window.location.origin}/parties/join/${partyId}`);
  }, [clipboard, partyId]);

  return (
    <Group>
      <Tooltip label="Copy URL">
        <ActionIcon
          color="pink"
          variant="light"
          sx={{ padding: 4 }}
          onClick={copyPartyUrl}
        >
          <IconHash />
        </ActionIcon>
      </Tooltip>
      {loadingPartyId === true ? (
        <Loader />
      ) : (
        <Title
          order={2}
          size="h1"
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark"
                ? theme.colors.gray[6]
                : theme.colors.dark[6],
            fontWeight: "lighter",
            wordBreak: "break-word",
          })}
        >
          {partyId}
        </Title>
      )}
    </Group>
  );
};
