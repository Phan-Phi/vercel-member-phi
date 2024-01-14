import useSWR from "swr";
import { PATHNAME } from "routes";
import { formatISO } from "date-fns";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { useMountedState } from "react-use";

import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import { get, set } from "lodash";

import {
  Box,
  Grid,
  Typography,
  Stack,
  Button,
  styled,
  Fade,
  useTheme,
  MenuItem,
  Skeleton,
} from "@mui/material";

import {
  LoadingButton,
  BoxWithShadow,
  Container,
  District,
  Province,
  Radio,
  RadioItem,
  Ward,
  Select,
  DatePickerBase,
  InputForDatePicker,
  FormControlV2,
  CheckboxSingleChoice,
  FormControlForPhoneNumberV2,
} from "components";

import axios from "axios.config";
import { useChoice, useNotification } from "hooks";
import { ADMINS, ADMINS_ADDRESS, GROUPS } from "apis";

import {
  adminSchema,
  defaultAdminFormState,
  AdminSchemaProps,
  adminAddressSchema,
  defaultAdminAddressFormState,
  AdminAddressSchemaProps,
} from "yups";

import { transformArrayAddressToString, transformUrl } from "libs";

import { GROUPS_ITEM, responseSchema, PERMISSIONS_ITEM } from "interfaces";

import { BUTTON } from "constant";

