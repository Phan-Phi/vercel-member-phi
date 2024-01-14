import useSWR from "swr";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import React, { useEffect, useMemo, useState, useCallback, Fragment } from "react";

import { cloneDeep, get } from "lodash";
import CircleIcon from "@mui/icons-material/Circle";
import { Grid, Typography, FormControl as OriginalFormControl, Box } from "@mui/material";

import {
  Loading,
  FormLabel,
  FormControlBase,
  FormControlForPhoneNumber,
} from "components";
import CashierTable from "./CashierTable";

import axios from "axios.config";
import { SAFE_OFFSET } from "constant";
import { MERCHANTS_STORES_BRANCHES } from "apis";

import {
  transformUrl,
  setFilterValue,
  convertValueToTupleForAddress,
  getDisplayValueFromChoiceItem,
} from "libs";

import {
  useFetch,
  useChoice,
  useNotification,
  useConfirmation,
  useGetHeightForTable,
} from "hooks";

import {
  responseSchema,
  MERCHANTS_STORES_BRANCHES_ITEM,
  MERCHANTS_STORES_BRANCHES_CASHIERS_ITEM,
  MERCHANTS_STORES_BRANCHES_WEEKDAYOPENINGPERIODS_ITEM,
} from "interfaces";

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
};

const TabDetailBranchInfo = () => {
  const router = useRouter();
  const { weekdays } = useChoice();
  const isMounted = useMountedState();
  const { onConfirm, onClose } = useConfirmation();
  const [filter, setFilter] = useState(defaultFilterValue);
  const [ref, { height }] = useGetHeightForTable();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [data, setData] = useState<MERCHANTS_STORES_BRANCHES_ITEM>();

  const { data: branchData } = useSWR<MERCHANTS_STORES_BRANCHES_ITEM>(
    transformUrl(`${MERCHANTS_STORES_BRANCHES}${router.query.branchId}`, {
      use_cache: false,
    })
  );

  const cashiersUrl = get(branchData, "cashiers");

  const {
    data: cashiersData,
    isLoading,
    itemCount,
    changeKey,
    refreshData,
  } = useFetch<MERCHANTS_STORES_BRANCHES_CASHIERS_ITEM>(
    transformUrl(cashiersUrl, filter)
  );

  useEffect(() => {
    if (cashiersUrl == undefined) return;

    changeKey(transformUrl(cashiersUrl, filter));
  }, [cashiersUrl, filter]);

  const { data: weekdayOpeningPeriodData } = useSWR<
    responseSchema<MERCHANTS_STORES_BRANCHES_WEEKDAYOPENINGPERIODS_ITEM>
  >(() => {
    if (branchData == undefined) return;

    return transformUrl(branchData.weekday_opening_periods, {
      use_cache: false,
    });
  });

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  const onDeleteHandler = useCallback((props: any) => {
    const handler = async () => {
      try {
        const self = get(props, "row.original.self");

        await axios.delete(self);

        enqueueSnackbarWithSuccess("Xóa nhân viên thành công");

        refreshData();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        onClose();
      }
    };

    const firstName = get(props, "row.original.first_name");

    const message = `Hãy xác nhận bạn muốn xóa ${firstName}, đây là hành động không thể hoàn tác`;

    onConfirm(handler, {
      message,
    });
  }, []);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        const params = cloneDeep(cloneFilter);

        changeKey(transformUrl(cashiersUrl, params));
      };
    },
    [filter, cashiersUrl]
  );

  useEffect(() => {
    if (branchData == undefined) return;

    convertValueToTupleForAddress(branchData).then((resData) => {
      if (resData) {
        const { province, district, ward } = resData;

        const [, provinceDisplayValue] = province;
        const [, districtDisplayValue] = district;
        const [, wardDisplayValue] = ward;

        if (isMounted()) {
          setData({
            ...branchData,
            province: provinceDisplayValue,
            district: districtDisplayValue,
            ward: wardDisplayValue,
          });
        }
      }
    });
  }, [branchData]);

  const renderWeekdayOpeningPeriod = useMemo(() => {
    if (weekdayOpeningPeriodData == undefined) return null;

    return (
      <OriginalFormControl>
        <FormLabel>Thời gian hoạt động</FormLabel>
        <Box
          sx={{
            backgroundColor: ({ palette }) => {
              return palette.grey[400];
            },
            borderRadius: "0.25rem",
            paddingX: 1,
            paddingY: 2,
            height: "100%",
          }}
        >
          <Box display="grid" gridTemplateColumns={"18% 30% auto"} rowGap={1.5}>
            {weekdayOpeningPeriodData.results.map((el) => {
              const displayWeekday = getDisplayValueFromChoiceItem(weekdays, el.weekday);

              return (
                <Fragment key={el.self}>
                  <Typography
                    variant="body2"
                    sx={{
                      alignSelf: "center",
                    }}
                  >
                    {displayWeekday}:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      alignSelf: "center",
                    }}
                  >
                    {`${el.start} - ${el.end}`}
                  </Typography>

                  <CircleIcon
                    fontSize="small"
                    color={el.is_closed ? "error" : "primary2"}
                  />
                </Fragment>
              );
            })}
          </Box>
        </Box>
      </OriginalFormControl>
    );
  }, [weekdayOpeningPeriodData, weekdays]);

  if (data == undefined || branchData == undefined) return <Loading />;

  const { name, phone_number, email, address, province, district, ward, description } =
    data;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h2" color="primary2.main">
          Thông tin chi nhánh
        </Typography>
      </Grid>

      <Grid item xs={4}>
        <FormControlBase
          InputProps={{
            readOnly: true,
            defaultValue: name,
            placeholder: "Tên Chi Nhánh",
          }}
          FormLabelProps={{
            children: "Tên Chi Nhánh",
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <FormControlForPhoneNumber
          label="Số Điện Thoại"
          placeholder="Số Điện Thoại"
          InputProps={{
            readOnly: true,
          }}
          value={phone_number}
        />
      </Grid>
      <Grid item xs={4}>
        <FormControlBase
          InputProps={{
            readOnly: true,
            defaultValue: email,
            placeholder: "Email",
          }}
          FormLabelProps={{
            children: "Email",
          }}
        />
      </Grid>

      <Grid item xs={3}>
        <FormControlBase
          InputProps={{
            readOnly: true,
            defaultValue: address,
            placeholder: "Địa Chỉ",
          }}
          FormLabelProps={{
            children: "Địa Chỉ",
          }}
        />
      </Grid>

      <Grid item xs={3}>
        <FormControlBase
          InputProps={{
            readOnly: true,
            defaultValue: province,
            placeholder: "Tỉnh/Thành",
          }}
          FormLabelProps={{
            children: "Tỉnh/Thành",
          }}
        />
      </Grid>

      <Grid item xs={3}>
        <FormControlBase
          InputProps={{
            readOnly: true,
            defaultValue: district,
            placeholder: "Quận/Huyện",
          }}
          FormLabelProps={{
            children: "Quận/Huyện",
          }}
        />
      </Grid>

      <Grid item xs={3}>
        <FormControlBase
          InputProps={{
            readOnly: true,
            defaultValue: ward,
            placeholder: "Phường/Xã",
          }}
          FormLabelProps={{
            children: "Phường/Xã",
          }}
        />
      </Grid>

      <Grid item xs={6}>
        {renderWeekdayOpeningPeriod}
      </Grid>

      <Grid item xs={6}>
        <FormControlBase
          InputProps={{
            value: description,
            readOnly: true,
            multiline: true,
            rows: 10,
            sx: {
              padding: 1,
            },
          }}
          FormLabelProps={{ children: "Mô Tả Quán" }}
        />
      </Grid>

      <Grid item xs={12}>
        <OriginalFormControl>
          <FormLabel>Nhân viên chi nhánh</FormLabel>
          <Box ref={ref}>
            <CashierTable
              data={cashiersData ?? []}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
              count={itemCount}
              isLoading={isLoading}
              pagination={pagination}
              onDeleteHandler={onDeleteHandler}
            />
          </Box>
        </OriginalFormControl>
      </Grid>
    </Grid>
  );
};

export default TabDetailBranchInfo;
