import { Box, BoxProps } from "@mui/system";

const BoxWithShadow = (props: BoxProps) => {
  const { children } = props;

  return (
    <Box boxShadow={4} padding={3} borderRadius={2} {...props}>
      {children}
    </Box>
  );
};

export default BoxWithShadow;
