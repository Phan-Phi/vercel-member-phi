import React, { memo } from "react";
import {
  Path,
  Control,
  UseFormSetError,
  UseFormClearErrors,
  useController,
} from "react-hook-form";

import Dropzone, {
  DropzoneOptions,
  DropzoneRootProps,
  FileError,
  ErrorCode,
} from "react-dropzone";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import CloseIcon from "@mui/icons-material/Close";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";

import {
  InputProps,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
  Box,
  Stack,
  Typography,
} from "@mui/material";

import FormLabel from "./FormLabel";

type CommonProps<T extends { [key: string]: any }> = {
  label?: string;
  placeholder?: string;
  InputProps?: InputProps;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  renderDropzone?: (getRootProps: (props?: DropzoneRootProps) => {}) => JSX.Element;
  FormHelperTextProps?: FormHelperTextProps;
  DropzoneOptions?: Omit<DropzoneOptions, "onDrop">;
  DropzoneRootProps?: DropzoneRootProps;
  control: Control<T, any>;
  name: Path<T>;
  setError: UseFormSetError<T>;
  clearErrors: UseFormClearErrors<T>;
};

export type Props<T extends { [key: string]: any }> = CommonProps<T>;

type TValue = { file: File; formId?: string } | { file: string; formId?: string };

const FormControlForUploadCSV = <T extends { [key: string]: any }>(props: Props<T>) => {
  const {
    name,
    label,
    control,
    setError,
    clearErrors,
    FormLabelProps,
    renderDropzone,
    FormControlProps,
    FormHelperTextProps,
    DropzoneOptions,
    DropzoneRootProps,
  } = props;

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  return (
    <FormControl {...FormControlProps} error={!!error}>
      <FormLabel {...FormLabelProps}>{label}</FormLabel>

      <Dropzone
        {...{
          onDrop: (acceptedFiles, rejectedFiles) => {
            if (!isEmpty(rejectedFiles)) {
              let errors: FileError[] = get(rejectedFiles, "[0].errors");

              errors.forEach((error) => {
                if (error.code === ErrorCode.FileInvalidType) {
                  setError(name as Path<T>, {
                    type: "fileType",
                    message: error.message,
                  });
                } else if (error.code === ErrorCode.FileTooLarge) {
                  setError(name as Path<T>, {
                    type: "size",
                    message: error.message,
                  });
                } else {
                }
              });

              return;
            }

            clearErrors(name);

            const transformedAcceptedFiles = acceptedFiles.map((el) => {
              return {
                file: el,
              };
            });

            onChange(transformedAcceptedFiles);
          },
          onFileDialogCancel() {
            onChange([]);
          },
          accept: {
            "text/csv": [],
          },
          multiple: false,
          maxFiles: 1,
          ...DropzoneOptions,
        }}
      >
        {({ getRootProps }) => {
          if (Array.isArray(value) && !isEmpty(value)) {
            const _value = value as TValue[];

            return (
              <Stack flexDirection="row">
                {_value.map((el, idx) => {
                  if (el.file instanceof File) {
                    const blob = URL.createObjectURL(el.file);

                    return (
                      <FileCSV
                        value={get(el, "file.path")}
                        key={idx}
                        onChange={() => {
                          URL.revokeObjectURL(blob);
                          onChange([]);
                        }}
                      />
                    );
                  }

                  return (
                    <FileCSV
                      value={el.file}
                      key={idx}
                      onChange={() => {
                        onChange([]);
                      }}
                    />
                  );
                })}
              </Stack>
            );
          }

          return renderDropzone ? (
            renderDropzone(getRootProps)
          ) : (
            <Box
              {...getRootProps(DropzoneRootProps)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginY: "0.5rem",
                cursor: "pointer",
                color: "black",
                borderRadius: "10px",
                padding: "0 0.5rem",
                width: "100%",
                height: "40px",
                border: "1px solid #E6E6E6",
                transition: "all 0.4s",
              }}
            >
              <Typography>Chọn tệp...</Typography>
              <AttachFileOutlinedIcon />
            </Box>
          );
        }}
      </Dropzone>

      <FormHelperText {...FormHelperTextProps}>
        {error?.message || FormHelperTextProps?.children}
      </FormHelperText>
    </FormControl>
  );
};

const FileCSV = memo(function FileCSV({
  value,
  onChange,
}: React.PropsWithChildren<{
  value: string;
  onChange: (...event: any[]) => void;
}>) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginY: "0.5rem",
        cursor: "pointer",
        color: "black",
        borderRadius: "8px",
        padding: "0 0.5rem",
        width: "100%",
        height: "40px",
        border: "1px solid #E6E6E6",
        transition: "all 0.4s",
      }}
    >
      <Typography>{value}</Typography>
      <CloseIcon
        onClick={() => {
          onChange(null);
        }}
        sx={{
          cursor: "pointer",
          fontSize: "1.2rem",
          borderRadius: "50%",
          color: "white",
          backgroundColor: "red",
        }}
      />
    </Box>
  );
});

export default FormControlForUploadCSV;
