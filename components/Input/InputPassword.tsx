import React, { useCallback, useState } from "react";
import { IconButton, InputAdornment, InputProps } from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import InputBase from "./InputBase";

const InputPassword = (props: InputProps) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const onHandleShowPasswordHandler = useCallback(() => {
    setIsShowPassword((prevState) => {
      return !prevState;
    });
  }, []);

  return (
    <InputBase
      fullWidth
      type={isShowPassword ? "text" : "password"}
      endAdornment={
        <InputAdornment position="end">
          <IconButton onClick={onHandleShowPasswordHandler} edge="end" color="primary2">
            {isShowPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
          </IconButton>
        </InputAdornment>
      }
      {...props}
    />
  );
};

export default InputPassword;
