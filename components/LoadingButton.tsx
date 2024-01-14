import { styled } from "@mui/material";
import { LoadingButton as OriginalLoadingButton, LoadingButtonProps } from "@mui/lab";

const LoadingButton = (props: LoadingButtonProps) => {
  return <StyledLoadingButton variant="contained" {...props} />;
};

const StyledLoadingButton = styled(OriginalLoadingButton)(({ theme }) => {
  return {};
});

export default LoadingButton;
