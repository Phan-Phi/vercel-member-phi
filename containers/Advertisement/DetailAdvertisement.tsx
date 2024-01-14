import useSWR from "swr";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { useMountedState } from "react-use";
import DOMPurify from "isomorphic-dompurify";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { INPUT_PROPS } from "constant";

import { get, set, isEmpty } from "lodash";

import {
  Box,
  Grid,
  Stack,
  Button,
  styled,
  Avatar,
  MenuItem,
  Typography,
  FormControl as MuiFormControl,
  useTheme,
  FormHelperText,
} from "@mui/material";

import {
  Image,
  Select,
  Loading,
  Container,
  FormLabel,
  LoadingButton,
  BoxWithShadow,
  FormControlForUpload,
  FormControlForRichText,
  CheckboxSingleChoice,
  FormControlForNumberV2,
  FormControlV2,
  AvatarForUpload,
} from "components";

import axios from "axios.config";
import { BUTTON, CONTENT_GLOBAL } from "constant";
import { PATHNAME } from "routes";
import { ADVERTISEMENTS } from "apis";
import { dropzoneRejected, transformJSONToFormData, transformUrl } from "libs";
import { ADVERTISEMENTS_ITEM } from "interfaces";
import { useChoice, useNotification, usePermission } from "hooks";

import {
  advertisementSchema,
  AdvertisementSchemaProps,
  defaultAdvertisementFormState,
} from "yups";
import Dropzone from "react-dropzone";

const DetailAdvertisement = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<AdvertisementSchemaProps>();

  const { data: advertisementData, mutate } = useSWR<ADVERTISEMENTS_ITEM>(
    transformUrl(`${ADVERTISEMENTS}${router.query.id}/`, {
      use_cache: false,
    })
  );

  const setDefaultValuesHandler = useCallback((data: ADVERTISEMENTS_ITEM) => {
    const body = {} as AdvertisementSchemaProps;

    const keyList = [...Object.keys(defaultAdvertisementFormState()), "self"];

    keyList.forEach((key) => {
      const temp = get(data, key);

      if (key === "banner") {
        set(body, key, [
          {
            file: temp,
          },
        ]);

        return;
      } else if (key === "app_type") {
        set(body, key, temp[0]);
        return;
      }

      set(body, key, temp);
    });

    setDefaultValues(body);
  }, []);

  useEffect(() => {
    if (advertisementData == undefined) return;

    setDefaultValuesHandler(advertisementData);
  }, [advertisementData]);

  const onSuccessHandler = useCallback(async () => {
    setDefaultValues(undefined);

    const data = await mutate();

    data && setDefaultValuesHandler(data);
  }, []);

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ defaultValues, onSuccessHandler }} />;
};

