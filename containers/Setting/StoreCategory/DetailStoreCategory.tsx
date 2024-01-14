import useSWR from "swr";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { get, set, isEmpty } from "lodash";
import { useMountedState } from "react-use";
import { useCallback, useEffect, useState } from "react";
import { useChoice, useNotification, usePermission } from "hooks";

import {
  Box,
  Container,
  Typography,
  useTheme,
  styled,
  Stack,
  Grid,
  FormControl as FormControlImage,
  Button,
  Avatar,
  FormHelperText,
} from "@mui/material";

import {
  Image,
  Loading,
  FormControl,
  LoadingButton,
  BoxWithShadow,
  FormControlForUpload,
  FormControlV2,
  AvatarForUpload,
} from "components";

import { MERCHANTS_STORES_CATEGORIES_ITEM } from "interfaces";
import { PATHNAME } from "routes";
import {
  storeCategorySchema,
  StoreCategorySchemaProps,
  defaultStoreCategoryFormState,
} from "yups";
import axios from "axios.config";

import { BUTTON, CONTENT_GLOBAL } from "constant";
import { MERCHANTS_STORES_CATEGORIES } from "apis";
import { dropzoneRejected, transformJSONToFormData, transformUrl } from "libs";
import Dropzone from "react-dropzone";

const DetailStoreCategory = () => {
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState<StoreCategorySchemaProps>();

  const { data: merchantStoreCategoryData, mutate } =
    useSWR<MERCHANTS_STORES_CATEGORIES_ITEM>(() => {
      const id = router.query.id;

      if (id == undefined) return;

      return transformUrl(`${MERCHANTS_STORES_CATEGORIES}${id}/`, {
        use_cache: false,
      });
    });

  const setDefaultValuesHandler = useCallback(
    (data: MERCHANTS_STORES_CATEGORIES_ITEM) => {
      const body = {} as StoreCategorySchemaProps;

      const keyList = [...Object.keys(defaultStoreCategoryFormState()), "self"];

      keyList.forEach((key) => {
        const temp = get(data, key);

        if (key === "icon_for_all" || key === "icon_for_member") {
          set(body, key, [
            {
              file: temp,
            },
          ]);

          return;
        }

        set(body, key, temp);
      });

      setDefaultValues(body);
    },

    []
  );

  useEffect(() => {
    if (merchantStoreCategoryData == undefined) return;

    setDefaultValuesHandler(merchantStoreCategoryData);
  }, [merchantStoreCategoryData]);

  const onSuccessHandler = useCallback(async () => {
    setDefaultValues(undefined);

    const data = await mutate();

    data && setDefaultValuesHandler(data);
  }, []);

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ defaultValues, onSuccessHandler }} />;
};

interface RootComponentProps {
  defaultValues: StoreCategorySchemaProps;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = (props: RootComponentProps) => {
  const { defaultValues, onSuccessHandler } = props;

  const theme = useTheme();
  const choice = useChoice();
  const router = useRouter();

  const { hasPermission } = usePermission("write_store_category");

  const isMounted = useMountedState();
  const [isUpdateMode, setIsUpdateMode] = useState(false);

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
    resolver: storeCategorySchema(choice),
    defaultValues: defaultValues,
  });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: StoreCategorySchemaProps;
      dirtyFields: object;
    }) => {
      try {
        const self = get(data, "self");

        setLoading(true);

        if (!isEmpty(dirtyFields)) {
          const transformedIconForMember = data.icon_for_member.map((el) => {
            return el.file;
          });

          set(data, "icon_for_member", transformedIconForMember);

          const transformedIconForAllData = data.icon_for_all.map((el) => {
            return el.file;
          });

          set(data, "icon_for_all", transformedIconForAllData);

          const formData = transformJSONToFormData(data, dirtyFields);

          if (self) {
            await axios.patch(self, formData);
          }
          enqueueSnackbarWithSuccess("Cập nhật thông tin danh mục thành công");
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

  const onSetIsUpdateModeHandler = useCallback((isUpdateMode: boolean) => {
    return () => {
      setIsUpdateMode(isUpdateMode);
    };
  }, []);

  const onGoBackHandler = useCallback((isUpdateMode: boolean) => {
    return () => {
      if (isUpdateMode) {
        reset(defaultValues, {
          keepDirty: false,
        });

        setIsUpdateMode(false);
      } else {
        router.push(`/${PATHNAME.CAI_DAT}/${PATHNAME.DANH_MUC_QUAN}`);
      }
    };
  }, []);

  return (
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
                control={control}
                name="name"
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tên Danh Mục"
                      placeholder="Nhập tên danh mục Avatar..."
                      InputProps={{
                        readOnly: isUpdateMode ? false : true,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={6}></Grid>

            <Grid item xs={12}>
              <Title variant="body2">Logo Đại Diện Chưa Là Thành Viên</Title>

              {isUpdateMode ? (
                // <FormControlForUpload
                //   control={control}
                //   setError={setError}
                //   clearErrors={clearErrors}
                //   name="icon_for_all"
                //   FormHelperTextProps={{
                //     children: "Dung lượng file ảnh không được vượt quá 1MB",
                //   }}
                // />
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
              ) : (
                <Box
                  sx={{
                    backgroundColor: "#E6E6E6",
                    display: "inline-block !important",
                    borderRadius: "4px",
                  }}
                >
                  {get(defaultValues, "icon_for_all[0].file") ? (
                    <Image
                      src={get(defaultValues, "icon_for_all[0].file")}
                      width={100}
                      height={100}
                      alt=""
                    />
                  ) : (
                    <Avatar variant="rounded" sx={{ width: 100, height: 100 }} />
                  )}
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Title variant="body2">Logo Đại Diện Đã Là Thành Viên</Title>

              {isUpdateMode ? (
                // <FormControlForUpload
                //   control={control}
                //   setError={setError}
                //   clearErrors={clearErrors}
                //   name="icon_for_member"
                //   FormHelperTextProps={{
                //     children: "Dung lượng file ảnh không được vượt quá 1MB",
                //   }}
                // />

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
              ) : (
                <Box
                  sx={{
                    backgroundColor: "#E6E6E6",
                    display: "inline-block !important",
                    borderRadius: "4px",
                  }}
                >
                  {get(defaultValues, "icon_for_member[0].file") ? (
                    <Image
                      src={get(defaultValues, "icon_for_member[0].file")}
                      width={100}
                      height={100}
                      alt=""
                    />
                  ) : (
                    <Avatar variant="rounded" sx={{ width: 100, height: 100 }} />
                  )}
                </Box>
              )}
            </Grid>

            {hasPermission && !isUpdateMode && (
              <Grid item xs={12}>
                <Stack display="flex" flexDirection="row" justifyContent="flex-end">
                  <Button onClick={onSetIsUpdateModeHandler(true)}>{BUTTON.EDIT}</Button>
                </Stack>
              </Grid>
            )}
          </Grid>
        </BoxWithShadow>

        <Stack flexDirection="row" columnGap={2} justifyContent="center">
          <Button variant="outlined" onClick={onGoBackHandler(isUpdateMode)}>
            {BUTTON.BACK}
          </Button>

          {isUpdateMode && (
            <LoadingButton
              onClick={handleSubmit((data) => {
                onSubmit({
                  data,
                  dirtyFields,
                });
              })}
              loading={loading}
            >
              {BUTTON.UPDATE}
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default DetailStoreCategory;

const Title = styled(Typography)(({ theme }) => {
  return { fontWeight: 700, lineHeight: "30px", marginBottom: "0.6rem" };
});
