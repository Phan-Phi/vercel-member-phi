import Dropzone from "react-dropzone";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { INPUT_PROPS } from "constant";

import { get, set } from "lodash";

import {
  Container,
  Grid,
  Stack,
  Typography,
  Button,
  Box,
  MenuItem,
  FormControl,
  FormHelperText,
  Switch,
} from "@mui/material";

import {
  FormLabel,
  FormControlV2,
  LoadingButton,
  BoxWithShadow,
  AvatarForUpload,
  FormControlSelect,
  FormControlForRichText,
  FormControlForNumberV2,
  CheckboxSingleChoice,
} from "components";

import {
  advertisementSchema,
  AdvertisementSchemaProps,
  defaultAdvertisementFormState,
} from "yups";

import axios from "axios.config";
import { BUTTON, CONTENT_GLOBAL } from "constant";
import { ADVERTISEMENTS } from "apis";
import { useChoice, useNotification } from "hooks";
import { transformJSONToFormData, dropzoneRejected } from "libs";

export default function CreateAdvertisement() {
  const choice = useChoice();
  const router = useRouter();
  const isMounted = useMountedState();

  const { app_type, position } = choice;

  const { handleSubmit, setError, clearErrors, control, reset } = useForm({
    resolver: advertisementSchema(choice),
    defaultValues: defaultAdvertisementFormState(choice),
  });

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const onSubmit = useCallback(async (data: AdvertisementSchemaProps) => {
    try {
      setLoading(true);

      const transformedIconForMember = data.banner.map((el) => {
        return el.file;
      });

      set(data, "banner", transformedIconForMember);

      const formData = transformJSONToFormData(data);

      await axios.post(ADVERTISEMENTS, formData);
      enqueueSnackbarWithSuccess("Tạo thông tin quảng cáo thành công");
      router.back();
    } catch (err) {
      enqueueSnackbarWithError(err);
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, []);

  const onResetHandler = useCallback(() => {
    reset(defaultAdvertisementFormState(choice));
  }, []);

  const renderAppType = useMemo(() => {
    if (app_type == undefined) return null;

    const filteredAppType = app_type.filter((el, idx) => {
      return el[0] !== "Admin";
    });

    return (
      <Controller
        control={control}
        name="app_type"
        render={(props) => {
          return (
            <FormControlSelect
              controlState={props}
              renderItem={() => {
                return filteredAppType.map((el) => {
                  return (
                    <MenuItem key={el[0]} value={el[0]}>
                      {el[1]}
                    </MenuItem>
                  );
                });
              }}
              label="Đối tượng"
              placeholder="Đối tượng"
            />
          );
        }}
      />
    );
  }, [app_type]);

  const renderPosition = useMemo(() => {
    if (position == undefined) return null;

    return (
      <Controller
        control={control}
        name="position"
        render={(props) => {
          return (
            <FormControlSelect
              controlState={props}
              SelectProps={{
                multiple: true,
              }}
              renderItem={() => {
                return position.map((el) => {
                  return (
                    <MenuItem key={el[0]} value={el[0]}>
                      {el[1]}
                    </MenuItem>
                  );
                });
              }}
              label="Vị trí"
              placeholder="Vị trí"
            />
          );
        }}
      />
    );
  }, [position]);

  return (
    <Box component="form">
      <Container>
        <Stack spacing={3}>
          <BoxWithShadow>
            <Grid container spacing={2} marginBottom={3}>
              <Grid item xs={12}>
                <Typography variant="h2" color="primary2.main">
                  {CONTENT_GLOBAL.ABOUT}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                {renderAppType}
              </Grid>
              <Grid item xs={4}>
                {renderPosition}
              </Grid>
              <Grid item xs={4}>
                <Controller
                  control={control}
                  name="is_popup"
                  render={(props) => {
                    return (
                      <CheckboxSingleChoice
                        controlState={props}
                        label="Hiển Thị Dạng Pop-up"
                        checkboxLabel={
                          props.field.value ? "Hoạt động" : "Không hoạt động"
                        }
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="sort_order"
                  render={(props) => {
                    return (
                      <FormControlForNumberV2
                        placeholder="100"
                        label="Độ Ưu Tiên"
                        controlState={props}
                        NumberFormatProps={{
                          thousandSeparator: false,
                        }}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="banner"
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

                              <FormHelperText>
                                {/* Dung lượng file ảnh không được vượt quá 1MB */}

                                {CONTENT_GLOBAL.MB_IMAGE}
                              </FormHelperText>
                            </FormControl>
                          );
                        }}
                      </Dropzone>
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h2" color="primary2.main">
                  Thông Tin Bài Viết
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="title"
                  render={(props) => {
                    return (
                      <FormControlV2
                        controlState={props}
                        label="Tiêu đề"
                        placeholder="Tiêu đề"
                      />
                    );
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="short_description"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Mô tả ngắn"
                      placeholder="..."
                      InputProps={{
                        ...INPUT_PROPS,
                      }}
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
                  return <FormControlForRichText label="Nội dung" controlState={props} />;
                }}
              />
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
              onClick={onResetHandler}
            >
              {BUTTON.RESET}
            </Button>

            <LoadingButton
              type="submit"
              onClick={handleSubmit(onSubmit)}
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
