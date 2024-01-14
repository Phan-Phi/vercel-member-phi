import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import React, { useCallback } from "react";
import { useMountedState } from "react-use";

import set from "lodash/set";

import {
  Box,
  Container,
  Typography,
  useTheme,
  FormControl as FormControlImage,
  Stack,
  Grid,
  Button,
  FormHelperText,
  styled,
} from "@mui/material";

import { useChoice, useNotification } from "hooks";
import { MERCHANTS_STORES_CATEGORIES } from "apis";

import {
  LoadingButton,
  FormControl,
  BoxWithShadow,
  FormControlForUpload,
  FormControlV2,
  FormLabel,
  AvatarForUpload,
} from "components";

import {
  storeCategorySchema,
  defaultStoreCategoryFormState,
  StoreCategorySchemaProps,
} from "yups";

import axios from "axios.config";
import { BUTTON, CONTENT_GLOBAL } from "constant";
import { dropzoneRejected, transformJSONToFormData } from "libs";
import Dropzone from "react-dropzone";
import { get } from "lodash";

export default function CreateStoreCategory() {
  const theme = useTheme();
  const choice = useChoice();
  const router = useRouter();

  const isMounted = useMountedState();

  const { control, handleSubmit, setError, clearErrors } = useForm({
    resolver: storeCategorySchema(choice),
    defaultValues: defaultStoreCategoryFormState(choice),
  });

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const onSubmit = useCallback(
    async ({ data }: { data: StoreCategorySchemaProps }) => {
      try {
        setLoading(true);

        const transformedIconForMember = data.icon_for_member.map((el) => {
          return el.file;
        });

        set(data, "icon_for_member", transformedIconForMember);

        const transformedIconForAllData = data.icon_for_all.map((el) => {
          return el.file;
        });

        set(data, "icon_for_all", transformedIconForAllData);

        const formData = transformJSONToFormData(data);

        await axios.post(MERCHANTS_STORES_CATEGORIES, formData);

        enqueueSnackbarWithSuccess("Tạo danh mục quán thành công");

        router.back();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [enqueueSnackbarWithSuccess, enqueueSnackbarWithError, isMounted, router, setLoading]
  );

  return (
    <Box component="form">
      <Container>
        <Stack spacing={3}>
          <BoxWithShadow>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h2" sx={{ color: theme.palette.primary2.main }}>
                  {CONTENT_GLOBAL.INFOR_CATEGORY}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="name"
                  control={control}
                  render={(props) => {
                    return (
                      <FormControlV2
                        controlState={props}
                        placeholder="Nhập tên danh mục..."
                        label="Tên danh mục"
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                {/* <FormControlForUpload
                  control={control}
                  setError={setError}
                  clearErrors={clearErrors}
                  name="icon_for_all"
                  label="Logo Đại Diện Chưa Là Thành Viên"
                  FormHelperTextProps={{
                    children: "Dung lượng file ảnh không được vượt quá 1MB",
                  }}
                /> */}
              </Grid>

              <Grid item xs={12}>
                <Title variant="body2">Logo Đại Diện Chưa Là Thành Viên</Title>
                <Controller
                  control={control}
                  name="icon_for_all"
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
                              <FormHelperText>
                                Dung lượng file ảnh không được vượt quá 1MB
                              </FormHelperText>
                              {error && <FormHelperText>{error.message}</FormHelperText>}
                            </FormControlImage>
                          );
                        }}
                      </Dropzone>
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                {/* <FormControlForUpload
                  control={control}
                  setError={setError}
                  clearErrors={clearErrors}
                  name="icon_for_member"
                  label="Logo Đại Diện Đã Là Thành Viên"
                  FormHelperTextProps={{
                    children: "Dung lượng file ảnh không được vượt quá 1MB",
                  }}
                /> */}

                <Title variant="body2">Logo Đại Diện Đã Là Thành Viên</Title>
                <Controller
                  control={control}
                  name="icon_for_member"
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
                              <FormHelperText>
                                Dung lượng file ảnh không được vượt quá 1MB
                              </FormHelperText>
                              {error && <FormHelperText>{error.message}</FormHelperText>}
                            </FormControlImage>
                          );
                        }}
                      </Dropzone>
                    );
                  }}
                />
              </Grid>
            </Grid>
          </BoxWithShadow>

          <Stack flexDirection="row" columnGap={2} justifyContent="center">
            <Button color="error" variant="outlined" disabled={loading}>
              {BUTTON.RESET}
            </Button>

            <LoadingButton
              type="submit"
              onClick={handleSubmit((data) => {
                onSubmit({
                  data,
                });
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

const Title = styled(Typography)(({ theme }) => {
  return { fontWeight: 700, lineHeight: "30px", marginBottom: "0.6rem" };
});
