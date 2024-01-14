import React, { Fragment, useCallback, useMemo } from "react";

import {
  Control,
  useFieldArray,
  UseFormSetError,
  UseFormClearErrors,
  Controller,
} from "react-hook-form";

import {
  Button,
  Grid,
  Typography,
  styled,
  Box,
  Stack,
  FormControl as FormControlImage,
} from "@mui/material";

import {
  AvatarForUpload,
  FormControl,
  FormControlForUpload,
  FormControlV2,
} from "components";

import { SocialIconSchemaProps } from "yups";
import { BUTTON } from "constant";
import { get } from "lodash";
import Dropzone from "react-dropzone";
import { dropzoneRejected } from "libs";

interface RankFormProps<T extends SocialIconSchemaProps = SocialIconSchemaProps> {
  control: Control<T>;
  setError: UseFormSetError<T>;
  clearErrors: UseFormClearErrors<T>;
}

const headerList = ["Icon", "Đường dẫn liên kết"];

const defaultSocialItem = {
  link: "",
  image: [],
};

const SocialIconForm = (props: RankFormProps) => {
  const { control, setError, clearErrors } = props;

  const { fields, remove, append } = useFieldArray({
    control,
    keyName: "formId",
    name: "socialItemList",
  });

  const addNewItem = useCallback(() => {
    append(defaultSocialItem);
  }, []);

  const removeItem = useCallback((id: number) => {
    return () => {
      remove(id);
    };
  }, []);

  const renderTableHeader = useMemo(() => {
    return (
      <Fragment>
        {headerList.map((item, idx) => {
          return (
            <Grid key={idx} item xs={idx === 0 ? 2 : 8}>
              <Typography variant="body2" fontWeight={700}>
                {item}
              </Typography>
            </Grid>
          );
        })}
      </Fragment>
    );
  }, []);

  return (
    <Fragment>
      <Grid container>
        {renderTableHeader}
        <Grid item xs={2}></Grid>

        {fields.map((el, idx) => {
          return (
            <Fragment key={el.formId}>
              <Grid item xs={2}>
                <Box
                  sx={{
                    "& .MuiBox-root": {
                      height: "48px !important",
                      width: "48px !important",
                      marginTop: 0,
                    },
                    "& img": {
                      objectFit: "contain !important",
                      height: "48px !important",
                    },
                  }}
                >
                  {/* <FormControlForUpload
                    control={control}
                    setError={setError}
                    clearErrors={clearErrors}
                    name={`socialItemList.${idx}.image`}
                    FormLabelProps={{
                      sx: {
                        display: "none",
                      },
                    }}
                    DropzoneOptions={{
                      maxSize: 1024 * 1024,
                    }}
                  /> */}

                  <Controller
                    control={control}
                    name={`socialItemList.${idx}.image`}
                    render={(props) => {
                      const { field, fieldState } = props;
                      const { onChange, value, name } = field;
                      const { error } = fieldState;

                      const src = get(value, "[0].file");

                      return (
                        <Dropzone
                          onDrop={(acceptedFiles, rejectedFiles) => {
                            const isError = dropzoneRejected(
                              rejectedFiles,
                              name,
                              setError
                            );
                            if (isError) return;
                            clearErrors(name);
                            const transformedAcceptedFiles = acceptedFiles.map((el) => {
                              return {
                                file: el,
                              };
                            });
                            onChange(transformedAcceptedFiles);
                          }}
                          accept={{
                            "image/*": [],
                          }}
                          maxSize={1024 * 1024}
                          multiple={false}
                          maxFiles={1}
                          disabled={!!src}
                        >
                          {({ getRootProps }) => {
                            return (
                              <FormControlImage error={!!error}>
                                <Box {...getRootProps({})}>
                                  <AvatarForUpload
                                    src={src}
                                    // readOnly={!isUpdateMode}
                                    onRemove={() => {
                                      onChange(null);
                                    }}
                                  />
                                </Box>
                              </FormControlImage>
                            );
                          }}
                        </Dropzone>
                      );
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={8}>
                {/* <FormControl
                  control={control}
                  name={`socialItemList.${idx}.link`}
                  FormLabelProps={{
                    sx: {
                      display: "none",
                    },
                  }}
                /> */}

                <Controller
                  name={`socialItemList.${idx}.link`}
                  control={control}
                  render={(props) => {
                    return (
                      <FormControlV2
                        controlState={props}
                        FormLabelProps={{
                          sx: {
                            display: "none",
                          },
                        }}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={2}>
                <Button color="error" fullWidth={true} onClick={removeItem(idx)}>
                  {BUTTON.DELETE}
                </Button>
              </Grid>
            </Fragment>
          );
        })}

        <Grid item xs={12}>
          <Stack>
            <Button
              sx={{
                alignSelf: "flex-end",
              }}
              onClick={addNewItem}
            >
              {BUTTON.ADD}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default SocialIconForm;
