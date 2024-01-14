import { set, omit, get } from "lodash";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useMemo, useState } from "react";
import { Box, Button, Grid, MenuItem, Stack, Typography } from "@mui/material";

import {
  BoxWithShadow,
  Container,
  FormControlForNumberV2,
  FormControlSelect,
  FormControlV2,
  LazyAutocompleteV2,
  LoadingButton,
} from "components";
import axios from "axios.config";
import { BUTTON, INPUT_PROPS } from "constant";
import { CUSTOMERS, MERCHANTS, POINTNOTES } from "apis";
import { useChoice, useConfirmation, useNotification, usePermission } from "hooks";
import { defaultPointNoteFormState, pointNoteSchema } from "yups/Partner/ParnerPointNote";

const TYPE = [
  ["partner", "Đối Tác"],
  ["customer", "Khách Hàng"],
];

export default function CreatePointNote() {
  const choice = useChoice();
  const router = useRouter();

  const [type, setType] = useState<any>(TYPE[0][0]);
  const [typeOwner, setTypeOwner] = useState<any>("");

  const { onConfirm, onClose } = useConfirmation();
  const { hasPermission } = usePermission("approve_point_note");
  const isMounted = useMountedState();

  const { point_note_flow_types } = choice;

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { handleSubmit, setError, clearErrors, control, reset } = useForm({
    resolver: pointNoteSchema(choice),
    defaultValues: defaultPointNoteFormState(choice),
  });

  const renderPointNoteFlowTypes = useMemo(() => {
    if (point_note_flow_types == undefined) return null;

    const filteredAppType = point_note_flow_types.filter((el, idx) => {
      return el[0] !== "Admin";
    });

    return (
      <Controller
        control={control}
        name="flow_type"
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
              label="Loại điểm"
              placeholder="Loại điểm"
            />
          );
        }}
      />
    );
  }, [point_note_flow_types]);

  const renderPositionTypes = useMemo(() => {
    return (
      <Controller
        control={control}
        name="type"
        render={(props) => {
          return (
            <FormControlSelect
              controlState={props}
              renderItem={() => {
                return TYPE.map((el) => {
                  return (
                    <MenuItem key={el[0]} value={el[0]}>
                      {el[1]}
                    </MenuItem>
                  );
                });
              }}
              SelectProps={{
                value: type,
                onChange: (_, value) => {
                  setType(get(value, "props.value"));
                },
              }}
              label="Loại đối tượng"
              placeholder="Loại đối tượng"
            />
          );
        }}
      />
    );
  }, [type]);

  const onSubmit = useCallback(
    async (data: any) => {
      try {
        setLoading(true);

        // set(data, "owner", null);
        // set(
        //   data,
        //   "owner_as_customer",
        //   "/admin/customers/11116acb-49fd-4533-a3e1-f44e9a84c893/"
        // );

        if (type === "partner") {
          const value = { ...omit(data, ["type", "owner_as_customer"]) };
          set(value, "owner", typeOwner);
          await axios.post(POINTNOTES, value);
        } else {
          const value = { ...omit(data, ["type", "owner"]) };
          set(value, "owner_as_customer", typeOwner);
          await axios.post(POINTNOTES, value);
        }
        // const value = { ...omit(data, ["type", "owner_as_customer"]) };

        enqueueSnackbarWithSuccess("Tạo thông tin tặng điểm thành công");
        router.back();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [typeOwner, type]
  );

  return (
    <Box component="form">
      <Container>
        <Stack spacing={3}>
          <BoxWithShadow>
            <Grid container spacing={2} marginBottom={3}>
              <Grid item xs={12}>
                <Typography variant="h2" color="primary2.main">
                  Thông tin tặng điểm
                </Typography>
              </Grid>

              <Grid item xs={6}>
                {renderPositionTypes}
              </Grid>

              {type === "partner" && (
                <Grid item xs={6}>
                  {/* <Controller
                    control={control}
                    name="owner"
                    render={(props) => {
                      return (
                        <FormControlV2
                          controlState={props}
                          label="Chủ ví"
                          placeholder="Chủ ví"
                        />
                      );
                    }}
                  /> */}
                  <Typography fontWeight={700} marginBottom={0.3} fontSize="0.875rem">
                    Chủ ví
                  </Typography>
                  <LazyAutocompleteV2<any>
                    {...{
                      url: MERCHANTS,
                      placeholder: "Chủ ví",
                      AutocompleteProps: {
                        getOptionLabel: (option) => {
                          return `${option.first_name} ${option.last_name}`;
                        },
                        onChange: (_, value) => {
                          setTypeOwner(value.self);
                        },
                        renderOption(props, option) {
                          return (
                            <li {...props} key={option.self}>
                              {option.first_name} {option.last_name}
                            </li>
                          );
                        },
                      },
                    }}
                  />
                </Grid>
              )}
              {type === "customer" && (
                <Grid item xs={6}>
                  <Typography fontWeight={700} marginBottom={0.3} fontSize="0.875rem">
                    Khách hàng
                  </Typography>
                  <LazyAutocompleteV2<any>
                    {...{
                      url: CUSTOMERS,
                      placeholder: "Khách hàng",
                      AutocompleteProps: {
                        getOptionLabel: (option) => {
                          return `${option.first_name} ${option.last_name}`;
                        },
                        onChange: (_, value) => {
                          setTypeOwner(value.self);
                        },
                        renderOption(props, option) {
                          return (
                            <li {...props} key={option.self}>
                              {option.first_name} {option.last_name}
                            </li>
                          );
                        },
                      },
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={6}>
                {renderPointNoteFlowTypes}
              </Grid>

              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="point_amount"
                  render={(props) => {
                    return (
                      <FormControlForNumberV2
                        placeholder="Số điểm"
                        label="Số điểm"
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
                  name="note"
                  control={control}
                  render={(props) => {
                    return (
                      <FormControlV2
                        controlState={props}
                        label="Nội dung"
                        placeholder="..."
                        InputProps={{
                          ...INPUT_PROPS,
                        }}
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

            <LoadingButton
              type="submit"
              onClick={handleSubmit(onSubmit, (err) => {})}
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
