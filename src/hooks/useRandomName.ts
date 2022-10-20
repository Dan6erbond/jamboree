import { useCallback, useEffect, useState } from "react";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

export const useRandomName = () => {
  const [randomName, setRandomName] = useState("");

  const generateRandomName = useCallback(() => {
    setRandomName(
      uniqueNamesGenerator({
        separator: "-",
        dictionaries: [adjectives, colors, animals],
      })
    );
  }, [setRandomName]);

  useEffect(() => {
    generateRandomName();
  }, [generateRandomName]);

  return { randomName, generateRandomName };
};
