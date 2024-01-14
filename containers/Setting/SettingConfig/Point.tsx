import {
  Box,
  Grid,
  Stack,
  Button,
  Divider,
  Typography,
  TypographyProps,
  styled,
} from "@mui/material";
import useSWR from "swr";
import get from "lodash/get";
import { Fragment, useMemo, isValidElement, useCallback } from "react";

import { RANKS } from "apis";
import { BUTTON } from "constant";
import { transformUrl } from "libs";
import { useRouter } from "next/router";
import { usePermission, useSetting } from "hooks";
import { BoxWithShadow, Image } from "components";
import { RANKS_ITEM, responseSchema } from "interfaces";

const Point = () => {
  const router = useRouter();
  const setting = useSetting();
  const { hasPermission } = usePermission("write_setting_point_earn");

  const { data: resRankData } = useSWR<responseSchema<RANKS_ITEM>>(
    transformUrl(RANKS, {
      use_cache: false,
    })
  );

  const {
    introduce_people_point,
    introduced_people_point,
    wallet_point_low_threshold,
    transaction_fee_rate,
    transaction_fee_rate_for_first_store_of_customer,
    non_membership_gift_rate,
    email_notification_wallet_point_low_threshold,
  } = setting;

  const onGoBackHandler = useCallback(() => {
    router.push(`${router.pathname}/tich-diem-cap-nhat`);
  }, []);

  const renderRankList = useMemo(() => {
    if (resRankData == undefined) {
      return null;
    }

    const rankData = get(resRankData, "results");

    const headerList = [
      "Tên Hạng",
      "Mức Ưu Đãi Tối Thiểu",
      "Mức Ưu Đãi Tối Đa",
      "Điểm tối thiểu để lên hạng",
      "Điểm tối đa tích lũy cho hạng",
      "Ảnh hạng",
    ];

    const transformedRankData = headerList.map((el, idx) => {
      if (idx === 0) {
        return [el, ...rankData.map((el) => el.name)];
      }

      if (idx === 1) {
        return [el, ...rankData.map((el) => `${(el.gift_rate_min * 100).toFixed()} %`)];
      }

      if (idx === 2) {
        return [el, ...rankData.map((el) => `${(el.gift_rate_max * 100).toFixed()} %`)];
      }

      if (idx === 3) {
        return [el, ...rankData.map((el) => el.band_amount_min || "0")];
      }
      if (idx === 4) {
        return [el, ...rankData.map((el) => el.band_amount_max || "0")];
      }

      if (idx === 5) {
        return [
          el,
          ...rankData.map((el, idx) => (
            <Image
              key={idx}
              src={el.image}
              width={60}
              height={60}
              alt="Rank Icon"
              objectFit="contain"
            />
          )),
        ];
      }
    }) as any[][];

    return (
      <BoxWithShadow>
        <Stack spacing={2.5} divider={<Divider />}>
          {transformedRankData.map((subData, outerIdx) => {
            return (
              <Box
                columnGap={3}
                display="grid"
                key={outerIdx}
                gridTemplateColumns={`repeat(${subData.length}, 1fr)`}
              >
                {subData.map((el, idx) => {
                  if (isValidElement(el)) {
                    return <Box key={idx}>{el}</Box>;
                  } else {
                    return (
                      <Typography
                        fontWeight={outerIdx === 0 ? 500 : idx === 0 ? 500 : undefined}
                        variant="body2"
                        key={idx}
                      >
                        {el}
                      </Typography>
                    );
                  }
                })}
              </Box>
            );
          })}
        </Stack>
      </BoxWithShadow>
    );
  }, [resRankData]);

  return (
    <Stack spacing={3}>
      {renderRankList}

      <BoxWithShadow>
        <Grid container>
          <Grid item xs={4}>
            <Box borderRight="1px solid grey">
              <Title variant="h2">Điểm Thưởng</Title>

              <Box display="grid" gridTemplateColumns={"50% 50%"} rowGap={1.5}>
                <Item
                  label="Khi tạo tài khoản mới:"
                  value={`${introduced_people_point} điểm`}
                />
                <Item
                  label="Khi giới thiệu tài khoản:"
                  value={`${introduce_people_point} điểm`}
                />
                <Item
                  label="Khi chưa là thành viên:"
                  value={`${non_membership_gift_rate * 100} %`}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box borderRight="1px solid grey">
              <Title variant="h2">Điểm Thấp</Title>

              <Box display="grid" gridTemplateColumns={"50% 50%"} rowGap={1.5}>
                <Item label="Mức điểm:" value={`${wallet_point_low_threshold} điểm`} />
                <Item
                  label="Email Nhận Thông Báo:"
                  value={email_notification_wallet_point_low_threshold}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box sx={{ paddingRight: "24px", height: "100%" }}>
              <Title variant="h2">Phí</Title>

              <Box display="grid" gridTemplateColumns={"50% 50%"} rowGap={1.5}>
                <Item label="Phí dịch vụ:" value={`${transaction_fee_rate * 100} %`} />
                <Item
                  label="Phí dịch vụ ưu đãi:"
                  value={`${transaction_fee_rate_for_first_store_of_customer * 100} %`}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </BoxWithShadow>

      {hasPermission && (
        <Stack display="flex" flexDirection="row" justifyContent="flex-end">
          <Button sx={{ whiteSpace: "nowrap" }} onClick={onGoBackHandler}>
            {BUTTON.UPDATE}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default Point;

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

const Title = styled(Typography)(({ theme }) => {
  return {
    color: theme.palette.primary2.main,
    marginBottom: "0.6rem",
  };
});
