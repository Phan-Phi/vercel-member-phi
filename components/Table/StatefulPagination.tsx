import { useMeasure } from "react-use";
import { styled } from "@mui/material";
import React, { useCallback } from "react";

import TableRow from "./TableRow";
import CompoundTable from "./CompoundTable";
import TablePagiantion from "./TablePagination";

type FooterKey = "tableInstance";

type FooterProps = Pick<
  React.ComponentPropsWithoutRef<typeof CompoundTable>,
  FooterKey
> & {
  totalCount: number;
};

const StatefulPagination = (props: FooterProps) => {
  const { totalCount, tableInstance } = props;

  const [ref, { height }] = useMeasure();

  const onChangePageHandler = useCallback(
    (_, newPage) => {
      tableInstance.gotoPage(newPage);
    },
    [tableInstance]
  );

  const handleChangeRowsPerPage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      tableInstance.setPageSize(parseInt(e.target.value));
      tableInstance.gotoPage(0);
    },
    [tableInstance]
  );

  return (
    <TableRow
      sx={{
        height,
        position: "relative",
      }}
    >
      <StyledPagination
        count={totalCount}
        page={tableInstance.state.pageIndex}
        onPageChange={onChangePageHandler}
        rowsPerPage={tableInstance.state.pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ref={ref}
      />
    </TableRow>
  );
};

export default StatefulPagination;

const StyledPagination = styled(TablePagiantion)(({ theme }) => {
  return {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 16,
    backgroundColor: theme.palette.grey["100"],
    borderTop: `1px solid ${theme.palette.grey[300]}`,
  };
});
