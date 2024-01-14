import { useRouter } from "next/router";
import { Fragment, useCallback, useMemo } from "react";
import { Grid, Typography, Container, Button, Stack } from "@mui/material";

import useSWR from "swr";
import get from "lodash/get";
import axios from "axios.config";

import {
  Loading,
  InputNumber,
  BoxWithShadow,
  LoadingButton,
  FormControlBase,
} from "components";

import { BUTTON } from "constant";
import { POINTNOTES, MERCHANTS_STORES, MERCHANTS_BANK_ACCOUNTS } from "apis";
import { formatDate, getDisplayValueFromChoiceItem, transformUrl } from "libs";
import { useChoice, useConfirmation, useNotification, usePermission } from "hooks";

import {
  responseSchema,
  POINTNOTES_ITEM,
  MERCHANTS_STORES_ITEM,
  MERCHANTS_BANK_ACCOUNTS_ITEM,
} from "interfaces";

const DetailPointNote = () => {
  const router = useRouter();
  const { onConfirm, onClose } = useConfirmation();
  const { hasPermission } = usePermission("approve_point_note");

  const { point_note_statuses, point_note_flow_types } = useChoice();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const { data, mutate } = useSWR<POINTNOTES_ITEM>(
    transformUrl(`${POINTNOTES}${router.query.id}`, {
      use_cache: false,
    })
  );

  const { data: merchantStoreData } = useSWR<responseSchema<MERCHANTS_STORES_ITEM>>(
    () => {
      if (data == undefined) return;

      const { owner } = data;

      const baseURL = axios.defaults.baseURL;

      if (baseURL) {
        const pathname = owner.replace(baseURL, "");

        return transformUrl(MERCHANTS_STORES, {
          merchant: pathname,
          use_cache: false,
        });
      }
    }
  );

  const { data: merchantBankAccountData } = useSWR<
    responseSchema<MERCHANTS_BANK_ACCOUNTS_ITEM>
  >(() => {
    if (merchantStoreData == undefined) return;

    const merchantId = get(merchantStoreData, "results[0].merchant") as unknown as
      | string
      | undefined;

    if (merchantId == undefined) return;

    const baseURL = axios.defaults.baseURL;

    if (baseURL) {
      const pathname = merchantId.replace(baseURL, "");

      return transformUrl(MERCHANTS_BANK_ACCOUNTS, {
        user: pathname,
        use_cache: false,
      });
    }
  });

  const onApproveHandler = useCallback((self) => {
    return () => {
      const handler = async () => {
        try {
          await axios.patch(self, {
            status: "Confirmed",
          });
          await mutate();

          enqueueSnackbarWithSuccess("Duyệt yêu cầu thành công");
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
          onClose();
        }
      };
      const message = `Hãy xác nhận bạn muốn duyệt yêu cầu này, đây là hành động không thể hoàn tác`;
      onConfirm(handler, {
        message,
        variant: "info",
      });
    };
  }, []);

  const onGoBackHandler = useCallback(() => {
    const pathnameList = router.asPath.split("/").filter((el) => el !== "");
    pathnameList.pop();
    router.push(`/${pathnameList.join("/")}`);
  }, [router]);

  const renderBankAccount = useMemo(() => {
    if (merchantBankAccountData == undefined) return;
    const merchantBankAccount = merchantBankAccountData.results[0];

    return (
      <Fragment>
        <Grid item xs={3}>
          <FormControlBase
            InputProps={{
              readOnly: true,
              value: merchantBankAccount.account_number,
              placeholder: "Số Tài Khoản",
            }}
            FormLabelProps={{ children: "Số Tài Khoản" }}
          />
        </Grid>

        <Grid item xs={3}>
          <FormControlBase
            InputProps={{
              readOnly: true,
              value: merchantBankAccount.owner_name,
              placeholder: "Chủ Tài Khoản",
            }}
            FormLabelProps={{
              children: "Chủ Tài Khoản",
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <FormControlBase
            InputProps={{
              readOnly: true,
              value: merchantBankAccount.bank_name,
              placeholder: "Tên Ngân Hàng",
            }}
            FormLabelProps={{
              children: "Tên Ngân Hàng",
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <FormControlBase
            InputProps={{
              readOnly: true,
              value: merchantBankAccount.bank_branch,
              placeholder: "Chi Nhánh",
            }}
            FormLabelProps={{
              children: "Chi Nhánh",
            }}
          />
        </Grid>
      </Fragment>
    );
  }, [merchantBankAccountData]);

  if (
    data == undefined
    // ||
    // merchantStoreData == undefined
    // ||
    // merchantBankAccountData == undefined
  ) {
    return <Loading />;
  }

  const {
    date_placed,
    point_amount,
    status,
    flow_type,
    note,
    self,
    reviewer_name,
    date_updated,
    owner_name,
  } = data;

  // const merchantStore = merchantStoreData.results[0];
  // const merchantBankAccount = merchantBankAccountData.results[0];

  // if (merchantStore == undefined || merchantBankAccount == undefined) return null;
  // if (merchantStore == undefined) return null;

  return (
    <Container>
      <Stack spacing={3}>
        <BoxWithShadow>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Chi Tiết Yêu Cầu
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  value: owner_name,
                  placeholder: "Đối Tác",
                }}
                FormLabelProps={{
                  children: "Đối Tác",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  value: formatDate(date_placed),
                  placeholder: "Ngày Tạo",
                }}
                FormLabelProps={{
                  children: "Ngày Tạo",
                }}
              />
            </Grid>
            {renderBankAccount}
            {/* <Grid item xs={3}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  value: merchantBankAccount.account_number,
                  placeholder: "Số Tài Khoản",
                }}
                FormLabelProps={{ children: "Số Tài Khoản" }}
              />
            </Grid> */}
            {/* <Grid item xs={3}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  value: merchantBankAccount.owner_name,
                  placeholder: "Chủ Tài Khoản",
                }}
                FormLabelProps={{
                  children: "Chủ Tài Khoản",
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  value: merchantBankAccount.bank_name,
                  placeholder: "Tên Ngân Hàng",
                }}
                FormLabelProps={{
                  children: "Tên Ngân Hàng",
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  value: merchantBankAccount.bank_branch,
                  placeholder: "Chi Nhánh",
                }}
                FormLabelProps={{
                  children: "Chi Nhánh",
                }}
              />
            </Grid> */}

            <Grid item xs={4}>
              <InputNumber
                readOnly={true}
                InputProps={{
                  inputProps: {
                    placeholder: "Số Điểm",
                  },
                  sx: {
                    WebkitTextFillColor: ({ palette }) => {
                      return flow_type === "Cash_To_Point"
                        ? `${palette.primary2.main} !important`
                        : `${palette.primary.main} !important`;
                    },
                    fontWeight: 700,
                  },
                }}
                FormLabelProps={{
                  children: "Số Điểm",
                }}
                NumberFormatProps={{
                  value: point_amount,
                  prefix: flow_type === "Cash_To_Point" ? "+" : "-",
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  placeholder: "Loại",
                  value: getDisplayValueFromChoiceItem(point_note_flow_types, flow_type),
                  sx: {
                    WebkitTextFillColor: ({ palette }) => {
                      return flow_type === "Cash_To_Point"
                        ? `${palette.primary2.main} !important`
                        : `${palette.primary.main} !important`;
                    },
                    fontWeight: 700,
                  },
                }}
                FormLabelProps={{
                  children: "Loại",
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  placeholder: "Trạng Thái",
                  value: getDisplayValueFromChoiceItem(point_note_statuses, status),
                  sx: {
                    WebkitTextFillColor: ({ palette }) => {
                      return status === "Draft"
                        ? `${palette.primary.main} !important`
                        : `${palette.primary2.main} !important`;
                    },
                    fontWeight: 700,
                  },
                }}
                FormLabelProps={{
                  children: "Trạng Thái",
                }}
              />
            </Grid>

            {status === "Confirmed" && (
              <Grid item xs={6}>
                <FormControlBase
                  InputProps={{
                    readOnly: true,
                    value: reviewer_name,
                    placeholder: "Người Duyệt",
                  }}
                  FormLabelProps={{
                    children: "Người Duyệt",
                  }}
                />
              </Grid>
            )}

            {status === "Confirmed" && (
              <Grid item xs={6}>
                <FormControlBase
                  InputProps={{
                    readOnly: true,
                    value: formatDate(date_updated),
                    placeholder: "Ngày Duyệt",
                  }}
                  FormLabelProps={{
                    children: "Ngày Duyệt",
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  value: note || "-",
                  multiline: true,
                  rows: 5,
                  sx: {
                    paddingX: 1,
                  },
                  placeholder: "Ghi Chú",
                }}
                FormLabelProps={{
                  children: "Ghi Chú",
                }}
              />
            </Grid>
          </Grid>
        </BoxWithShadow>

        <Stack justifyContent={"center"} flexDirection={"row"} columnGap={2}>
          <Button variant="outlined" onClick={onGoBackHandler}>
            {BUTTON.BACK}
          </Button>

          {status === "Draft" && hasPermission && (
            <LoadingButton onClick={onApproveHandler(self)}>Duyệt</LoadingButton>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default DetailPointNote;
