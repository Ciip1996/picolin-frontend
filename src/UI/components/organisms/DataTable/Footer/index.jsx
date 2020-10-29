// @flow
import React from 'react';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import MuiTablePagination from '@material-ui/core/TablePagination';

/** Styles components */
import { footerStyle, resultStyle } from './styles';

type CustomFooterProps = {
  count?: number,
  page?: number,
  rowsPerPage?: number,
  textLabels?: any,
  changeRowsPerPage?: (perPage: number) => void,
  changePage?: (page: number) => void
};

const CustomFooter = (props: CustomFooterProps) => {
  const { count, textLabels, rowsPerPage, page, changeRowsPerPage, changePage } = props;

  const handleRowChange = event => {
    changeRowsPerPage && changeRowsPerPage(event.target.value);
  };

  const handlePageChange = (_, newPage) => {
    changePage && changePage(newPage);
  };

  return (
    <TableFooter>
      <TableRow>
        <TableCell style={footerStyle} colSpan={1000}>
          <p style={resultStyle}>
            Resultados Totales: <strong>{count}</strong>
          </p>
          <MuiTablePagination
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage="Items por página:"
            labelDisplayedRows={({ from, to }) =>
              `Resultados: ${from}-${to} ${'of'} ${Number(count)}`
            }
            backIconButtonProps={{
              'aria-label': textLabels && textLabels.previous
            }}
            nextIconButtonProps={{
              'aria-label': textLabels && textLabels.next
            }}
            rowsPerPageOptions={[10, 20, 100]}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowChange}
          />
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

CustomFooter.defaultProps = {
  count: 0,
  page: 0,
  rowsPerPage: 10,
  textLabels: undefined,
  changeRowsPerPage: undefined,
  changePage: undefined
};

export default CustomFooter;
