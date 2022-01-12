// @flow
import React from 'react';
import MUIDataTable, { debounceSearchRender } from 'mui-datatables';
import { MuiThemeProvider } from '@material-ui/core/styles';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import { SearchResultsNotFound } from 'UI/res';
import SkeletonList from 'UI/components/molecules/SkeletonList';
import { getMuiTheme } from './styles';
import CustomFooter from './Footer/index';

import Contents from './strings';

const language = localStorage.getItem('language');

const DataTableEmptyState = props => {
  const {
    error,
    defaultEmptyState,
    title,
    subtitle,
    customEmptyStateIcon
  } = props;

  const defaultTitle = error
    ? Contents[language]?.errorTitle
    : Contents[language]?.defaultTitle;

  const defaultSubtitle = error
    ? Contents[language]?.errorSubtitle
    : Contents[language]?.defaultSubtitle;

  return (
    <EmptyPlaceholder
      title={defaultEmptyState ? defaultTitle : title}
      subtitle={defaultEmptyState ? defaultSubtitle : subtitle}
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
  error: boolean,
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
  onRowsSelect: (row: Array<any>, allRowsSelected: Array<any>) => void,
  onResetfiltersClick?: () => void,
  onSearchTextChange?: (search: string) => void,
  onColumnSortClick?: (row: any) => void,
  onPerPageClick?: (perPage: number) => void,
  onPageClick?: (page: number) => void | any,
  defaultEmptyState?: boolean,
  customEmptyStateIcon?: any,
  title?: string,
  subtitle?: string,
  selectableRows?: 'none' | 'multiple' | 'single',
  onColumnDisplayClick?: (row: any) => void
};

const DataTable = (props: DataTableProps) => {
  const {
    error,
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
    onRowsSelect,
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
        customToolbarSelect,
        selectableRowsOnClick: true,
        onRowsSelect, // triggered when changing rows selection/deselection
        serverSide: true,
        count,
        page,
        rowsPerPage,
        searchText,
        searchPlaceholder: Contents[language]?.Searchfor,
        customSearchRender: debounceSearchRender(400),
        onRowClick: (rowData, rowMeta) => {
          onRowClick && onRowClick(rowMeta);
        },
        onSearchChange: newSearchText => {
          onSearchTextChange && onSearchTextChange(newSearchText);
          onSearchTextChange &&
            newSearchText &&
            onSearchTextChange(newSearchText);
        },
        onColumnSortChange: (changedColumn, direction) => {
          let order = 'desc';
          if (direction === 'ascending') order = 'asc';
          onColumnSortClick &&
            onColumnSortClick({ orderBy: changedColumn, direction: order });
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
            onColumnDisplayClick({
              column: changedColumn,
              display: showColumn
            });
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
            noMatch: (
              <DataTableEmptyState
                error={error}
                defaultEmptyState={defaultEmptyState}
                title={title}
                subtitle={subtitle}
                customEmptyStateIcon={customEmptyStateIcon}
              />
            ),
            toolTip: Contents[language]?.Sort,
            columnHeaderTooltip: column =>
              `${Contents[language]?.SortFor} ${column.label}`
          },
          pagination: {
            next: Contents[language]?.Next,
            previous: Contents[language]?.Previous,
            rowsPerPage: Contents[language]?.RowsPerPage,
            displayRows: Contents[language]?.DisplayRows
          },
          toolbar: {
            search: Contents[language]?.Search,
            downloadCsv: Contents[language]?.DownloadCSV,
            print: Contents[language]?.Print,
            viewColumns: Contents[language]?.ViewColumns,
            filterTable: Contents[language]?.FilterTable
          },
          filter: {
            all: Contents[language]?.All,
            title: Contents[language]?.FilterTitle,
            reset: Contents[language]?.Reset
          },
          viewColumns: {
            title: Contents[language]?.ShowColumns,
            titleAria: Contents[language]?.ShowColumnsAria
          },
          selectedRows: {
            text: Contents[language]?.SelectedRowsText,
            delete: Contents[language]?.SelectedRowsDelete,
            deleteAria: Contents[language]?.SelectedRowsDeleteAria
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
  selectableRows: 'none',
  customToolbarSelect: undefined,
  onColumnDisplayClick: undefined,
  theme: getMuiTheme()
};

export default DataTable;
