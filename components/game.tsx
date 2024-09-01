import React, { useState } from "react";
import axios from "axios";
import { GameState } from "../types/game";
import { Item } from "../types/item";
import createState from "../lib/create-state";
import Board from "./board";
import Loading from "./loading";
import Instructions from "./instructions";
import badCards from "../lib/bad-cards";

const data = {
  "Republicans say they would be pleased if the supreme court reduced abortion rights?": 43,
"Republicans say that abortion should never be permitted?": 19,
"Republicans are willing to open up protected nature areas for economic development?": 16,
"Republicans say that the US spends too much on alternative energy sources?": 23,
"Republicans support laws that protect gays and lesbians against job discrimination?": 81,
"Republicans support requiring background checks for gun purchases at gun shows or private sales?": 82,
"Republicans say that the government should make it easier to buy a gun?": 11,
"Republicans say that the US spends too much on the nation's health?": 16,
"Republicans support making all unauthorized immigrants felons and sending them back?": 24,
"Republicans support sending back children who were brought to the US illegally and have lived here for 10+ years?": 21,
"Republicans say that the federal minimum wage should be decreased?": 4,
"Republicans oppose requiring employers to offer paid leave to parents of new children?": 13,
"Republicans say that the police officers never use more force than necessary?": 3,
"Republicans support requiring police officers to wear body cameras while on duty?": 88,
"Republicans say that blacks face no discrimination at all in the US?": 5,
"Republicans believe that the legacy of slavery affects the position of black people in society today?": 68,
"Republicans think that high-income individuals pay the right amount in taxes?": 29,
"Republicans say that eligible voters are never denied the right to vote?": 23,
"Democrats believe that climate change has been mostly due to human activity?": 69,
"Democrats are unwilling to pay much higher prices in order to protect the environment?": 17,
"Democrats support the death penalty for convicted murderers?": 44,
"Democrats oppose making free trade agreements with other countries?": 7,
"Democrats support lowering the eligibility age for Medicare from 65 to 50?": 77,
"Democrats feel that courts deal too harshly with criminals?": 40,
"Democrats say that the US spends too much on reducing crime rates?": 8,
"Democrats believe that the legacy of slavery affects the position of black people in society today?": 97,
"Democrats think that high-income individuals pay too little in taxes?": 75,
"Democrats say that transgender people face no discrimination at all in the US?": 7,
"Democrats support requiring showing a government photo ID when voting?": 48,
"Democrats say that eligible voters are never denied the right to vote?": 7,
"Democrats say that the US spends too little on assistance to the poor?": 44,
"Adults say they would like to bring back dinosaurs?": 12,
"Adults say that chocolate glazed donuts are their favorite donuts?": 12,
"Adults in a relationship met their partner online?": 12,
"Adults have at least one tattoo?": 26,
"Adults are single?": 31,
"Adults consider a hotdog to be a sandwich?": 36,
"Adults believe in ghosts?": 36,
"Adults like their eggs scrambled?": 37,
"Adults believe in UFOs?": 39,
"Dog owners got their dogs from a shelter?": 40,
"Adults set an alarm but do not snooze when waking up?": 40,
"Pet owners dress up their pets for Halloween?": 45,
"Adults say they drink coffee every day?": 62,
"TV-owning adults watched Neil Armstrong set foot on the moon?": 94,
"Adults say they have had a teacher who changed their life for the better?": 94,
"Households are dog owners?": 54,
"Adults in a relationship say they are satisfied with their relationship?": 94,
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
      setState(await createState(items));
      setLoaded(true);
    };

    initializeGameState();
  }, []);

  const resetGame = React.useCallback(() => {
    (async () => {
      setState(await createState(items));
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