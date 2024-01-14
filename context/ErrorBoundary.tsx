import React from "react";
import { Box, Typography } from "@mui/material";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

type ErrorBoundaryWrapperProps = {
  children?: React.ReactNode;
};

const ErrorBoundaryWrapper = ({ children }: ErrorBoundaryWrapperProps) => {
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
};

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h1" color="error">
        Đã có lỗi xảy ra vui lòng thử lại sau!
      </Typography>
    </Box>
  );
}

export default ErrorBoundaryWrapper;
