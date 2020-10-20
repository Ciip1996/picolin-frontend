// @flow
import React from 'react';
import MUIDataTable, { debounceSearchRender } from 'mui-datatables';
import { MuiThemeProvider } from '@material-ui/core/styles';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import { SearchResultsNotFound } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import SkeletonList from 'UI/components/molecules/SkeletonList';
import { getMuiTheme } from './styles';
import CustomFooter from './Footer/index';

const DataTableEmptyState = props => {
  const { defaultEmptyState, title, subtitle, customEmptyStateIcon } = props;
  return (
    <EmptyPlaceholder
      title={
        defaultEmptyState
          ? 'We couldn’t find what you’re looking for! Maybe you should try again'
          : title
      }
      subtitle={
        defaultEmptyState
          ? 'We couldn’t find what you’re looking for! Maybe you should try again'
          : subtitle
      }
    >
      {defaultEmptyState ? (
        <SearchResultsNotFound width={237.52} height={293.76} />
      ) : (
        <>{customEmptyStateIcon}</>
      )}
    </EmptyPlaceholder>
  );
};

type DataTableProps = {
  isServerSide: boolean,
  columns?: Array<any>,
  data?: Array<any>,
  count?: number,
  page?: number,
  rowsPerPage?: number,
  searchText?: string,
  loading: boolean,
  customToolbarSelect?: any,
  theme: any,
  onRowClick?: (row: any) => void,
  onResetfiltersClick?: () => void,
  onSearchTextChange?: (search: string) => void,
  onColumnSortClick?: (row: any) => void,
  onPerPageClick?: (perPage: number) => void,
  onPageClick?: (page: number) => void,
  defaultEmptyState?: boolean,
  customEmptyStateIcon?: any,
  title?: string,
  subtitle?: string,
  selectableRows?: 'none' | 'multiple',
  onColumnDisplayClick?: (row: any) => void
};

const DataTable = (props: DataTableProps) => {
  const {
    isServerSide,
    columns,
    data,
    count,
    page,
    rowsPerPage,
    searchText,
    loading,
    customToolbarSelect,
    onRowClick,
    onResetfiltersClick,
    onSearchTextChange,
    onColumnSortClick,
    onPerPageClick,
    onPageClick,
    onColumnDisplayClick,
    defaultEmptyState,
    customEmptyStateIcon,
    title,
    subtitle,
    selectableRows,
    theme,
    ...rest
  } = props;

  const options = isServerSide
    ? {
        ...rest,
        filter: true,
        search: true,
        print: false,
        download: false,
        viewColumns: true,
        filterType: 'dropdown',
        responsive: 'scrollFullHeight',
        selectableRows,
        customToolbarSelect: () => customToolbarSelect,
        selectableRowsOnClick: false,
        serverSide: true,
        count,
        page,
        rowsPerPage,
        searchText,
        searchPlaceholder: 'Search for...',
        customSearchRender: debounceSearchRender(400),
        onRowClick: (rowData, rowMeta) => {
          onRowClick && onRowClick(rowMeta);
        },
        onSearchChange: newSearchText => {
          onSearchTextChange && onSearchTextChange(newSearchText);
        },
        onColumnSortChange: (changedColumn, direction) => {
          let order = 'desc';
          if (direction === 'ascending') order = 'asc';
          onColumnSortClick && onColumnSortClick({ orderBy: changedColumn, direction: order });
        },
        onChangeRowsPerPage: newPerPage => {
          onPerPageClick && onPerPageClick(newPerPage);
        },
        onChangePage: newPage => {
          onPageClick && onPageClick(newPage);
        },
        onFilterChange: () => {
          onResetfiltersClick && onResetfiltersClick();
        },
        onColumnViewChange: (changedColumn, action) => {
          let showColumn = false;
          if (action === 'add') showColumn = true;
          onColumnDisplayClick &&
            onColumnDisplayClick({ column: changedColumn, display: showColumn });
        },
        customFooter: (
          newCount,
          newPage,
          newRowsPerPage,
          changeRowsPerPage,
          changePage,
          textLabels
        ) => {
          return (
            <CustomFooter
              count={count}
              page={page}
              rowsPerPage={rowsPerPage}
              changeRowsPerPage={changeRowsPerPage}
              changePage={changePage}
              textLabels={textLabels}
            />
          );
        },
        textLabels: {
          body: {
            toolbar: {
              search: 'search'
            },
            noMatch: (
              <DataTableEmptyState
                defaultEmptyState={defaultEmptyState}
                title={title}
                subtitle={subtitle}
                customEmptyStateIcon={customEmptyStateIcon}
              />
            ),
            toolTip: 'Sort',
            columnHeaderTooltip: column => `Sort for ${column.label}`
          }
        }
      }
    : {
        filter: false,
        search: false,
        print: false,
        download: false,
        viewColumns: true,
        serverSide: false,
        responsive: 'stacked',
        selectableRows: 'none',
        onRowClick: (rowData, rowMeta) => {
          onRowClick && onRowClick(rowMeta);
        }
      };

  return loading ? (
    <SkeletonList />
  ) : (
    <MuiThemeProvider theme={theme}>
      <MUIDataTable data={data} columns={columns} options={options} {...rest} />
    </MuiThemeProvider>
  );
};

DataTable.defaultProps = {
  isServerSide: true,
  columns: [],
  data: [],
  count: 0,
  page: 0,
  searchText: '',
  rowsPerPage: 0,
  onRowClick: undefined,
  onResetfiltersClick: undefined,
  onSearchTextChange: undefined,
  onColumnSortClick: undefined,
  onPerPageClick: undefined,
  onPageClick: undefined,
  loading: false,
  defaultEmptyState: true,
  customEmptyStateIcon: undefined,
  title: '',
  subtitle: '',
  selectableRows: 'multiple',
  customToolbarSelect: undefined,
  onColumnDisplayClick: undefined,
  theme: getMuiTheme()
};

export default DataTable;