const CreateSettingUser = () => {
  const theme = useTheme();
  const router = useRouter();
  const choice = useChoice();
  const isMounted = useMountedState();

  const { genders } = choice;

  const [animationState, setAnimationState] = useState<boolean>(true);
  const [selectedPosition, setSelectedPosition] = useState<GROUPS_ITEM>();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid: isValidPartner },
  } = useForm({
    mode: "onChange",
    resolver: adminSchema(choice),
    defaultValues: defaultAdminFormState(),
  });

  const {
    watch: adminAddressWatch,
    control: adminAddressControl,
    setValue: adminAddressSetValue,
    reset: adminAddressReset,
    handleSubmit: adminAddressHandleSubmit,
    formState: { isValid: isValidAddress },
  } = useForm({
    mode: "onChange",
    resolver: adminAddressSchema(),
    defaultValues: defaultAdminAddressFormState(),
  });

  const { data: groupData } = useSWR<responseSchema<GROUPS_ITEM>>(GROUPS);

  const { data: permissionData } = useSWR<responseSchema<PERMISSIONS_ITEM>>(() => {
    if (selectedPosition?.permissions) {
      return transformUrl(selectedPosition.permissions, {
        get_all: true,
      });
    }
  });

  useEffect(() => {
    if (groupData == undefined) {
      return;
    }
    const data = get(groupData, "results[0]");

    setSelectedPosition(data);
  }, [groupData]);

  const animationHandler = useCallback(() => {
    setAnimationState(false);

    const timer = setTimeout(() => {
      setAnimationState(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const onSubmit = useCallback(
    async ({
      data,
      addressData,
    }: {
      data: AdminSchemaProps;
      addressData: AdminAddressSchemaProps;
    }) => {
      try {
        setLoading(true);

        const birthday = get(data, "birthday");

        if (birthday) {
          set(data, "birthday", formatISO(birthday));
        }

        const transformedAddGroup = data.add_groups.map((el) => {
          return get(el, "self");
        });

        set(data, "add_groups", transformedAddGroup);

        const { data: resData } = await axios.post(ADMINS, data);

        const self = get(resData, "self");

        if (self) {
          set(addressData, "user", self);

          const transformedAddressData = transformArrayAddressToString(addressData);

          await axios.post(ADMINS_ADDRESS, transformedAddressData);

          enqueueSnackbarWithSuccess("Tạo người dùng thành công");
          router.replace(`/${PATHNAME.CAI_DAT}/${PATHNAME.NGUOI_DUNG}`);
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

  const onSetSelectedPositionHandler = useCallback((data: GROUPS_ITEM) => {
    return () => {
      setSelectedPosition(data);
    };
  }, []);

  const onResetHandler = useCallback(() => {
    reset(defaultAdminFormState(choice));
    adminAddressReset(defaultAdminAddressFormState(choice));
  }, []);

  const renderGender = useMemo(() => {
    if (genders == undefined) {
      return null;
    }

    return (
      <Select
        label="Giới tính"
        control={control}
        name="gender"
        renderItem={() => {
          return genders.map((el) => {
            return (
              <MenuItem key={el[0]} value={el[0]}>
                {el[1]}
              </MenuItem>
            );
          });
        }}
      />
    );
  }, [genders]);

  const renderPositionDescription = useMemo(() => {
    if (groupData == undefined || permissionData == undefined) {
      return null;
    }

    return (
      <BoxWithShadow
        sx={{
          overflowY: "scroll",
          height: "15rem",
        }}
      >
        <Box component="ul" sx={{ paddingLeft: "1rem", margin: 0 }}>
          {permissionData.results?.map((el, idx) => {
            return (
              <Box
                component="li"
                key={el.codename}
                sx={{ paddingTop: idx !== 0 ? 1 : 0 }}
              >
                {el.name}
              </Box>
            );
          })}
        </Box>
      </BoxWithShadow>
    );
  }, [groupData, permissionData]);

  const renderPosition = useMemo(() => {
    if (groupData == undefined) {
      return (
        <Fragment>
          <Grid item xs={4}>
            <Skeleton height={300} />
          </Grid>
          <Grid item xs={8}>
            <Skeleton height={300} />
          </Grid>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Grid item xs={12}>
          <Title variant="body2">Vị Trí</Title>
        </Grid>

        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={4}>
              <Box
                sx={{
                  ".MuiFormControl-root": {
                    boxShadow:
                      "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);",
                    borderRadius: "0.8rem",
                  },
                  ".MuiFormControl-root .MuiFormLabel-root , .MuiFormControl-root .MuiFormHelperText-root":
                    {
                      display: "none",
                    },

                  ".MuiFormControlLabel-root": {
                    margin: 0,
                    width: "100%",
                    padding: "0.8rem",
                  },
                  ".MuiFormControlLabel-root .MuiTypography-root": {
                    width: "100%",
                  },
                  ".MuiFormGroup-root .MuiButtonBase-root": {
                    display: "none",
                  },
                }}
              >
                <Radio
                  RadioGroupProps={{
                    onChange: animationHandler,
                  }}
                  renderItem={() => {
                    return groupData.results.map((el, idx) => {
                      return (
                        <Box
                          onClick={onSetSelectedPositionHandler(el)}
                          key={idx}
                          sx={{
                            "&:first-of-type": {
                              borderRadius: "0.5rem 0.5rem 0 0 ",
                            },
                            "&:last-child": { borderRadius: "0 0 0.5rem 0.5rem" },

                            backgroundColor:
                              el.self == selectedPosition?.["self"]
                                ? theme.palette.secondary.main
                                : theme.palette.common.white,
                            color:
                              el.self == selectedPosition?.["self"]
                                ? theme.palette.common.white
                                : "black",
                          }}
                        >
                          <RadioItem
                            label={el.name}
                            RadioProps={{
                              value: el.self,
                            }}
                          />
                        </Box>
                      );
                    });
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={8}>
              <Fade
                in={animationState}
                timeout={{
                  enter: 500,
                }}
              >
                <Box>{renderPositionDescription}</Box>
              </Fade>
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }, [renderPositionDescription, groupData, animationState, selectedPosition]);

  return (
    <Box component="form">
      <Container>
        <Stack spacing={3}>
          <BoxWithShadow>
            <Grid container spacing={2} marginBottom={3}>
              <Grid item xs={12}>
                <Typography variant="h2" color="primary2.main">
                  Thông Tin Cá Nhân
                </Typography>
              </Grid>
              <Grid item xs={6}>
                {/* <FormControl
                  label="Họ"
                  placeholder="Họ"
                  control={control}
                  name="last_name"
                /> */}

                <Controller
                  name="last_name"
                  control={control}
                  render={(props) => {
                    return (
                      <FormControlV2 controlState={props} label="Họ" placeholder="Họ" />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                {/* <FormControl
                  label="Tên"
                  placeholder="Tên"
                  control={control}
                  name="first_name"
                /> */}

                <Controller
                  name="first_name"
                  control={control}
                  render={(props) => {
                    return (
                      <FormControlV2 controlState={props} label="Tên" placeholder="Tên" />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="birthday"
                  render={(props) => {
                    const {
                      field: { value, onChange },
                      fieldState: { error },
                    } = props;

                    return (
                      <DatePickerBase
                        onChange={onChange}
                        value={value}
                        label="Ngày sinh nhật"
                        renderInput={(props) => {
                          return <InputForDatePicker {...props} error={false} />;
                        }}
                      />
                    );
                  }}
                />
                {/* <DatePicker
                  control={control}
                  name="birthday"
                  DatePickerProps={{}}
                  InputProps={{}}
                  label="Ngày Sinh"
                /> */}
              </Grid>
              <Grid item xs={6}>
                {renderGender}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h2" color="primary2.main">
                  Thông Tin Tài Khoản
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Controller
                  control={control}
                  name="phone_number"
                  render={(props) => {
                    return <FormControlForPhoneNumberV2 controlState={props} />;
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                {/* <FormControl
                  label="Email"
                  placeholder="Email"
                  control={control}
                  name="email"
                  InputProps={{
                    type: "email",
                  }}
                /> */}

                <Controller
                  name="email"
                  control={control}
                  render={(props) => {
                    return (
                      <FormControlV2
                        controlState={props}
                        label="Email"
                        placeholder="Email"
                        InputProps={{
                          type: "email",
                        }}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                {/* <Switch label="Trạng thái" control={control} name="is_active" /> */}

                <Controller
                  control={control}
                  name="is_active"
                  render={(props) => {
                    return (
                      <CheckboxSingleChoice
                        controlState={props}
                        label="Trạng thái"
                        checkboxLabel={
                          props.field.value ? "Hoạt động" : "Không hoạt động"
                        }
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h2" color="primary2.main">
                  Thông Tin Liên Lạc
                </Typography>
              </Grid>
              <Grid item xs={6}>
                {/* <FormControl
                  label="Địa chỉ"
                  placeholder="Địa chỉ"
                  control={adminAddressControl}
                  name="line"
                /> */}

                <Controller
                  name="line"
                  control={adminAddressControl}
                  render={(props) => {
                    return (
                      <FormControlV2
                        controlState={props}
                        label="Địa chỉ"
                        placeholder="Địa chỉ"
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                {/* <Province
                  name={"province"}
                  control={adminAddressControl}
                  watch={adminAddressWatch}
                  setValue={adminAddressSetValue}
                /> */}

                <Controller
                  control={adminAddressControl}
                  name="province"
                  render={(props) => {
                    return (
                      <Province
                        controlState={props}
                        onChange={() => {
                          adminAddressSetValue("district", null);
                          adminAddressSetValue("ward", null);
                        }}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                {/* <District
                  name={"district"}
                  control={adminAddressControl}
                  watch={adminAddressWatch}
                  setValue={adminAddressSetValue}
                /> */}

                <Controller
                  control={adminAddressControl}
                  name="district"
                  render={(props) => {
                    const provinceTuple = adminAddressWatch("province");

                    return (
                      <District
                        controlState={props}
                        province={provinceTuple ? provinceTuple[0] : undefined}
                        onChange={() => {
                          adminAddressSetValue("ward", null);
                        }}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                {/* <Province
                  name={"province"}
                  control={adminAddressControl}
                  name={"ward"}
                  watch={adminAddressWatch}
                  setValue={adminAddressSetValue}
                /> */}

                <Controller
                  name="ward"
                  control={adminAddressControl}
                  render={(props) => {
                    const provinceTuple = adminAddressWatch("province");
                    const districtTuple = adminAddressWatch("district");

                    return (
                      <Ward
                        controlState={props}
                        province={provinceTuple ? provinceTuple[0] : undefined}
                        district={districtTuple ? districtTuple[0] : undefined}
                      />
                    );
                  }}
                />
              </Grid>

              {renderPosition}
            </Grid>
          </BoxWithShadow>

          <Stack flexDirection="row" columnGap={2} justifyContent={"center"}>
            <Button variant="outlined" disabled={loading} onClick={router.back}>
              {BUTTON.BACK}
            </Button>

            <Button
              variant="outlined"
              color="error"
              disabled={loading}
              onClick={onResetHandler}
            >
              {BUTTON.RESET}
            </Button>

            <LoadingButton
              type="submit"
              onClick={handleSubmit((data) => {
                adminAddressHandleSubmit((addressData) => {
                  set(data, "add_groups", [selectedPosition]);

                  onSubmit({
                    data,
                    addressData,
                  });
                })();
              })}
              loading={loading}
              disabled={
                !isValidAddress === false && !isValidPartner === false ? false : true
              }
            >
              {BUTTON.CREATE}
            </LoadingButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default CreateSettingUser;

const Title = styled(Typography)(() => {
  return { fontWeight: 700, marginBottom: "4px", lineHeight: "30px" };
});
