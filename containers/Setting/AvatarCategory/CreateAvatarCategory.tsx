import Dropzone from "react-dropzone";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { useMountedState } from "react-use";
import { useChoice, useNotification } from "hooks";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { get, set } from "lodash";

import {
  Box,
  Grid,
  Stack,
  Button,
  useTheme,
  Container,
  Typography,
  FormControl,
  FormHelperText,
} from "@mui/material";

import {
  LoadingButton,
  BoxWithShadow,
  FormControlForUpload,
  FormControlV2,
  AvatarForUpload,
  FormLabel,
} from "components";

import axios from "axios.config";
import { BUTTON, CONTENT_GLOBAL } from "constant";
import { dropzoneRejected, transformJSONToFormData } from "libs";
import { AVATARS, AVATARS_CATEGORIES } from "apis";

import {
  avatarSchema,
  AvatarSchemaProps,
  avatarCategorySchema,
  defaultAvatarFormState,
  AvatarCategorySchemaProps,
  defaultAvatarCategoryFormState,
} from "yups";

export default function CreateAvatar() {
  const theme = useTheme();
  const choice = useChoice();
  const router = useRouter();
  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { control, handleSubmit, reset, clearErrors, setError } = useForm({
    resolver: avatarCategorySchema(choice),
    defaultValues: defaultAvatarCategoryFormState(choice),
  });

  const {
    handleSubmit: avatarHandleSubmit,
    control: avatarControl,
    setError: avatarSetError,
    clearErrors: avatarClearErrors,
  } = useForm({
    resolver: avatarSchema(choice),
    defaultValues: defaultAvatarFormState(choice),
  });

  const { fields, remove, append } = useFieldArray({
    control: avatarControl,
    keyName: "formId",
    name: "avatars",
  });

  const onSubmit = useCallback(
    async ({
      data,
      avatarData,
    }: {
      data: AvatarCategorySchemaProps;
      avatarData: AvatarSchemaProps;
    }) => {
      try {
        setLoading(true);

        const transformedAvatars = get(avatarData, "avatars").map((el) => {
          return el.file;
        });

        const transformedImage = get(data, "image").map((el) => {
          return el.file;
        });

        set(data, "image", transformedImage);

        const formData = transformJSONToFormData(data);

        const { data: resData } = await axios.post(AVATARS_CATEGORIES, formData);

        const self = get(resData, "self");

        if (self) {
          await Promise.all(
            transformedAvatars.map((el) => {
              const formData = new FormData();

              formData.append("category", self);

              formData.append("image", el);

              return axios.post(AVATARS, formData);
            })
          );
        }

        enqueueSnackbarWithSuccess("Tạo thông tin avatar thành công");
        router.back();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    []
  );

  const onResetHandler = useCallback(() => {
    reset(defaultAvatarCategoryFormState(choice));
  }, []);

  return (
    <Box component="form">
      <Container>
        <Stack spacing={3}>
          <BoxWithShadow>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h2" sx={{ color: theme.palette.primary2.main }}>
                  Thông Tin Danh Mục Avatar
                </Typography>
              </Grid>

              <Grid item xs={12}>
                {/* <FormControlForUpload
                  name="image"
                  control={control}
                  setError={setError}
                  clearErrors={clearErrors}
                  label="Ảnh Đại Diện Danh Mục Avatar"
                  FormHelperTextProps={{
                    children: "Dung lượng file ảnh không được vượt quá 1MB",
                  }}
                /> */}

                <Controller
                  control={control}
                  name="image"
                  render={(props) => {
                    const { field, fieldState } = props;

                    const { onChange, value, name } = field;
                    const { error } = fieldState;

                    const src = get(value, "[0].file");

                    return (
                      <Dropzone
                        onDrop={(acceptedFiles, rejectedFiles) => {
                          const isError = dropzoneRejected(rejectedFiles, name, setError);

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
                            <FormControl error={!!error}>
                              <FormLabel>Ảnh Banner</FormLabel>
                              <Box {...getRootProps({})}>
                                <AvatarForUpload
                                  src={src}
                                  onRemove={() => {
                                    onChange(null);
                                  }}
                                />
                              </Box>

                              <FormHelperText>{CONTENT_GLOBAL.MB_IMAGE}</FormHelperText>
                            </FormControl>
                          );
                        }}
                      </Dropzone>
                    );
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="name"
                  render={(props) => {
                    return (
                      <FormControlV2
                        controlState={props}
                        label="Tên Danh Mục Avatar"
                        placeholder="Nhập tên danh mục Avatar..."
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h2" sx={{ color: theme.palette.primary2.main }}>
                  Danh Sách Hình
                </Typography>
                <Typography color="rgba(0,0,0,0.6)" marginTop={0.5} variant="subtitle1">
                  {/* Dung lượng file ảnh không được vượt quá 1MB */}
                  {CONTENT_GLOBAL.MB_IMAGE}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <BoxWithShadow>
                  <Controller
                    control={avatarControl}
                    name="avatars"
                    render={(props) => {
                      const { field, fieldState } = props;

                      const { name } = field;
                      const { error } = fieldState;

                      return (
                        <FormControl error={!!error}>
                          <Dropzone
                            multiple
                            maxSize={1024 * 1024}
                            accept={{
                              "image/*": [],
                            }}
                            onDrop={(acceptedFiles, rejectedFiles) => {
                              const isError = dropzoneRejected(
                                rejectedFiles,
                                name,
                                avatarSetError
                              );

                              if (isError) return;

                              avatarClearErrors("avatars");

                              acceptedFiles.forEach((el) => {
                                append({
                                  file: el,
                                });
                              });
                            }}
                          >
                            {({ getRootProps }) => {
                              return (
                                <Box
                                  display="grid"
                                  gridTemplateColumns="repeat(auto-fill, minmax(100px, 1fr))"
                                  gap={2}
                                >
                                  {fields.map((el, idx) => {
                                    return (
                                      <AvatarForUpload
                                        src={el.file}
                                        key={el.formId}
                                        onRemove={() => {
                                          remove(idx);
                                        }}
                                      />
                                    );
                                  })}
                                  <Box {...getRootProps()}>
                                    <AvatarForUpload />
                                  </Box>
                                </Box>
                              );
                            }}
                          </Dropzone>

                          {error && <FormHelperText>{error.message}</FormHelperText>}
                        </FormControl>
                      );
                    }}
                  />
                </BoxWithShadow>
              </Grid>
            </Grid>
          </BoxWithShadow>

          <Stack flexDirection="row" columnGap={2} justifyContent={"center"}>
            <Button variant="outlined" onClick={router.back}>
              {BUTTON.BACK}
            </Button>

            <Button color="error" variant="outlined" onClick={onResetHandler}>
              {BUTTON.RESET}
            </Button>

            <LoadingButton
              type="submit"
              onClick={handleSubmit((data) => {
                avatarHandleSubmit((avatarData) => {
                  onSubmit({
                    data,
                    avatarData,
                  });
                })();
              })}
              loading={loading}
            >
              {BUTTON.CREATE}
            </LoadingButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
