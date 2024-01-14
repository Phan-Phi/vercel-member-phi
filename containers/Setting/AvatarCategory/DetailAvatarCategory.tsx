import useSWR from "swr";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import React, { useCallback, useEffect, useState } from "react";
import { useChoice, useNotification, usePermission } from "hooks";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { get, set, isEmpty } from "lodash";

import {
  Box,
  Grid,
  Stack,
  Button,
  styled,
  useTheme,
  FormControl,
  Container,
  Typography,
  FormHelperText,
} from "@mui/material";

import {
  Loading,
  LoadingButton,
  BoxWithShadow,
  FormControlV2,
  AvatarForUpload,
} from "components";

import {
  avatarSchema,
  AvatarSchemaProps,
  avatarCategorySchema,
  AvatarCategorySchemaProps,
  defaultAvatarCategoryFormState,
} from "yups";

import { AVATARS_CATEGORIES_ITEM, responseSchema, AVATARS_ITEM } from "interfaces";
import { dropzoneRejected, transformJSONToFormData, transformUrl } from "libs";
import { AVATARS, AVATARS_CATEGORIES } from "apis";
import { BUTTON } from "constant";
import { PATHNAME } from "routes";
import axios from "axios.config";
import Dropzone from "react-dropzone";

const DetailAvatar = () => {
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState<AvatarCategorySchemaProps>();

  const [defaultAvatarValues, setDefaultAvatarValues] = useState<AvatarSchemaProps>();

  const { data: avatarCategoryData, mutate } = useSWR<AVATARS_CATEGORIES_ITEM>(
    transformUrl(`${AVATARS_CATEGORIES}${router.query.id}/`, {
      use_cache: false,
    })
  );

  const { data: avatarData, mutate: avatarMutate } = useSWR<responseSchema<AVATARS_ITEM>>(
    () => {
      if (avatarCategoryData == undefined) return;

      return transformUrl(avatarCategoryData.avatars, {
        limit: 100,
        use_cache: false,
      });
    }
  );

  const setDefaultValuesHandler = useCallback((data: AVATARS_CATEGORIES_ITEM) => {
    const body = {} as AvatarCategorySchemaProps;

    const keyList = [...Object.keys(defaultAvatarCategoryFormState()), "self"];

    keyList.forEach((key) => {
      const temp = get(data, key);

      if (key === "image") {
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
  }, []);

  const setDefaultAvatarValuesHandler = useCallback(
    (data: responseSchema<AVATARS_ITEM>) => {
      const transformedAvatarData = get(data, "results").map((el) => {
        return {
          ...el,
          file: el.image,
        };
      });

      const temp = {} as AvatarSchemaProps;

      set(temp, "avatars", transformedAvatarData);

      setDefaultAvatarValues(temp);
    },

    []
  );

  useEffect(() => {
    if (avatarCategoryData == undefined) return;

    setDefaultValuesHandler(avatarCategoryData);
  }, [avatarCategoryData]);

  useEffect(() => {
    if (avatarData == undefined) return;

    setDefaultAvatarValuesHandler(avatarData);
  }, [avatarData, setDefaultAvatarValuesHandler]);

  const onSuccessHandler = useCallback(async () => {
    setDefaultValues(undefined);
    setDefaultAvatarValues(undefined);

    const [data, avatarData] = await Promise.all([mutate(), avatarMutate()]);

    data && setDefaultValuesHandler(data);
    avatarData && setDefaultAvatarValuesHandler(avatarData);
  }, []);

  if (defaultValues == undefined || defaultAvatarValues == undefined) {
    return <Loading />;
  }

  return <RootComponent {...{ defaultValues, onSuccessHandler, defaultAvatarValues }} />;
};

interface RootComponentProps {
  defaultValues: AvatarCategorySchemaProps;
  defaultAvatarValues: AvatarSchemaProps;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = (props: RootComponentProps) => {
  const { defaultValues, onSuccessHandler, defaultAvatarValues } = props;

  const theme = useTheme();
  const choice = useChoice();
  const router = useRouter();
  const { hasPermission } = usePermission("write_avatar_category");

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
    resolver: avatarCategorySchema(choice),
    defaultValues,
  });

  const {
    handleSubmit: avatarHandleSubmit,
    control: avatarControl,
    setError: avatarSetError,
    clearErrors: avatarClearErrors,
    reset: avatarReset,
    formState: { dirtyFields: avatarDirtyFields },
  } = useForm({
    resolver: avatarSchema(choice),
    defaultValues: defaultAvatarValues,
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
      avatarDirtyData,
      dirtyData,
      defaultAvatarData,
    }: {
      avatarData: AvatarSchemaProps;
      data: AvatarCategorySchemaProps;
      dirtyData: object;
      avatarDirtyData: object;
      defaultAvatarData: AvatarSchemaProps;
    }) => {
      let currentAvatarData = avatarData.avatars;
      let originalAvatarData = defaultAvatarData.avatars;

      const avatarCreateList: any[] = [];
      const avatarDeleteList: any[] = [];

      currentAvatarData.forEach((el) => {
        const value = el.file;
        if (value instanceof File) {
          avatarCreateList.push(el);
        }
      });

      originalAvatarData.forEach((el) => {
        const value = el.file;

        const elementImageAvatar = currentAvatarData.some((el) => {
          return el.file === value;
        });
        if (elementImageAvatar === false) {
          avatarDeleteList.push(el);
        }
      });

      try {
        const categorySelf = get(data, "self");

        setLoading(true);

        if (!isEmpty(dirtyData)) {
          const transformedIconForMember = data.image.map((el) => {
            return el.file;
          });

          set(data, "image", transformedIconForMember);

          const formData = transformJSONToFormData(data, dirtyData);

          await axios.patch(`${AVATARS_CATEGORIES}${router.query.id}/`, formData);
        }

        if (!isEmpty(avatarDirtyData)) {
          await Promise.all(
            avatarDeleteList.map((el) => {
              return axios.delete(el.self);
            })
          );

          const transformedImage = avatarCreateList.map((el) => {
            return el.file;
          });

          if (categorySelf) {
            await Promise.all(
              transformedImage.map((el) => {
                const formData = new FormData();
                formData.append("category", categorySelf);
                formData.append("image", el);
                return axios.post(AVATARS, formData);
              })
            );
          }
        }

        enqueueSnackbarWithSuccess("Cập nhật thông tin danh mục Avatar thành công");

        await onSuccessHandler();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [onSuccessHandler]
  );

  // setIsUpdateMode
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
        avatarReset(defaultAvatarValues, {
          keepDirty: false,
        });

        setIsUpdateMode(false);
      } else {
        router.push(`/${PATHNAME.CAI_DAT}/${PATHNAME.AVATAR}`);
      }
    };
  }, []);

  return (
    <Box>
      <Container sx={{ marginBottom: "1.5rem" }}>
        <Stack spacing={3}>
          <BoxWithShadow>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h2" sx={{ color: theme.palette.primary2.main }}>
                  Thông Tin Danh Mục Avatar
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Title variant="body2">Ảnh Đại Diện Danh Mục Avatar</Title>

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
                              <Box {...getRootProps({})}>
                                <AvatarForUpload
                                  src={src}
                                  readOnly={!isUpdateMode}
                                  onRemove={() => {
                                    onChange(null);
                                  }}
                                />
                              </Box>
                              <FormHelperText>
                                Dung lượng file ảnh không được vượt quá 1MB
                              </FormHelperText>
                              {error && <FormHelperText>{error.message}</FormHelperText>}
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
                        label="Tên danh mục Avatar"
                        InputProps={{
                          readOnly: !isUpdateMode,
                        }}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h2" sx={{ color: theme.palette.primary2.main }}>
                  Danh Sách Hình
                </Typography>
                {isUpdateMode && (
                  <Typography color="rgba(0,0,0,0.6)" marginTop={0.5} variant="subtitle1">
                    Dung lượng file ảnh không được vượt quá 1MB
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <BoxWithShadow sx={{ height: "15rem", overflowY: "auto" }}>
                  <Controller
                    control={avatarControl}
                    name="avatars"
                    render={(props) => {
                      const { field, fieldState } = props;

                      const { name } = field;
                      const { error } = fieldState;

                      return (
                        <Dropzone
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
                          multiple
                          maxSize={1024 * 1024}
                          accept={{
                            "image/*": [],
                          }}
                        >
                          {({ getRootProps }) => {
                            return (
                              <FormControl>
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
                                        readOnly={!isUpdateMode}
                                        onRemove={() => {
                                          remove(idx);
                                        }}
                                      />
                                    );
                                  })}
                                  {isUpdateMode && (
                                    <Box {...getRootProps()}>
                                      <AvatarForUpload />
                                    </Box>
                                  )}
                                </Box>

                                {error && (
                                  <FormHelperText>{error.message}</FormHelperText>
                                )}
                              </FormControl>
                            );
                          }}
                        </Dropzone>
                      );
                    }}
                  />
                </BoxWithShadow>
              </Grid>

              {hasPermission && (
                <Grid item xs={12}>
                  <Stack
                    columnGap={2}
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-end"
                  >
                    <Button
                      sx={{ display: isUpdateMode ? "none" : "block" }}
                      variant="contained"
                      onClick={onSetIsUpdateModeHandler(true)}
                    >
                      {BUTTON.EDIT}
                    </Button>
                  </Stack>
                </Grid>
              )}
            </Grid>
          </BoxWithShadow>
        </Stack>
      </Container>

      <Stack flexDirection="row" columnGap={2} justifyContent={"center"}>
        <Button variant="outlined" onClick={onGoBackHandler(isUpdateMode)}>
          {BUTTON.BACK}
        </Button>

        {isUpdateMode && (
          <LoadingButton
            onClick={handleSubmit((data) => {
              avatarHandleSubmit((avatarData) => {
                onSubmit({
                  data,
                  avatarData,
                  dirtyData: dirtyFields,
                  avatarDirtyData: avatarDirtyFields,
                  defaultAvatarData: defaultAvatarValues,
                });
              })();
            })}
            loading={loading}
          >
            {BUTTON.UPDATE}
          </LoadingButton>
        )}
      </Stack>
    </Box>
  );
};

export default DetailAvatar;

const Title = styled(Typography)(({ theme }) => {
  return { fontWeight: 700, lineHeight: "30px", marginBottom: "0.6rem" };
});
