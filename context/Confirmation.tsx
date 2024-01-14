import React, { createContext, useCallback, useMemo, useRef, useState } from "react";

import { useUpdateEffect } from "react-use";

import {
  ConfirmationDialog as ConfirmationDialogComponent,
  type ContentProps,
} from "components";
import { useToggle } from "hooks/useToggle";

interface ConfirmationProps {
  children: React.ReactNode;
}

type ConfirmationContextProps = {
  onOpen: () => void;
  onClose: () => void;
  onConfirm: (cb: (...args: unknown[]) => Promise<void>, content: ContentProps) => void;
};

export const ConfirmationContext = createContext<ConfirmationContextProps>({
  onOpen: () => {},
  onClose: () => {},
  onConfirm: () => {},
});

const initContent = {
  message: "",
  buttonLeft: "Hủy bỏ",
  buttonRight: "Xác nhận",
  variant: "warning",
} as const;

const Confirmation = ({ children }: ConfirmationProps) => {
  const callback = useRef<() => Promise<void>>();

  const { open, onOpen, onClose } = useToggle();

  const [content, setContent] = useState<ContentProps>(initContent);

  const onConfirmHandler = useCallback(
    (
      cb: () => Promise<void>,
      {
        message,
        buttonLeft = "Hủy bỏ",
        buttonRight = "Xác nhận",
        variant = "warning",
      }: ContentProps
    ) => {
      callback.current = cb;
      onOpen();

      setContent({ message, buttonLeft, buttonRight, variant });
    },
    []
  );

  useUpdateEffect(() => {
    let timer: NodeJS.Timeout;

    if (!open) {
      callback.current = undefined;

      timer = setTimeout(() => {
        setContent(initContent);
      }, 300);
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [open]);

  const contextValue = useMemo(() => {
    return {
      onClose,
      onOpen,
      onConfirm: onConfirmHandler,
    };
  }, []);

  return (
    <ConfirmationContext.Provider value={contextValue}>
      {children}

      <ConfirmationDialogComponent
        {...{
          open,
          content,
          onClose,
          onConfirm: callback.current,
        }}
      />
    </ConfirmationContext.Provider>
  );
};

export default Confirmation;
