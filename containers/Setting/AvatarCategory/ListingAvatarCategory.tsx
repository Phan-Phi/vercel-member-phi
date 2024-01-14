import { Box, Stack } from "@mui/material";
import { cloneDeep, get, set } from "lodash";
import { useCallback, useMemo, useState } from "react";

import {
  useFetch,
  usePermission,
  useConfirmation,
  useNotification,
  useGetHeightForTable,
} from "hooks";
import { Sticky } from "hocs";
import axios from "axios.config";
import { PATHNAME } from "routes";
import { SAFE_OFFSET } from "constant";
import queryString from "query-string";
import { useRouter } from "next/router";
import { AVATARS_CATEGORIES } from "apis";
import { setFilterValue, transformUrl } from "libs";
import IconButton from "components/Button/IconButton";
import ListingAvatarTable from "./ListingAvatarTable";
import { Container, SearchField, WrapperTable } from "components";
import { ADMINS_ITEM, AVATARS_CATEGORIES_ITEM } from "interfaces";

export type PartnerFilterType = {
  limit: number;
  with_count: boolean;
  offset: number;
  search?: string;
  // date_joined_start: Date | null;
  // date_joined_end: Date | null;
  // activated_by_person: ADMINS_ITEM | null;
  is_active: string;
};

const defaultFilterValue: PartnerFilterType = {
  limit: 25,
  with_count: true,
  offset: 0,
  search: "",
  // date_joined_start: null,
  // date_joined_end: null,
  // activated_by_person: null,
  is_active: "",
};

export default function ListingAvatar() {
  const router = useRouter();
  const [ref, { height }] = useGetHeightForTable();
  const { hasPermission } = usePermission("write_avatar_category");
  const { onConfirm, onClose } = useConfirmation();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<AVATARS_CATEGORIES_ITEM>(transformUrl(AVATARS_CATEGORIES, filter));

  const onGotoHandler = useCallback(() => {
    router.push(`${router.pathname}/${PATHNAME.TAO_MOI}`);
  }, [router]);

  const onViewHandler = useCallback((props: any) => {
    const { row } = props;

    const self = get(row, "original.self");

    const id = self
      .split("/")
      .filter((el: string) => {
        return el !== "";
      })
      .pop();

    const { url } = queryString.parseUrl(router.asPath);

    window.open(`${url}/${id}`, "_blank");
  }, []);

  const onDeleteHandler = useCallback((props: any) => {
    const handler = async () => {
      try {
        const self = get(props, "row.original.self");

        await axios.delete(self);

        enqueueSnackbarWithSuccess("Xóa ảnh đại diện thành công");

        refreshData();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        onClose();
      }
    };

    const avatarName = get(props, "row.values.name");
    const message = `Hãy xác nhận bạn muốn xóa ${avatarName}, đây là hành động không thể hoàn tác`;

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

        changeKey(transformUrl(AVATARS_CATEGORIES, cloneFilter));
      };
    },
    [filter]
  );

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  return (
    <Container>
      <Box>
        <Sticky>
          <Stack spacing={3}>
            <Stack
              columnGap={3}
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <Stack flexGrow={1}>
                <SearchField
                  onChange={onFilterChangeHandler("search")}
                  initSearch={filter.search}
                />
              </Stack>

              {hasPermission && <IconButton onClick={onGotoHandler} />}
            </Stack>

            <WrapperTable>
              <Box ref={ref}>
                <ListingAvatarTable
                  data={data ?? []}
                  count={itemCount}
                  isLoading={isLoading}
                  pagination={pagination}
                  onPageChange={onFilterChangeHandler("page")}
                  onPageSizeChange={onFilterChangeHandler("pageSize")}
                  maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
                  onViewHandler={onViewHandler}
                  onDeleteHandler={onDeleteHandler}
                />
              </Box>
            </WrapperTable>
          </Stack>
        </Sticky>
      </Box>
    </Container>
  );
}
