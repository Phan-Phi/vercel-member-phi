import { useSticky } from "react-table-sticky";
import { CellProps, useSortBy, useTable } from "react-table";
import React, { Fragment, PropsWithChildren, useMemo } from "react";

import { get } from "lodash";
import axios from "axios.config";
import { Box } from "@mui/material";

import { usePermission } from "hooks";
import { formatDate, transformUrl } from "libs";
import {
  RANKS_ITEM,
  responseSchema,
  CommonTableProps,
  MERCHANTS_STORES_ITEM,
  MERCHANTS_STORES_RANKBANDS_ITEM,
  MERCHANTS_STORES_MEMBERSHIPS_ITEM,
  MERCHANTS_STORES_BRANCHES_ORDERS_ITEM,
} from "interfaces";

import {
  Link,
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  NumberFormat,
  TableContainer,
  TablePagination,
  WrapperTableCell,
  TableCellWithFetch,
} from "components";

type MembershipTableProps = CommonTableProps<MERCHANTS_STORES_MEMBERSHIPS_ITEM> &
  Record<string, any>;

const MembershipTable = (props: MembershipTableProps) => {
  const {
    data,
    count,
    onPageChange,
    onPageSizeChange,
    pagination,
    maxHeight,
    isLoading,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        Header: "Tên Quán",
        accessor: "store",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_MEMBERSHIPS_ITEM, any>>
        ) => {
          const { cell, onGotoHandler, row, column } = props;

          const { hasPermission } = usePermission("read_merchant");

          const value = cell.value;

          if (!hasPermission) return <WrapperTableCell>-</WrapperTableCell>;

          return (
            <TableCellWithFetch<MERCHANTS_STORES_ITEM> url={value}>
              {(data) => {
                const { name } = data;

                return (
                  <WrapperTableCell title={`${name}`}>
                    <Link href="#" onClick={onGotoHandler?.({ row, column })}>
                      {name}
                    </Link>
                  </WrapperTableCell>
                );
              }}
            </TableCellWithFetch>
          );
        },
        colSpan: 3,
      },
      {
        Header: "Hạng",
        accessor: "rank",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_MEMBERSHIPS_ITEM, any>>
        ) => {
          const { row } = props;

          const rankData: RANKS_ITEM[] = props.rankData;

          const pointEarn = get(row, "original.point_earn");
          const storeUrl = get(row, "original.store");

          return (
            <TableCellWithFetch<MERCHANTS_STORES_ITEM> url={storeUrl}>
              {(data) => {
                const { rank_bands } = data;

                return (
                  <TableCellWithFetch<responseSchema<MERCHANTS_STORES_RANKBANDS_ITEM>>
                    url={rank_bands}
                  >
                    {(data) => {
                      const rankbandData = data.results;

                      let name = "";
                      if (pointEarn >= 0) {
                        rankbandData.forEach((el, index) => {
                          if (pointEarn >= el.band_amount) {
                            if (index >= 0) {
                              const item = rankData[index];

                              name = item["name"];
                            }
                          }
                        });
                      }

                      // let name = "";

                      // const index = rankbandData.findIndex((el, idx, arr) => {
                      //   if (idx === arr.length - 1 && pointEarn >= el.band_amount) {
                      //     return true;
                      //   }
                      //   return pointEarn < el.band_amount;
                      // });

                      // if (index >= 0) {
                      //   const item = rankData[index];

                      //   name = item["name"];
                      // }

                      return (
                        <WrapperTableCell title={`${name}`}>{name}</WrapperTableCell>
                      );
                    }}
                  </TableCellWithFetch>
                );
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: "Điểm Tích Lũy",
        accessor: "point_earn",

        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_MEMBERSHIPS_ITEM, any>>
        ) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <WrapperTableCell title={value}>
              <NumberFormat value={value} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Số Đơn Hàng",
        accessor: "order",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_MEMBERSHIPS_ITEM, any>>
        ) => {
          const { row, orderUrl } = props;

          const store = get(row, "original.store");

          return (
            <TableCellWithFetch<responseSchema<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM>>
              url={transformUrl(orderUrl, {
                store: store.replace(axios.defaults.baseURL, ""),
                limit: 1,
                with_count: true,
              })}
            >
              {(data) => {
                if (data.count == undefined) {
                  return <Fragment></Fragment>;
                }

                return (
                  <WrapperTableCell title={data.count}>
                    <NumberFormat value={data.count} />
                  </WrapperTableCell>
                );
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: "Thành Viên Từ",
        accessor: "date_joined",

        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_MEMBERSHIPS_ITEM, any>>
        ) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <WrapperTableCell title={formatDate(value)}>
              {formatDate(value)}
            </WrapperTableCell>
          );
        },
      },
    ];
  }, []);

  const table = useTable(
    {
      columns: columns as any,
      data,
      manualPagination: true,
      autoResetPage: false,
      ...restProps,
    },
    useSortBy,
    useSticky
  );

  return (
    <Box>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader table={table} />
          </TableHead>
          <TableBody>
            <RenderBody loading={isLoading} table={table} />
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end">
        <TablePagination
          count={count}
          page={pagination.pageIndex}
          rowsPerPage={pagination.pageSize}
          onPageChange={(_, page) => onPageChange(page)}
          onRowsPerPageChange={onPageSizeChange}
          rowsPerPageOptions={[25, 50, 75, 100]}
        />
      </Box>
    </Box>
  );
};

export default MembershipTable;
