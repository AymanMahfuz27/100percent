import React, { useState } from "react";
import { GameState } from "../types/game";
import { Item } from "../types/item";
import createState from "../lib/create-state";
import Board from "./board";
import Loading from "./loading";
import Instructions from "./instructions";

const data = {
"Adults who believe in UFOs": 39,
  "Democrats who support the death penalty for convicted murderers": 44,
  "Adults who say they would like to bring back dinosaurs": 12,
  "Adults who say they drink coffee every day": 62,
  "Households are dog owners": 54,
  "Republicans who support requiring police officers to wear body cameras while on duty": 88,
  "Adults who are single": 31,
  "Adults who have at least one tattoo": 26,
  "Democrats who support requiring showing a government photo ID when voting": 48,
  "Adults who wear jeans everyday": 39,
  "Adults who consume dairy everyday": 79,
  // "Adults who say they drink coffee every day": 62,
  "Households with cars": 92,
  "Republicans who support requiring background checks for gun purchases at gun shows or private sales": 82,
  // "Adults who say they would like to bring back dinosaurs": 12,
};

const items: Item[] = Object.entries(data).map(([label, percentage], index) => ({
  id: `item-${index}`,
  label,
  year: percentage, // Using the percentage in place of year
  description: label,
  date_prop_id: "P580", // Arbitrary ID, as it’s not used in comparison
  instance_of: ["statement"],
  image: "", // Placeholder, can be updated to include relevant images
  wikipedia_title: "", // Placeholder
  num_sitelinks: 0,
  occupations: null,
  page_views: 0,
}));


export default function Game() {
  const [state, setState] = useState<GameState | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);

  React.useEffect(() => {
    const initializeGameState = async () => {
      const initialState = await createState(items);
      setState({ ...initialState, isGameOver: false }); // Ensure isGameOver is false
      setLoaded(true);
    };

    initializeGameState();
  }, []);

  const resetGame = React.useCallback(() => {
    (async () => {
      const initialState = await createState(items);
      setState({ ...initialState, isGameOver: false }); // Reset isGameOver on game reset
    })();
  }, []);
  
  


  const [highscore, setHighscore] = React.useState<number>(
    Number(localStorage.getItem("highscore") ?? "0")
  );

  const updateHighscore = React.useCallback((score: number) => {
    localStorage.setItem("highscore", String(score));
    setHighscore(score);
  }, []);

  if (!loaded || state === null) {
    return <Loading />;
  }

  if (!started) {
    return (
      <Instructions highscore={highscore} start={() => setStarted(true)} />
    );
  }

  return (
    <Board
      highscore={highscore}
      state={state}
      setState={setState}
      resetGame={resetGame}
      updateHighscore={updateHighscore}
    />
  );

}