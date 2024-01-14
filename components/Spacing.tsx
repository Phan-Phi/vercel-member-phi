import { Box, styled, BoxProps } from "@mui/material";

interface ExtendableBox extends BoxProps {
  spacing?: number;
}

const Spacing = (props: ExtendableBox) => {
  const { spacing = 2 } = props;

  return <StyledSpacing paddingTop={spacing} {...props} />;
};

const StyledSpacing = styled(Box, {
  shouldForwardProp: (propName) => propName != "spacing",
})(({ theme }) => {
  return {};
});

export default Spacing;
