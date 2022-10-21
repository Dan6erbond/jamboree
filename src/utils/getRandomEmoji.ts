import emojis from "emoji-picker-react/src/data/emojis.json";

export const getRandomEmoji = () => {
  const e = [
    ...emojis.activities,
    ...emojis.animals_nature,
    ...emojis.flags,
    ...emojis.food_drink,
    ...emojis.objects,
    ...emojis.smileys_people,
    ...emojis.symbols,
    ...emojis.travel_places,
  ];

  return e[Math.floor(Math.random() * e.length)];
};
