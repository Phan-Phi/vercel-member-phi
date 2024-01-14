import React, { forwardRef } from "react";

import { Input, styled, InputProps, Box, Typography } from "@mui/material";

const InputBaseEndAdornment = forwardRef((props: InputProps, ref) => {
  return <StyledInput {...props} inputRef={ref} />;
});

const StyledInput = styled(Input)(({ theme, disabled }) => {
  return {
    ["& input::placeholder"]: {
      color: theme.palette.grey[900],
    },

    ["&.Mui-disabled"]: {
      backgroundColor: theme.palette.grey[400],
      WebkitTextFillColor: theme.palette.common.black,
    },
    ["&.MuiInputBase-readOnly"]: {
      backgroundColor: theme.palette.grey[400],
      WebkitTextFillColor: theme.palette.common.black,
    },

    ...(disabled && {
      backgroundColor: theme.palette.grey[400],
      WebkitTextFillColor: theme.palette.common.black,

      ["& input::placeholder"]: {
        color: theme.palette.common.black,
      },
    }),
  };
});

InputBaseEndAdornment.displayName = "InputBaseEndAdornment";

export default InputBaseEndAdornment;
