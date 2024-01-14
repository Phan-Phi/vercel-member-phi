import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
} from "@mui/material";
import React, { useState } from "react";

import LoadingButton from "components/LoadingButton";

export interface ContentProps {
  message: string;
  buttonLeft?: string;
  buttonRight?: string;
  variant?: "warning" | "info";
}

type DeleteConfirmation = {
  content: ContentProps;
  open: DialogProps["open"];
  onClose: DialogProps["onClose"];
  onConfirm?: () => Promise<void>;
  DialogProps?: Omit<DialogProps, "open" | "onClose">;
};

const DeleteConfirmation = (props: DeleteConfirmation) => {
  const { open, onClose, onConfirm, content, DialogProps } = props;
  const [loading, setLoading] = useState(false);

  return (
    <Dialog
      open={open}
      onClose={(e, reason) => {
        if (loading) {
          return;
        }
        onClose?.(e, reason);
      }}
      {...DialogProps}
      PaperProps={{
        sx: {
          maxWidth: "500px",
        },
      }}
    >
      <DialogContent>
        <DialogContentText
          sx={{
            color: content.variant === "warning" ? "primary.main" : "primary2.main",
            textAlign: "center",
            lineHeight: "24px",
          }}
        >
          {content.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          padding: "24px",
          paddingTop: 0,
        }}
      >
        <Button
          onClick={(e) => {
            if (loading) {
              return;
            }

            onClose?.(e, "escapeKeyDown");
          }}
          color={content.variant === "warning" ? "primary" : "primary2"}
          variant="outlined"
          disabled={loading}
        >
          {content.buttonLeft}
        </Button>
        <LoadingButton
          onClick={async () => {
            setLoading(true);

            await onConfirm?.();

            setLoading(false);
          }}
          color={content.variant === "warning" ? "primary" : "primary2"}
          loading={loading}
          disabled={loading}
        >
          {content.buttonRight}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
