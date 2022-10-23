import { useLocalStorage } from "@mantine/hooks";

export const useUsername = () =>
  useLocalStorage<string>({
    key: "jamboree-username",
    getInitialValueInEffect: true,
  });
