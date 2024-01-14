import { useToggle } from "react-use";
import { Range } from "react-date-range";
import React, { useCallback, useMemo, useState } from "react";

import axios from "axios.config";
import { cloneDeep, get, omit } from "lodash";
import { Grid, Stack, Dialog, DialogContent, Box } from "@mui/material";

import AvatarTable from "./AvatarTable";
import FilterAvatar from "./FilterAvatar";
import SearchField from "components/Filter/SearchField";
import { Image, Container, WrapperTable } from "components";

import { Sticky } from "hocs";
import { PATHNAME } from "routes";
import { PENDING_IMAGES } from "apis";
import { SAFE_OFFSET } from "constant";
import { PENDING_IMAGES_ITEM } from "interfaces";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { useConfirmation, useFetch, useGetHeightForTable, useNotification } from "hooks";

export type ListingAvatarFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  search?: string;
  is_confirmed: string;
  signature: string;
  range: Range;
};

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
  is_confirmed: "",
  signature: "",
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
};

const ListingAvatar = () => {
  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const [open, toggle] = useToggle(false);

  const [selectedImage, setSelectedImage] = useState<string>();

  const { onConfirm, onClose } = useConfirmation();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const { data, itemCount, isLoading, changeKey, refreshData } =
    useFetch<PENDING_IMAGES_ITEM>(transformUrl(PENDING_IMAGES, omit(filter, "range")));

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range") return;

        const dateStart = transformDate(filter.range.startDate, "date_start");
        const dateEnd = transformDate(filter.range.endDate, "date_end");

        changeKey(
          transformUrl(PENDING_IMAGES, {
            ...omit(cloneFilter, "range"),
            date_created_start: filter.range.startDate ? dateStart : undefined,
            date_created_end: filter.range.endDate ? dateEnd : undefined,
          })
        );
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    let dateStart: any = get(filter, "range.startDate");
    let dateEnd: any = get(filter, "range.endDate");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    changeKey(
      transformUrl(PENDING_IMAGES, {
        ...omit(cloneFilter, "range"),
        date_created_start: dateStart,
        date_created_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(PENDING_IMAGES, omit(defaultFilterValue, "range")));
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  const onViewHandler = useCallback((props: any) => {
    return () => {
      const { row } = props;

      setSelectedImage(row.original.original);

      toggle(true);
    };
  }, []);

  const onGotoHandler = useCallback((props: any) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault();

      const { row } = props;

      const self = get(row, "original.owner");

      const id = self
        .split("/")
        .filter((el: string) => {
          return el !== "";
        })
        .pop();

      window.open(`/${PATHNAME.DOI_TAC}/${PATHNAME.TAI_KHOAN}/${id}`, "_blank");
    };
  }, []);

  const onApproveHandler = useCallback((props: any) => {
    return async () => {
      const handler = async () => {
        try {
          const { row } = props;
          const self = row.original.self;

          await axios.patch(self, {
            is_confirmed: true,
          });

          enqueueSnackbarWithSuccess("Duyệt ảnh thành công");
          onClose();
          refreshData();
        } catch (err) {
          enqueueSnackbarWithError(err);
        }
      };

      onConfirm(handler, {
        message: "Xác nhận duyệt hình ảnh này",
        variant: "info",
      });
    };
  }, []);

  const onToggleHandler = useCallback((value: boolean) => {
    return () => {
      toggle(value);
    };
  }, []);

  return (
    <Container>
      <Grid container>
        <Grid item xs={3}>
          <FilterAvatar
            filter={filter}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onSelectStatus={onFilterChangeHandler("is_confirmed")}
            onSelectImage={onFilterChangeHandler("signature")}
            onDateRangeChange={onFilterChangeHandler("range")}
          />
        </Grid>
        <Grid item xs={9}>
          <Sticky>
            <Stack spacing={3}>
              <SearchField
                initSearch={filter.search}
                onChange={onFilterChangeHandler("search")}
              />

              <WrapperTable>
                <Box ref={ref}>
                  <AvatarTable
                    data={data ?? []}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
                    count={itemCount}
                    isLoading={isLoading}
                    pagination={pagination}
                    onViewHandler={onViewHandler}
                    onApproveHandler={onApproveHandler}
                    onGotoHandler={onGotoHandler}
                  />
                </Box>
              </WrapperTable>

              <Dialog open={open} onClose={onToggleHandler(false)}>
                <DialogContent
                  sx={{
                    padding: 0,
                    overflow: "hidden",
                  }}
                >
                  {selectedImage && open && (
                    <Image
                      src={selectedImage}
                      width="450px"
                      height="450px"
                      objectFit="contain"
                      alt=""
                    />
                  )}
                </DialogContent>
              </Dialog>
            </Stack>
          </Sticky>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ListingAvatar;
