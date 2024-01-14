import {
  Grid,
  Stack,
  Box,
  Button,
  MenuItem,
  Container,
  Typography,
  FormHelperText,
  FormControl as FormControlIamge,
} from "@mui/material";
import set from "lodash/set";
import { get } from "lodash";
import Dropzone from "react-dropzone";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  LoadingButton,
  BoxWithShadow,
  FormControlForUploadCSV,
  Select,
  FormControlForRichText,
  FormControlV2,
  FormLabel,
  AvatarForUpload,
} from "components";

import { useChoice, useNotification } from "hooks";

import {
  defaultNotificationFormState,
  NotificationSchemaProps,
  notificationSchema,
} from "yups";

import axios from "axios.config";
import { BUTTON, CONTENT_GLOBAL } from "constant";
import { NOTIFICATIONS_FILE_NOTIFICATIONS } from "apis";
import { dropzoneRejected, transformJSONToFormData } from "libs";

export default function CreateNotification() {
  const choice = useChoice();
  const router = useRouter();
  const isMounted = useMountedState();

  const { app_type } = choice;

  const { handleSubmit, setError, clearErrors, control, reset } = useForm({
    resolver: notificationSchema(choice),
    defaultValues: defaultNotificationFormState(choice),
  });

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const onSubmit = useCallback(async ({ data }: { data: NotificationSchemaProps }) => {
    try {
      setLoading(true);

      const transformedImage = data.image.map((el) => {
        return el.file;
      });
      set(data, "image", transformedImage);

      const transformedFile = data.file.map((el) => {
        return el.file;
      });
      set(data, "file", transformedFile);

      const formData = transformJSONToFormData(data);

      await axios.post(NOTIFICATIONS_FILE_NOTIFICATIONS, formData);

      enqueueSnackbarWithSuccess("Tạo thông tin thông báo thành công");
      router.back();
    } catch (err) {
      enqueueSnackbarWithError(err);
    } finally {
      isMounted() && setLoading(false);
    }
  }, []);

  const renderAppType = useMemo(() => {
    const filteredAppType = app_type.filter((el, idx) => {
      return el[0] !== "Admin";
    });

    return (
      <Select
        label="Đối Tượng"
        control={control}
        name="app_type"
        renderItem={() => {
          return filteredAppType.map((el) => {
            return (
              <MenuItem key={el[0]} value={el[0]}>
                {el[1]}
              </MenuItem>
            );
          });
        }}
      />
    );
  }, [app_type]);

  return (
    <Box component="form">
      <Container>
        <Stack spacing={3}>
          <BoxWithShadow>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h2" color="primary2.main">
                  {CONTENT_GLOBAL.INFOR_NOTIFICATION}
                  {/* Thông Tin Thông Báo */}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                {renderAppType}
              </Grid>

              <Grid item xs={12}>
                <FormControlForUploadCSV
                  control={control}
                  setError={setError}
                  clearErrors={clearErrors}
                  name="file"
                  label={CONTENT_GLOBAL.FILE_CSV}
                  FormHelperTextProps={{
                    sx: {
                      color: "primary.main",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                {/* <FormControlForUpload
                  control={control}
                  setError={setError}
                  clearErrors={clearErrors}
                  name="image"
                  label="Ảnh Banner"
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
                            <FormControlIamge error={!!error}>
                              <FormLabel>Ảnh Banner</FormLabel>
                              <Box {...getRootProps({})}>
                                <AvatarForUpload
                                  src={src}
                                  onRemove={() => {
                                    onChange(null);
                                  }}
                                />
                              </Box>

                              <FormHelperText>
                                {CONTENT_GLOBAL.MB_IMAGE}
                                {/* Dung lượng file ảnh không được vượt quá 1MB */}
                              </FormHelperText>
                            </FormControlIamge>
                          );
                        }}
                      </Dropzone>
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  render={(props) => {
                    return (
                      <FormControlV2
                        label="Tiêu Đề"
                        placeholder="Nhập tên danh mục..."
                        controlState={props}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="body"
                  render={(props) => {
                    return (
                      <FormControlForRichText
                        controlState={props}
                        label="Nội Dung Thông Báo"
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="sub_body"
                  render={(props) => {
                    return (
                      <FormControlV2
                        label="Nội Dung Hiển Thị"
                        controlState={props}
                        placeholder="Nội Dung Hiển Thị"
                      />
                    );
                  }}
                />
              </Grid>
            </Grid>
          </BoxWithShadow>

          <Stack flexDirection="row" columnGap={2} justifyContent={"center"}>
            <Button variant="outlined" disabled={loading} onClick={router.back}>
              {BUTTON.BACK}
            </Button>

            <Button
              color="error"
              variant="outlined"
              disabled={loading}
              onClick={() => {
                reset(defaultNotificationFormState(choice));
              }}
            >
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
