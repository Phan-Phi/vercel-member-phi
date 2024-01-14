import useSWR from "swr";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import DOMPurify from "isomorphic-dompurify";
import { useForm, Controller } from "react-hook-form";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import { get, set, isEmpty } from "lodash";

import { useChoice, useConfirmation, useNotification, usePermission } from "hooks";

import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Button,
  Avatar,
  MenuItem,
  Input,
  useTheme,
  FormControl as MuiFormControl,
  FormHelperText,
} from "@mui/material";

import {
  Loading,
  Image,
  BoxWithShadow,
  FormControlForUpload,
  LoadingButton,
  FormControlForUploadCSV,
  Select,
  FormLabel,
  FormControlForRichText,
  FormControlV2,
  AvatarForUpload,
} from "components";

import { NOTIFICATIONS_PUSH_TIME, NOTIFICATIONS_FILE_NOTIFICATIONS } from "apis";
import {
  NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM,
  NOTIFICATIONS_PUSH_TIMES_ITEM,
  responseSchema,
} from "interfaces";

import {
  defaultNotificationFormState,
  NotificationSchemaProps,
  notificationSchema,
} from "yups";

import {
  dropzoneRejected,
  formatDate,
  transformJSONToFormData,
  transformUrl,
} from "libs";
import axios from "axios.config";
import { BUTTON, CONTENT_GLOBAL } from "constant";
import { PATHNAME } from "routes";
import Dropzone from "react-dropzone";

const DetailNotification = () => {
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState<NotificationSchemaProps>();

  const [hasSentNotification, setHasSentNotification] = useState<boolean>();

  const { data: resNotificationData, mutate: mutateNotification } =
    useSWR<NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM>(
      transformUrl(`${NOTIFICATIONS_FILE_NOTIFICATIONS}${router.query.id}/`, {
        use_cache: false,
      })
    );

  const { data: resPushTimeData } = useSWR<responseSchema<NOTIFICATIONS_PUSH_TIMES_ITEM>>(
    () => {
      if (resNotificationData == undefined) return;

      return transformUrl(resNotificationData.push_times, {
        limit: 1000,
        with_count: true,
        use_cache: false,
      });
    }
  );

  const setDefaultValuesHandler = useCallback(
    (data: NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM) => {
      const body = {} as NotificationSchemaProps;

      const keyList = [...Object.keys(defaultNotificationFormState()), "self"];

      keyList.forEach((key) => {
        const temp = get(data, key);

        if (key === "image" || key === "file") {
          if (temp) {
            set(body, key, [
              {
                file: temp,
              },
            ]);
            return;
          }

          set(body, key, []);
          return;
        }

        set(body, key, temp);
      });

      setDefaultValues(body);
    },

    []
  );

  useEffect(() => {
    if (resNotificationData == undefined) return;

    setDefaultValuesHandler(resNotificationData);
  }, [resNotificationData]);

  useEffect(() => {
    if (resPushTimeData == undefined) return;

    setHasSentNotification(!!resPushTimeData.count);
  }, [resPushTimeData]);

  const onSuccessHandler = useCallback(async () => {
    setDefaultValues(undefined);

    const data = await mutateNotification();

    data && setDefaultValuesHandler(data);
  }, []);

  if (
    defaultValues == undefined ||
    hasSentNotification == undefined ||
    resPushTimeData == undefined
  ) {
    return <Loading />;
  }

  return (
    <RootComponent
      {...{
        defaultValues,
        hasSentNotification,
        onSuccessHandler,
        pushTimeData: resPushTimeData.results,
      }}
    />
  );
};

