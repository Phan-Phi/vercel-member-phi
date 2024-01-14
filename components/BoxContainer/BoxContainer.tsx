import { Box, useTheme } from "@mui/material";
import React from "react";

interface PropsContainer {
  children: React.ReactNode;
}

export default function BoxContainer({ children }: PropsContainer) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        borderRadius: "0.8rem",
        padding: "1.9rem 1.2rem  1.2rem  1.2rem",
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
      }}
    >
      {children}
    </Box>
  );
}
