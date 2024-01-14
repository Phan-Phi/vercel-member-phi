import { Box, BoxProps } from "@mui/material";

type PropsTabPanel = {
  children: React.ReactNode;
  value: number;
  index: number;
  BoxProps?: BoxProps;
};

export default function TabPanel({ children, value, index, BoxProps }: PropsTabPanel) {
  return value == index ? (
    <Box hidden={value !== index} {...BoxProps}>
      {children}
    </Box>
  ) : null;
}
