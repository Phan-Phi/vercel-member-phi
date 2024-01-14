import React, { useCallback, useMemo } from "react";

import {
  Control,
  useFieldArray,
  UseFormSetError,
  UseFormClearErrors,
  Controller,
} from "react-hook-form";

import { Button, Grid, Typography, styled, Box, Stack } from "@mui/material";

import {
  BoxWithShadow,
  FormControl,
  FormControlForNumber,
  FormControlForNumberV2,
  FormControlForUpload,
} from "components";

import { RankSchemaProps } from "yups";
import { BUTTON } from "constant";

interface RankFormProps<T extends RankSchemaProps = RankSchemaProps> {
  control: Control<T>;
  setError: UseFormSetError<T>;
  clearErrors: UseFormClearErrors<T>;
}

const headerList = [
  "Tên Hạng",
  "Mức Ưu Đãi Tối Thiểu",
  "Mức Ưu Đãi Tối Đa",
  "Điểm tối thiểu lên hạng",
  "Điểm tối đa cho hạng",
  "Ảnh hạng",
];

const defaultRankData = {
  band_amount_min: "0",
  band_amount_max: "0",
  gift_rate_min: "0",
  gift_rate_max: "0",
  image: [],
  name: "",
};

const RankForm = (props: RankFormProps) => {
  const { control, setError, clearErrors } = props;

  const { fields, remove, append } = useFieldArray({
    control,
    keyName: "formId",
    name: "ranks",
  });

  const onAddHandler = useCallback(() => {
    append(defaultRankData);
  }, []);

  const renderTableHeader = useMemo(() => {
    return headerList.map((item, idx) => {
      let xs = 2;

      if (idx === 0 || idx === 5) {
        xs = 1.5;
      }

      return (
        <Grid key={idx} item xs={xs}>
          <Typography variant="body2" fontWeight={700}>
            {item}
          </Typography>
        </Grid>
      );
    });
  }, []);

  return (
    <BoxWithShadow>
      <Grid container>{renderTableHeader}</Grid>

      {fields.map((el, idx, arr) => {
        const idxElement = idx + 1;

        return (
          <Grid
            container
            key={el.formId}
            sx={{ paddingTop: "0.5rem", alignItems: "center" }}
          >
            <Grid item xs={1.5}>
              <FormControl control={control} name={`ranks.${idx}.name`} />
            </Grid>

            <Grid item xs={2}>
              <Controller
                control={control}
                name={`ranks.${idx}.gift_rate_min`}
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      labelEndAdornment="%"
                      placeholder="Nhập số lượt..."
                      controlState={props}
                      NumberFormatProps={{
                        thousandSeparator: false,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={2}>
              <Controller
                control={control}
                name={`ranks.${idx}.gift_rate_max`}
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      labelEndAdornment="%"
                      placeholder="Nhập số lượt..."
                      controlState={props}
                      NumberFormatProps={{
                        thousandSeparator: false,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={2}>
              <Controller
                control={control}
                name={`ranks.${idx}.band_amount_min`}
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      labelEndAdornment="điểm"
                      placeholder="Nhập số lượt..."
                      controlState={props}
                      NumberFormatProps={{
                        thousandSeparator: false,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={2}>
              <Controller
                control={control}
                name={`ranks.${idx}.band_amount_max`}
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      labelEndAdornment="điểm"
                      placeholder="Nhập số lượt..."
                      controlState={props}
                      NumberFormatProps={{
                        thousandSeparator: false,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={1.5}>
              <Box
                sx={{
                  "& .MuiBox-root": {
                    height: "60px !important",
                    width: "60px !important",
                  },
                  "& img": {
                    objectFit: "contain !important",
                  },
                }}
              >
                <FormControlForUpload
                  control={control}
                  setError={setError}
                  clearErrors={clearErrors}
                  name={`ranks.${idx}.image`}
                />
              </Box>
            </Grid>

            <Grid item xs={1}>
              <Button
                color="error"
                fullWidth={true}
                onClick={() => remove(idx)}
                disabled={arr.length !== idxElement ? true : false}
              >
                {BUTTON.DELETE}
              </Button>
            </Grid>
          </Grid>
        );
      })}

      <Stack>
        <Button
          sx={{
            alignSelf: "flex-end",
          }}
          onClick={onAddHandler}
        >
          {BUTTON.ADD}
        </Button>
      </Stack>
    </BoxWithShadow>
  );
};

export default RankForm;
