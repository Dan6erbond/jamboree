import { ActionIcon, Card, Group, Stack, Text, Title } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconCopy } from "@tabler/icons";
import Link from "next/link";

export const AdminZoneBanner = () => {
  const clipboard = useClipboard();

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[2],
      })}
    >
      <Stack>
        <Title>Admin Zone</Title>
        <Text>
          This is your admin page, make sure you save the link or copy it so you
          can use it later to edit your party. You can also share this link with
          others.
        </Text>
        <Group position="center">
          <ActionIcon
            color="pink"
            variant="light"
            sx={{ padding: 4 }}
            onClick={() => clipboard.copy(window.location.href)}
          >
            <IconCopy />
          </ActionIcon>
          <Link href={window.location.href} passHref>
            <Text component="a" color="dimmed" sx={{ wordBreak: "break-all" }}>
              {window.location.href}
            </Text>
          </Link>
        </Group>
      </Stack>
    </Card>
  );
};
