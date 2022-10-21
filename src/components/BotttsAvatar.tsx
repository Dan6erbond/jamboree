import { Avatar, Tooltip } from "@mantine/core";

interface BotttsAvatarProps {
  username: string;
}

export const BotttsAvatar = ({ username }: BotttsAvatarProps) => {
  return (
    <Tooltip label={username}>
      <Avatar
        radius="xl"
        src={`https://avatars.dicebear.com/api/bottts/${username}.svg`}
      />
    </Tooltip>
  );
};
