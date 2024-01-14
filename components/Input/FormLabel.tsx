import React from "react";

import { styled, FormLabel, FormLabelProps } from "@mui/material";

const CustomFormLabel = (props: FormLabelProps) => {
  return <StyledFormLabel {...props} />;
};

export default CustomFormLabel;

const StyledFormLabel = styled(FormLabel)(() => {
  return {
    fontWeight: 700,
    paddingBottom: 4,
  };
});
