import useSWR from "swr";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { formatISO, parseISO } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useMemo, useState, useEffect, Fragment } from "react";
import { get, set, pick, isEmpty, isEqual, cloneDeep } from "lodash";

import {
  Stack,
  Button,
  Grid,
  Typography,
  styled,
  Box,
  Fade,
  useTheme,
  MenuItem,
  Skeleton,
} from "@mui/material";

import {
  Loading,
  Container,
  BoxWithShadow,
  Switch,
  FormControl,
  DatePicker,
  Ward,
  District,
  Province,
  Radio,
  RadioItem,
  LoadingButton,
  Select,
  FormControlV2,
  DatePickerBase,
  InputForDatePicker,
  CheckboxSingleChoice,
  FormControlForPhoneNumberV2,
} from "components";

import {
  responseSchema,
  ADMINS_ITEM,
  ADMINS_ADDRESSES_ITEM,
  GROUPS_ITEM,
  PERMISSIONS_ITEM,
} from "interfaces";

import {
  adminSchema,
  AdminSchemaProps,
  adminAddressSchema,
  AdminAddressSchemaProps,
  defaultAdminFormState,
} from "yups";

import axios from "axios.config";
import { BUTTON } from "constant";
import { PATHNAME } from "routes";
import { useChoice, useNotification } from "hooks";
import { ADMINS, GROUPS, ADMINS_ADDRESS } from "apis";
import {
  convertValueToTupleForAddress,
  transformArrayAddressToString,
  transformUrl,
} from "libs";

const EditAdmin = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<AdminSchemaProps>();

  const [defaultAddressValues, setDefaultAddressValues] =
    useState<AdminAddressSchemaProps>();
  const { data: adminData, mutate } = useSWR<ADMINS_ITEM>(
    transformUrl(`${ADMINS}${router.query.id}`, {
      use_cache: false,
    })
  );
  const { data: addressData } = useSWR<responseSchema<ADMINS_ADDRESSES_ITEM>>(() => {
    if (adminData == undefined) return;

    return transformUrl(adminData.addresses, {
      use_cache: false,
    });
  });
  const { data: groupData } = useSWR<responseSchema<GROUPS_ITEM>>(() => {
    if (adminData == undefined) return;

    return transformUrl(adminData.groups, {
      use_cache: false,
    });
  });

  const setDefaultValuesHandler = useCallback((data: ADMINS_ITEM) => {
    const keyList = [...Object.keys(defaultAdminFormState()), "groups", "self"];

    const body = {} as AdminSchemaProps;

    keyList.forEach((key) => {
      const temp = get(data, key);

      if (key === "birthday" && temp) {
        set(body, key, parseISO(temp));
        return;
      }

      if (key === "add_groups" || key === "remove_groups") {
        set(body, key, []);
        return;
      }

      set(body, key, temp);
    });

    setDefaultValues(body);
  }, []);

  const setDefaultAddressValuesHandler = useCallback(
    (data: responseSchema<ADMINS_ADDRESSES_ITEM>) => {
      const addressData = cloneDeep(get(data, "results[0]")) || {
        line: "",
        province: null,
        district: null,
        ward: null,
      };

      convertValueToTupleForAddress(addressData).then((transformedData) => {
        if (transformedData) {
          const { province, district, ward } = transformedData;

          set(addressData, "province", province[0] === "" ? null : province);
          set(addressData, "district", district[0] === "" ? null : district);
          set(addressData, "ward", ward[0] === "" ? null : ward);
        }

        setDefaultAddressValues(addressData);
      });
    },
    []
  );

  useEffect(() => {
    if (adminData == undefined || groupData == undefined) return;

    const cloneAdminData = cloneDeep(adminData);

    set(cloneAdminData, "groups", groupData.results);

    setDefaultValuesHandler(cloneAdminData);
  }, [adminData, groupData, setDefaultValuesHandler]);

  useEffect(() => {
    if (addressData == undefined) return;

    setDefaultAddressValuesHandler(addressData);
  }, [addressData]);

  const onSuccessHandler = useCallback(async () => {
    setDefaultValues(undefined);

    await mutate();

    router.push(`/${PATHNAME.CAI_DAT}/${PATHNAME.NGUOI_DUNG}/${router.query.id}`);
  }, []);

  if (defaultValues == undefined || defaultAddressValues == undefined) {
    return <Loading />;
  }

  return <RootComponent {...{ defaultValues, defaultAddressValues, onSuccessHandler }} />;
};

