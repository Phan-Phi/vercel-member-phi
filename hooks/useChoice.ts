import { useContext } from "react";

import { ChoiceContext } from "context/Choice";

export const useChoice = () => {
  const data = useContext(ChoiceContext);

  return data;
};
