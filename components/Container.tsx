import React from "react";
import { Container as MuiContainer, ContainerProps } from "@mui/material";

const Container = (props: ContainerProps) => {
  const { children } = props;

  return <MuiContainer {...props}>{children}</MuiContainer>;
};

export default Container;
