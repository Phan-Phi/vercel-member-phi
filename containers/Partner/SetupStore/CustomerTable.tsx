import { CellProps, useSortBy, useTable } from "react-table";
import React, { Fragment, PropsWithChildren, useMemo } from "react";

import { get } from "lodash";
import { Box } from "@mui/material";

import { usePermission } from "hooks";
import { formatDate, transformUrl } from "libs";

import {
  Link,
  Table,
  TableHead,
  TableBody,
  RenderBody,
  NumberFormat,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
  TableCellWithFetch,
} from "components";

import {
  CUSTOMERS_ITEM,
  responseSchema,
  CommonTableProps,
  MERCHANTS_STORES_ITEM,
  MERCHANTS_STORES_MEMBERSHIPS_ITEM,
  MERCHANTS_STORES_RANKBANDS_ITEM,
} from "interfaces";

type CustomerTableProps = CommonTableProps<CUSTOMERS_ITEM> & Record<string, any>;

export default function CustomerTable(props: CustomerTableProps) {
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
        Header: "Tên Khách Hàng",
        accessor: "fullName",
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_ITEM, any>>) => {
          const { row, column, onGotoHandler } = props;

          const { hasPermission } = usePermission("read_customer");

          const firstName = get(row, "original.first_name");
          const lastName = get(row, "original.last_name");

          const fullName = `${lastName} ${firstName}`;

          return (
            <WrapperTableCell title={fullName}>
              {hasPermission ? (
                <Link href="#" onClick={onGotoHandler?.({ row, column })}>
                  {fullName}
                </Link>
              ) : (
                fullName
              )}
            </WrapperTableCell>
          );
        },
        colSpan: 3,
      },
      {
        Header: "Hạng",
        accessor: "rank",

        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_ITEM, any>>) => {
          const { row } = props;

          const membership = get(row, "original.memberships");
          const selfOfStore = props.storeData.self;

          return (
            <TableCellWithFetch<responseSchema<MERCHANTS_STORES_MEMBERSHIPS_ITEM>>
              url={transformUrl(membership, {
                store: selfOfStore,
              })}
            >
              {(data) => {
                const rankbandData: MERCHANTS_STORES_RANKBANDS_ITEM[] =
                  props.rankbandData;

                const pointEarn = data.results?.[0]?.point_earn;

                if (pointEarn >= 0) {
                  let name = "";

                  rankbandData.forEach((el, index) => {
                    if (pointEarn >= el.band_amount) {
                      if (index >= 0) {
                        name = get(el, "name");
                      }
                    }
                  });

                  // for (let el of rankbandData) {
                  //   if (pointEarn < el.band_amount) {
                  //     name = get(el, "name");
                  //     break;
                  //   }
                  //   name = get(el, "name");
                  // }

                  return <WrapperTableCell title={name}>{name}</WrapperTableCell>;
                } else {
                  return <Fragment></Fragment>;
                }
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: "Điểm Tích Lũy",
        accessor: "point_earn",
        textAlign: "right",

        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_ITEM, any>>) => {
          const { row } = props;

          const membership = get(row, "original.memberships");
          const selfOfStore = props.storeData.self;

          return (
            <TableCellWithFetch<responseSchema<MERCHANTS_STORES_MEMBERSHIPS_ITEM>>
              url={transformUrl(membership, {
                store: selfOfStore,
              })}
            >
              {(data) => {
                const pointEarn = data.results?.[0]?.point_earn;

                if (pointEarn >= 0) {
                  return (
                    <WrapperTableCell title={pointEarn.toString()} display="flex">
                      <NumberFormat value={pointEarn} />
                    </WrapperTableCell>
                  );
                } else {
                  return <Fragment></Fragment>;
                }
              }}
            </TableCellWithFetch>
          );
        },
      },

      {
        Header: "Số đơn hàng",
        accessor: "orders",
        textAlign: "right",

        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_ITEM, any>>) => {
          const { cell } = props;

          const storeData: MERCHANTS_STORES_ITEM = props.storeData;

          const value = cell.value;

          return (
            <TableCellWithFetch<responseSchema<any>>
              url={transformUrl(value, {
                with_count: true,
                limit: 1,
                store: storeData.self,
              })}
            >
              {(data) => {
                const count = data.count || 0;

                return (
                  <WrapperTableCell title={count} display="flex">
                    <NumberFormat value={count} />
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
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_ITEM, any>>) => {
          const { row } = props;

          const membershipUrl = get(row, "original.memberships");

          return (
            <TableCellWithFetch<MERCHANTS_STORES_MEMBERSHIPS_ITEM> url={membershipUrl}>
              {(data) => {
                const dateJoined = get(data, "results[0].date_joined");

                return (
                  <WrapperTableCell title={formatDate(dateJoined)}>
                    {formatDate(dateJoined)}
                  </WrapperTableCell>
                );
              }}
            </TableCellWithFetch>
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
    useSortBy
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
}
