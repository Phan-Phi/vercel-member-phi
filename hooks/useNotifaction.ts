import { useCallback, useState } from "react";

import { useSnackbar } from "notistack";

import axios from "axios";

import get from "lodash/get";

export const useNotification = () => {
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const enqueueSnackbarWithSuccess = useCallback((message: string) => {
    enqueueSnackbar(message, {
      variant: "success",
    });
  }, []);

  const enqueueSnackbarWithError = useCallback((err: unknown) => {
    if (axios.isAxiosError(err)) {
      const message = get(err, "response.data.message");

      if (message) {
        enqueueSnackbar(message, {
          variant: "error",
        });
      }
    }
  }, []);

  return {
    loading,
    setLoading,
    enqueueSnackbar,
    closeSnackbar,
    enqueueSnackbarWithSuccess,
    enqueueSnackbarWithError,
  };
};
