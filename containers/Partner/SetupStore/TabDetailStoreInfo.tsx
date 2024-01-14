import React from "react";
import { useRouter } from "next/router";

import {
  Grid,
  Avatar,
  Typography,
  FormControl as OriginalFormControl,
} from "@mui/material";
import useSWR from "swr";

import {
  Image,
  Switch,
  Loading,
  FormLabel,
  BoxWithShadow,
  FormControlBase,
} from "components";

import { MERCHANTS_STORES } from "apis";
import { MERCHANTS_STORES_ITEM } from "interfaces";

const DetailStore = () => {
  const router = useRouter();

  const { data } = useSWR<MERCHANTS_STORES_ITEM>(`${MERCHANTS_STORES}${router.query.id}`);

  if (data == undefined) {
    return <Loading />;
  }

  const {
    name,
    slug,
    is_active,
    is_published,
    facebook_link,
    instagram_link,
    logo,
    banner,
  } = data;

  return (
    <BoxWithShadow>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2" color="primary2.main">
            Thông tin quán
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <FormControlBase
            InputProps={{
              readOnly: true,
              defaultValue: name,
              placeholder: "Tên Quán",
            }}
            FormLabelProps={{
              children: "Tên Quán",
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlBase
            InputProps={{
              readOnly: true,
              defaultValue: slug,
              placeholder: "Tên Đăng Nhập",
            }}
            FormLabelProps={{
              children: "Tên Đăng Nhập",
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Switch
            label="Trạng thái"
            SwitchProps={{
              sx: {
                pointerEvents: "none",
              },
              defaultChecked: is_active,
            }}
          />
        </Grid>

        <Grid item xs={4}>
          <FormControlBase
            InputProps={{
              readOnly: true,
              defaultValue: facebook_link,
              placeholder: "Link Facebook",
            }}
            FormLabelProps={{
              children: "Link Facebook",
            }}
          />
        </Grid>

        <Grid item xs={4}>
          <FormControlBase
            InputProps={{
              readOnly: true,
              defaultValue: instagram_link,
              placeholder: "Link Instagram",
            }}
            FormLabelProps={{
              children: "Link Instagram",
            }}
          />
        </Grid>

        <Grid item xs={4}>
          <Switch
            label="Hiển thị"
            SwitchProps={{
              sx: {
                pointerEvents: "none",
              },
              defaultChecked: is_published,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <OriginalFormControl>
            <FormLabel>Logo</FormLabel>

            {logo ? (
              <Image src={logo} width={100} height={100} alt="" />
            ) : (
              <Avatar variant="rounded" sx={{ width: 100, height: 100 }} />
            )}
          </OriginalFormControl>
        </Grid>
        <Grid item xs={6}>
          <OriginalFormControl>
            <FormLabel>Banner</FormLabel>

            {banner ? (
              <Image src={banner} width={355} height={200} alt="" />
            ) : (
              <Avatar variant="rounded" sx={{ width: 100, height: 100 }} />
            )}
          </OriginalFormControl>
        </Grid>
      </Grid>
    </BoxWithShadow>
  );
};

export default DetailStore;
