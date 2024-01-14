import {
  Grid,
  Box,
  Stack,
  Button,
  useTheme,
  Container,
  Typography,
  TypographyProps,
} from "@mui/material";
import useSWR from "swr";
import { get } from "lodash";
import { useMountedState } from "react-use";
import { Fragment, useCallback, useEffect, useState } from "react";

import {
  formatDate,
  transformUrl,
  formatPhoneNumber,
  convertValueToTupleForAddress,
  getDisplayValueFromChoiceItem,
} from "libs";
import {
  ADMINS_ITEM,
  GROUPS_ITEM,
  responseSchema,
  ADMINS_ADDRESSES_ITEM,
} from "interfaces";
import { ADMINS } from "apis";
import { PATHNAME } from "routes";
import { BUTTON, CONTENT_GLOBAL } from "constant";
import { useRouter } from "next/router";
import { AdminAddressSchemaProps } from "yups";
import { useChoice, usePermission } from "hooks";
import { BoxWithShadow, Loading } from "components";

export default function DetailSettingUser() {
  const theme = useTheme();
  const router = useRouter();
  const choice = useChoice();
  const isMounted = useMountedState();

  const { genders } = choice;
  const { hasPermission } = usePermission("write_admin");

  const [defaultAddressValues, setDefaultAddressValues] =
    useState<AdminAddressSchemaProps>();

  const { data } = useSWR<ADMINS_ITEM>(
    transformUrl(`${ADMINS}${router.query.id}/`, {
      use_cache: false,
    })
  );

  const { data: groupData } = useSWR<responseSchema<GROUPS_ITEM>>(() => {
    if (data == undefined) return;

    return transformUrl(data.groups, {
      use_cache: false,
    });
  });

  const { data: addressData } = useSWR<responseSchema<ADMINS_ADDRESSES_ITEM>>(() => {
    if (data == undefined) return;

    return transformUrl(data.addresses, {
      use_cache: false,
    });
  });

  const setDefaultAddressValuesHandler = useCallback(
    (data: responseSchema<ADMINS_ADDRESSES_ITEM>) => {
      const addressData = get(data, "results[0]");

      convertValueToTupleForAddress(addressData).then((transformedData) => {
        if (transformedData && isMounted()) {
          setDefaultAddressValues({ ...addressData, ...transformedData });
        }
      });
    },
    []
  );

  const onGoToHandler = useCallback(() => {
    router.push(`${PATHNAME.CAP_NHAT}/${router.query.id}`);
  }, []);

  useEffect(() => {
    if (addressData == undefined) return;

    setDefaultAddressValuesHandler(addressData);
  }, [addressData]);

  if (data == undefined || groupData == undefined) {
    return <Loading />;
  }

  const { birthday, email, first_name, is_active, last_name, phone_number, gender } =
    data;

  const position = get(groupData, "results[0].name");
  const ward = get(defaultAddressValues, "ward[1]");
  const district = get(defaultAddressValues, "district[1]");
  const province = get(defaultAddressValues, "province[1]");

  return (
    <Container>
      <Stack spacing={3}>
        <BoxWithShadow>
          <Grid container>
            <Grid item xs={4}>
              <Box borderRight="1px solid grey">
                <Typography
                  variant="h2"
                  sx={{
                    color: theme.palette.primary2.main,
                    marginBottom: "0.6rem",
                  }}
                >
                  {CONTENT_GLOBAL.ABOUT}
                </Typography>

                <Box display="grid" gridTemplateColumns={"30% 70%"} rowGap={1.5}>
                  <Item label="Họ:" value={last_name} />
                  <Item label="Tên:" value={first_name} />
                  <Item
                    label="Ngày sinh:"
                    value={birthday ? formatDate(birthday, "dd/MM/yyyy") : "-"}
                  />
                  <Item
                    label="Giới tính:"
                    value={getDisplayValueFromChoiceItem(genders, gender) || "-"}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box borderRight="1px solid grey">
                <Typography
                  variant="h2"
                  sx={{
                    color: theme.palette.primary2.main,
                    marginBottom: "0.6rem",
                  }}
                >
                  Thông Tin Liên Lạc
                </Typography>

                <Box display="grid" gridTemplateColumns={"30% 70%"} rowGap={1.5}>
                  <Item
                    label="Địa chỉ:"
                    value={get(defaultAddressValues, "line") || "-"}
                  />
                  <Item label="Tỉnh/Thành:" value={province} />
                  <Item label="Quận/Huyện:" value={district} />
                  <Item label="Phường/Xã:" value={ward} />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    color: theme.palette.primary2.main,
                    marginBottom: "0.6rem",
                  }}
                >
                  Thông Tin Tài Khoản
                </Typography>

                <Box display="grid" gridTemplateColumns={"35% 65%"} rowGap={1.5}>
                  <Item label="Số Điện Thoại:" value={formatPhoneNumber(phone_number)} />
                  <Item label="Email:" value={email} />
                  <Item
                    label="Trạng thái:"
                    value={is_active ? "Kích hoạt" : "Chưa kích hoạt"}
                    ValueProps={{
                      sx: {
                        color: ({ palette }) => {
                          return is_active
                            ? palette.secondary.main
                            : palette.primary.main;
                        },
                      },
                    }}
                  />
                  <Item label="Vị trí:" value={position} />
                </Box>
              </Box>
            </Grid>

            {hasPermission && (
              <Grid item xs={12}>
                <Stack display="flex" flexDirection="row" justifyContent="flex-end">
                  <Button onClick={onGoToHandler}>{BUTTON.EDIT}</Button>
                </Stack>
              </Grid>
            )}
          </Grid>
        </BoxWithShadow>

        <Stack alignItems="center">
          <Button
            variant="outlined"
            onClick={() => {
              router.push(`/${PATHNAME.CAI_DAT}/${PATHNAME.NGUOI_DUNG}`);
            }}
          >
            {BUTTON.BACK}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}

interface ItemProps {
  label: string;
  value: string | number | boolean;
  LabelProps?: TypographyProps;
  ValueProps?: TypographyProps;
}

const Item = ({ label, value, LabelProps, ValueProps }: ItemProps) => {
  return (
    <Fragment>
      <Typography variant="body2" fontWeight="700" {...LabelProps}>
        {label}
      </Typography>
      <Typography variant="body2" {...ValueProps}>
        {value}
      </Typography>
    </Fragment>
  );
};