interface RootComponentProps {
  defaultValues: AdvertisementSchemaProps;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = (props: RootComponentProps) => {
  const { defaultValues, onSuccessHandler } = props;

  const theme = useTheme();
  const choice = useChoice();
  const router = useRouter();
  const isMounted = useMountedState();

  const { hasPermission } = usePermission("write_advertisement");

  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { app_type, position } = choice;

  const {
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { dirtyFields },
  } = useForm({
    resolver: advertisementSchema(choice),
    defaultValues,
  });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: AdvertisementSchemaProps;
      dirtyFields: object;
    }) => {
      try {
        setLoading(true);

        const self = get(data, "self");

        const transformedIconForMember = data.banner.map((el) => {
          return el.file;
        });

        set(data, "banner", transformedIconForMember);

        if (!isEmpty(dirtyFields)) {
          const formData = transformJSONToFormData(data, dirtyFields);

          if (self) {
            await axios.patch(self, formData);
          }

          enqueueSnackbarWithSuccess("Cập nhật thông tin quảng cáo thành công");
          onSuccessHandler();
        }
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

  const onGoBackHandler = useCallback((isUpdateMode: boolean) => {
    return () => {
      if (isUpdateMode) {
        reset(defaultValues);
        setIsUpdateMode(false);
      } else {
        router.push(`/${PATHNAME.QUANG_CAO}/${PATHNAME.TIN_TUC}`);
      }
    };
  }, []);

  const renderAppType = useMemo(() => {
    if (app_type == undefined) {
      return null;
    }

    const filteredAppType = app_type.filter((el, idx) => {
      return el[0] !== "Admin";
    });

    return (
      <Select
        SelectProps={{
          readOnly: true,
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
  }, [app_type]);

  const renderPosition = useMemo(() => {
    if (position == undefined) {
      return null;
    }

    return (
      <Select
        SelectProps={{
          readOnly: isUpdateMode ? false : true,
          multiple: true,
        }}
        label="Vị Trí"
        control={control}
        name="position"
        renderItem={() => {
          return position.map((el) => {
            return (
              <MenuItem key={el[0]} value={el[0]}>
                {el[1]}
              </MenuItem>
            );
          });
        }}
      />
    );
  }, [isUpdateMode, position]);

  const renderBody = useMemo(() => {
    if (isUpdateMode) {
      return (
        <Controller
          control={control}
          name="body"
          render={(props) => {
            return <FormControlForRichText label="Nội dung" controlState={props} />;
          }}
        />
      );
    } else {
      return (
        <MuiFormControl>
          <FormLabel>Nội dung</FormLabel>
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

  const renderShortDescription = useMemo(() => {
    if (isUpdateMode) {
      return (
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
      );
    } else {
      return (
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
                  readOnly: isUpdateMode ? false : true,
                  ...INPUT_PROPS,
                }}
              />
            );
          }}
        />
      );
    }
  }, [isUpdateMode, defaultValues]);

  return (
    <Container>
      <Stack spacing={3}>
        <BoxWithShadow>
          <Grid container spacing={2} marginBottom={3}>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Thông Tin Hiển Thị
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
                name="is_popup"
                control={control}
                render={(props) => {
                  return (
                    <CheckboxSingleChoice
                      CheckboxProps={{ disabled: isUpdateMode ? false : true }}
                      controlState={props}
                      label="Hiển Thị Dạng Pop-up"
                      checkboxLabel={props.field.value ? "Hoạt động" : "Không hoạt động"}
                    />
                  );
                }}
              />
              {/* <Switch
                control={control}
                name="is_popup"
                label="Hiển Thị Dạng Pop-up"
                SwitchProps={{
                  sx: {
                    pointerEvents: isUpdateMode ? "all" : "none",
                  },
                }}
              /> */}
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="sort_order"
                control={control}
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      placeholder="100"
                      label="Độ Ưu Tiên"
                      controlState={props}
                      NumberFormatProps={{
                        thousandSeparator: false,
                      }}
                      readOnly={isUpdateMode ? false : true}
                      // InputProps={{
                      //   readOnly: isUpdateMode ? false : true,
                      // }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Title>Ảnh Banner</Title>
              {isUpdateMode ? (
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
                // <FormControlForUpload
                //   control={control}
                //   setError={setError}
                //   clearErrors={clearErrors}
                //   name="banner"
                //   FormHelperTextProps={{
                //     children: "Dung lượng file ảnh không được vượt quá 1MBsds",
                //   }}
                // />
                <WrapperAvatar>
                  {get(defaultValues, "banner") ? (
                    <Image
                      src={get(defaultValues, "banner[0].file")}
                      width={100}
                      height={100}
                      alt=""
                    />
                  ) : (
                    <Avatar variant="rounded" sx={{ width: 100, height: 100 }} />
                  )}
                </WrapperAvatar>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Thông Tin Bài Viết
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tiêu Đề"
                      placeholder="Nhập Tiêu Đề..."
                      InputProps={{
                        readOnly: isUpdateMode ? false : true,
                      }}
                    />
                  );
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              {renderShortDescription}
            </Grid>
            <Grid item xs={12}>
              {renderBody}
            </Grid>
          </Grid>
        </BoxWithShadow>

        <Stack flexDirection="row" columnGap={2} justifyContent="center">
          <Button
            variant="outlined"
            disabled={loading}
            onClick={onGoBackHandler(isUpdateMode)}
          >
            {BUTTON.BACK}
          </Button>

          {hasPermission && (
            <LoadingButton
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
              {isUpdateMode ? BUTTON.UPDATE : BUTTON.UPDATE}
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default DetailAdvertisement;

const Title = styled(Typography)(() => {
  return { fontWeight: 700, lineHeight: "30px", marginBottom: "0.6rem" };
});

const WrapperAvatar = styled(Box)(() => {
  return {
    backgroundColor: "#E6E6E6",
    display: "inline-block !important",
    borderRadius: "5px",

    "& img": {
      borderRadius: "5px",
    },
  };
});
