import React from "react";

import { Typography, Stack } from "@mui/material";

const NoData = () => {
  return (
    <Stack alignItems="center">
      <Typography whiteSpace="nowrap">Không có dữ liệu</Typography>
    </Stack>
  );
};

export default NoData;