interface RootComponentProps {
  defaultValues: AdminSchemaProps;
  defaultAddressValues: AdminAddressSchemaProps;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = (props: RootComponentProps) => {
  const { defaultValues, defaultAddressValues, onSuccessHandler } = props;

  const theme = useTheme();
  const choice = useChoice();
  const router = useRouter();
  const isMounted = useMountedState();

  const [selectedPosition, setSelectedPosition] = useState<GROUPS_ITEM>(() => {
    return get(defaultValues, "groups[0]") || {};
  });

  const [animationState, setAnimationState] = useState<boolean>(true);

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const {
    handleSubmit,
    control,
    formState: { dirtyFields },
  } = useForm({
    resolver: adminSchema(choice),
    defaultValues,
  });

  const {
    watch: adminAddressWatch,
    control: adminAddressControl,
    setValue: adminAddressSetValue,
    handleSubmit: adminAddressHandleSubmit,
    formState: { dirtyFields: adminAddressDirtyFields },
  } = useForm({
    resolver: adminAddressSchema(),
    defaultValues: defaultAddressValues,
  });

  const { genders } = choice;

  const { data: groupData } = useSWR<responseSchema<GROUPS_ITEM>>(GROUPS);

  const { data: permissionData } = useSWR<responseSchema<PERMISSIONS_ITEM>>(() => {
    if (selectedPosition?.permissions) {
      return transformUrl(selectedPosition.permissions, {
        get_all: true,
      });
    }
  });

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
      dirtyData,
      dirtyAdminAddressData,
    }: {
      data: AdminSchemaProps;
      addressData: AdminAddressSchemaProps;
      dirtyData: object;
      dirtyAdminAddressData: object;
    }) => {
      try {
        const self = get(data, "self");

        if (self == undefined) return;

        setLoading(true);

        const transformedAddGroup = data.add_groups.map((el) => {
          return get(el, "self");
        });

        set(data, "add_groups", transformedAddGroup);

        const transformedRemoveGroup = data.remove_groups.map((el) => {
          return get(el, "self");
        });

        set(data, "remove_groups", transformedRemoveGroup);

        const birthday = get(data, "birthday");

        if (birthday) {
          set(data, "birthday", formatISO(birthday));
        }

        if (!isEmpty(dirtyData)) {
          const body = pick(data, Object.keys(dirtyData));

          await axios.patch(self, body);
        }

        if (!isEmpty(dirtyAdminAddressData)) {
          const addressSelf = get(addressData, "self");

          const transformedAddressData = transformArrayAddressToString(addressData);
          const body = pick(transformedAddressData, Object.keys(dirtyAdminAddressData));

          if (addressSelf) {
            await axios.patch(addressSelf, body);
          } else {
            set(body, "user", self);
            await axios.post(ADMINS_ADDRESS, body);
          }
        }

        enqueueSnackbarWithSuccess("Cập nhật người dùng thành công");
        onSuccessHandler();
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

  const onSetSelectedPosition = useCallback((data: GROUPS_ITEM) => {
    return () => {
      setSelectedPosition(data);
    };
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
      return <Skeleton height={300} />;
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
                          onClick={onSetSelectedPosition(el)}
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
  }, [
    renderPositionDescription,
    groupData,
    animationState,
    selectedPosition,
    theme,
    animationHandler,
  ]);

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
                {/* <DatePicker control={control} name="birthday" label="Ngày Sinh" /> */}
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
            <LoadingButton
              onClick={handleSubmit((data) => {
                adminAddressHandleSubmit((addressData) => {
                  const originalGroup = get(data, "groups[0]");

                  const mutatedDirtyFields = cloneDeep(dirtyFields);

                  if (!isEqual(originalGroup, selectedPosition)) {
                    set(mutatedDirtyFields, "add_groups", true);
                    set(mutatedDirtyFields, "remove_groups", true);

                    set(data, "add_groups", [selectedPosition]);
                    set(
                      data,
                      "remove_groups",
                      originalGroup == undefined ? [] : [originalGroup]
                    );
                  }

                  onSubmit({
                    data,
                    addressData,
                    dirtyData: mutatedDirtyFields,
                    dirtyAdminAddressData: adminAddressDirtyFields,
                  });
                })();
              })}
              loading={loading}
            >
              {BUTTON.UPDATE}
            </LoadingButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default EditAdmin;

const Title = styled(Typography)(({ theme }) => {
  return { fontWeight: 700, lineHeight: "30px", marginBottom: "0.6rem" };
});
