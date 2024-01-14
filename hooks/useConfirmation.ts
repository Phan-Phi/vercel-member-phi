import { useContext } from "react";

import { ConfirmationContext } from "context/Confirmation";

export const useConfirmation = () => {
  const contextValue = useContext(ConfirmationContext);

  return contextValue;
};
