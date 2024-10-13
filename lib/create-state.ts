import { GameState } from "../types/game";
import { Item } from "../types/item";
import { getNextItem, preloadImage } from "./items";

export default async function createState(deck: Item[]): Promise<GameState> {
  const firstItem = getNextItem(deck, []);
  if (!firstItem) {
    throw new Error("Deck is empty or has no valid items");
  }

  const played = [{ ...firstItem, played: { correct: true } }];
  const next = getNextItem(deck, played);
  const nextButOne = getNextItem(deck, [...played, ...(next ? [next] : [])]);

  const imageCache = [
    ...(next ? [await preloadImage(next.image)] : []),
    ...(nextButOne ? [await preloadImage(nextButOne.image)] : [])
  ];

  return {
    badlyPlaced: null,
    deck,
    imageCache,
    lives: 3,
    next,
    nextButOne,
    played,
    isGameOver: false,
  };
}