interface RootComponentProps {
  defaultValues: NotificationSchemaProps;
  hasSentNotification: boolean;
  pushTimeData: NOTIFICATIONS_PUSH_TIMES_ITEM[];
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = (props: RootComponentProps) => {
  const { defaultValues, hasSentNotification, pushTimeData, onSuccessHandler } = props;

  const theme = useTheme();
  const choice = useChoice();
  const router = useRouter();
  const isMounted = useMountedState();
  const { onConfirm, onClose } = useConfirmation();
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const { hasPermission } = usePermission("write_notification");

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    reset,
    formState: { dirtyFields },
  } = useForm({
    resolver: notificationSchema(choice),
    defaultValues,
  });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: NotificationSchemaProps;
      dirtyFields: object;
    }) => {
      try {
        setLoading(true);

        const self = get(data, "self");

        const transformedImage = data.image.map((el) => {
          return el.file;
        });

        set(data, "image", transformedImage);

        const transformedFile = data.file.map((el) => {
          return el.file;
        });

        set(data, "file", transformedFile);

        const formData = transformJSONToFormData(data, dirtyFields);

        if (self) {
          await axios.patch(self, formData);

          if (isEmpty(transformedImage)) {
            await axios.patch(self, {
              image: null,
            });
          }
        }

        enqueueSnackbarWithSuccess("Cập nhật thông tin thông báo thành công");

        onSuccessHandler();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        isMounted() && setLoading(false);
      }
    },
    []
  );

  const onSendNotificationHandler = useCallback((data: NotificationSchemaProps) => {
    const handler = async () => {
      try {
        setLoading(true);

        const self = get(data, "self");

        const body = { notification: self };

        await axios.post(NOTIFICATIONS_PUSH_TIME, body);

        enqueueSnackbarWithSuccess("Gửi thông báo thành công");

        router.push(`/${PATHNAME.THONG_BAO}`);
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        onClose();
      }
    };
    const message = `Hãy xác nhận bạn muốn gửi thông báo, đây là hành động không thể hoàn tác`;

    onConfirm(handler, {
      message,
      variant: "info",
    });
  }, []);

  const onGoBackHandler = useCallback((isUpdateMode: boolean) => {
    return () => {
      if (isUpdateMode) {
        reset(defaultValues);
        setIsUpdateMode(false);
      } else {
        router.push(`/${PATHNAME.THONG_BAO}`);
      }
    };
  }, []);

  const renderAppType = useMemo(() => {
    const { app_type } = choice;

    const filteredAppType = app_type.filter((el) => {
      return el[0] !== "Admin";
    });

    return (
      <Select
        SelectProps={{
          readOnly: isUpdateMode ? false : true,
        }}
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
  }, [isUpdateMode, choice]);

  const renderBody = useMemo(() => {
    if (isUpdateMode) {
      return (
        <Controller
          name="body"
          control={control}
          render={(props) => {
            return (
              <FormControlForRichText controlState={props} label="Nội Dung Thông Báo" />
            );
          }}
        />
      );
    } else {
      return (
        <MuiFormControl>
          <FormLabel>Nội Dung Thông Báo</FormLabel>
          <Box
            sx={{
              backgroundColor: theme.palette.grey[400],
              padding: 1,
              borderRadius: 1,
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(defaultValues.body),
            }}
          />
        </MuiFormControl>
      );
    }
  }, [isUpdateMode, defaultValues]);

  const renderPushTimeHistory = useMemo(() => {
    return (
      <BoxWithShadow>
        <Stack spacing={3}>
          <Typography variant="h2" color="primary2.main">
            Lịch sử
          </Typography>

          <Box display="grid" gridTemplateColumns={"50% 50%"} rowGap={2} maxWidth={600}>
            <Typography fontWeight={700}>Người gửi</Typography>
            <Typography fontWeight={700}>Ngày gửi</Typography>
            {pushTimeData.map((el) => {
              const { date_updated, self, owner_email } = el;

              return (
                <Fragment key={self}>
                  <Typography>{owner_email}</Typography>
                  <Typography>{formatDate(date_updated)}</Typography>
                </Fragment>
              );
            })}
          </Box>
        </Stack>
      </BoxWithShadow>
    );
  }, [pushTimeData]);

  return (
    <Container>
      <Stack spacing={3}>
        <BoxWithShadow>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                {/* Thông Tin Thông Báo */}
                {CONTENT_GLOBAL.INFOR_NOTIFICATION}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              {renderAppType}
            </Grid>

            <Grid item xs={12}>
              <MuiFormControl>
                <FormLabel>
                  {/* Tệp Đối Tượng (.csv) */}
                  {CONTENT_GLOBAL.FILE_CSV}
                </FormLabel>

                {isUpdateMode ? (
                  <FormControlForUploadCSV
                    control={control}
                    setError={setError}
                    clearErrors={clearErrors}
                    name="file"
                    FormHelperTextProps={{
                      sx: {
                        color: "primary.main",
                      },
                    }}
                  />
                ) : (
                  <Input
                    value={get(defaultValues, "file[0].file")}
                    readOnly={true}
                    sx={{
                      backgroundColor: "#bdbdbd",
                    }}
                  />
                )}
              </MuiFormControl>
            </Grid>

            <Grid item xs={12}>
              <MuiFormControl>
                <FormLabel>Ảnh Banner</FormLabel>

                {isUpdateMode ? (
                  // <FormControlForUpload
                  //   control={control}
                  //   setError={setError}
                  //   clearErrors={clearErrors}
                  //   name="image"
                  //   FormHelperTextProps={{
                  //     children: CONTENT_GLOBAL.MB_IMAGE,
                  //   }}

                  // />

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
                              <MuiFormControl error={!!error}>
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
                              </MuiFormControl>
                            );
                          }}
                        </Dropzone>
                      );
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "inline-block !important",
                      borderRadius: "5px",
                    }}
                  >
                    {get(defaultValues, "image[0].file") == null ? (
                      <Avatar variant="rounded" sx={{ width: 100, height: 100 }} />
                    ) : (
                      <Image
                        src={get(defaultValues, "image[0].file")}
                        width={100}
                        height={100}
                        alt=""
                      />
                    )}
                  </Box>
                )}
              </MuiFormControl>
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
                      InputProps={{
                        readOnly: isUpdateMode ? false : true,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              {renderBody}
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
                      InputProps={{
                        readOnly: isUpdateMode ? false : true,
                      }}
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
        </BoxWithShadow>

        {renderPushTimeHistory}

        <Stack flexDirection="row" columnGap={2} justifyContent={"center"}>
          <Button
            variant="outlined"
            disabled={loading}
            onClick={onGoBackHandler(isUpdateMode)}
          >
            {BUTTON.BACK}
          </Button>

          {!hasSentNotification && (
            <LoadingButton
              variant={isUpdateMode ? "contained" : "outlined"}
              onClick={() => {
                if (isUpdateMode) {
                  handleSubmit((data) => {
                    onSubmit({
                      data,
                      dirtyFields,
                    });
                  })();
                } else {
                  setIsUpdateMode(true);
                }
              }}
              loading={loading}
            >
              {isUpdateMode ? BUTTON.UPDATE : BUTTON.EDIT}
            </LoadingButton>
          )}

          {hasPermission && !isUpdateMode && (
            <LoadingButton
              disabled={isUpdateMode ? true : false}
              onClick={() => {
                onSendNotificationHandler(defaultValues);
              }}
              loading={loading}
            >
              {BUTTON.SEND}
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default DetailNotification;
