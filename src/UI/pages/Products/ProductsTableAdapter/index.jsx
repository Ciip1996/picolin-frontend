// @flow
import React from 'react';
// import PropTypes from 'prop-types';
import DataTable from 'UI/components/organisms/DataTable';
import CellSkeleton from 'UI/components/molecules/CellSkeleton';
import { FormControl } from '@material-ui/core';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import StatusLabel, {
  StatusLabelOptions
} from 'UI/components/atoms/StatusLabel';
import { DateFormats } from 'UI/constants/defaults';
import moment from 'moment-timezone';
import SelectedProductCustomMenu from '../SelectedProductCustomMenu';
import Contents from '../strings';
import { type UIStateProduct, FilterProduct } from '../types';

type ProductsTableAdapterPropTypes = {|
  data: Array<Object>,
  uiState: UIStateProduct,
  searching: boolean,
  count: number,
  filters: FilterProduct,
  handleFilterChange: (string, any) => any,
  onRowsSelect: (row: Array<any>, allRowsSelected: Array<any>) => void,
  handleResetFiltersClick: () => any,
  handleSearchChange: () => any,
  handleColumnSortClick: any => any,
  handlePerPageClick: () => any,
  handlePageClick: () => any,
  setData: any,
  setUiState: UIStateProduct => any,
  setSearching: boolean => any,
  error: boolean,
  loading: boolean
|};

const ProductsTableAdapter = (props: ProductsTableAdapterPropTypes) => {
  const {
    data,
    count,
    uiState,
    searching,
    filters,
    error,
    loading,
    handleFilterChange,
    onRowsSelect,
    handleResetFiltersClick,
    handleSearchChange,
    handleColumnSortClick,
    handlePerPageClick,
    handlePageClick,
    setSearching,
    setUiState,
    setData
  } = props;
  const language = localStorage.getItem('language');

  const columnItems = [
    { id: 0, name: 'idProduct', display: true },
    { id: 1, name: 'productCode', display: true },
    { id: 2, name: 'name', display: true },
    { id: 3, name: 'type', display: true },
    { id: 4, name: 'material', display: true },
    { id: 5, name: 'provider', display: true },
    { id: 6, name: 'size', display: true },
    { id: 7, name: 'pieces', display: true },
    { id: 8, name: 'cost', display: true },
    { id: 9, name: 'gender', display: true },
    { id: 10, name: 'color', display: true },
    { id: 11, name: 'registrationDate', display: true },
    { id: 12, name: 'user', display: true },
    { id: 13, name: 'observations', display: true },
    { id: 14, name: 'status', display: true }
  ];
  const getSortDirections = (orderBy: string, direction: string) =>
    columnItems.map(item => (item.name === orderBy ? direction : 'none'));

  const sortDirection = getSortDirections(uiState.orderBy, uiState.direction);

  const handleColumnDisplayClick = newColumnDisplay => {
    const { column, display } = newColumnDisplay;
    const index = columnItems.findIndex(item => item.name === column);
    columnItems[index].display = display;
  };

  const columns = [
    {
      name: 'idTable',
      options: {
        filter: true,
        sort: false,
        print: false,
        display: 'excluded',
        filterType: 'custom'
      }
    },
    {
      name: 'idProduct',
      label: Contents[language]?.lblIdProduct,
      options: {
        filter: true,
        sort: true,
        display: columnItems[0].display,
        sortDirection: sortDirection[0],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'productCode',
      label: Contents[language]?.lblProductCode,
      options: {
        filter: true,
        sort: true,
        display: columnItems[1].display,
        sortDirection: sortDirection[1],
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>
              <strong>{value}</strong>
            </CellSkeleton>
          );
        },
        filterType: 'custom'
      }
    },
    {
      name: 'name',
      label: Contents[language]?.lblName,
      options: {
        filter: true,
        sort: true,
        display: columnItems[2].display,
        sortDirection: sortDirection[2],
        filterType: 'custom',
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>
              <strong>{value}</strong>
            </CellSkeleton>
          );
        },
        filterOptions: {
          display: () => {
            return <FormControl />;
          }
        }
      }
    },
    {
      name: 'type',
      label: Contents[language]?.lblType,
      options: {
        filter: true,
        sort: true,
        display: columnItems[3].display,
        sortDirection: sortDirection[3],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'material',
      label: Contents[language]?.lblMaterial,
      options: {
        filter: true,
        sort: true,
        display: columnItems[4].display,
        sortDirection: sortDirection[4],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'provider',
      label: Contents[language]?.lblProvider,
      options: {
        filter: true,
        sort: true,
        display: columnItems[5].display,
        sortDirection: sortDirection[5],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'size',
      label: Contents[language]?.lblSize,
      options: {
        filter: true,
        sort: true,
        display: columnItems[6].display,
        sortDirection: sortDirection[6],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'pieces',
      label: Contents[language]?.lblPieces,
      options: {
        filter: true,
        sort: true,
        display: columnItems[7].display,
        sortDirection: sortDirection[7],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'cost',
      label: Contents[language]?.lblCost,
      options: {
        filter: true,
        sort: true,
        display: columnItems[8].display,
        sortDirection: sortDirection[8],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'salePrice',
      label: Contents[language]?.lblSalePrice,
      options: {
        filter: true,
        sort: true,
        display: columnItems[9].display,
        sortDirection: sortDirection[9],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'gender',
      label: Contents[language]?.lblGender,
      options: {
        filter: true,
        sort: true,
        display: columnItems[9].display,
        sortDirection: sortDirection[9],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'color',
      label: Contents[language]?.lblColor,
      options: {
        filter: true,
        sort: true,
        display: columnItems[10].display,
        sortDirection: sortDirection[10],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'registrationDate',
      label: Contents[language]?.lblRegistrationDate,
      options: {
        filter: true,
        sort: true,
        display: columnItems[11].display,
        sortDirection: sortDirection[11],
        filterType: 'custom',
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>
              <strong>
                {value &&
                  moment(value).format(
                    DateFormats.International.DetailDateTime
                  )}
              </strong>
            </CellSkeleton>
          );
        }
      }
    },
    {
      name: 'user',
      label: Contents[language]?.lblUser,
      options: {
        filter: true,
        sort: true,
        display: columnItems[12].display,
        sortDirection: sortDirection[12],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'observations',
      label: Contents[language]?.lblObservations,
      options: {
        filter: true,
        sort: true,
        display: columnItems[13].display,
        sortDirection: sortDirection[13],
        filterType: 'custom',
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>{value || '--'}</CellSkeleton>
          );
        }
      }
    },
    {
      name: 'status',
      label: Contents[language]?.lblStatus,
      options: {
        filter: true,
        sort: true,
        display: columnItems[12].display,
        sortDirection: sortDirection[12],
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>
              <StatusLabel value={value} />
            </CellSkeleton>
          );
        },
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="status_filter"
                  placeholder={Contents[language]?.lblStatus}
                  selectedValue={filters?.status_filter}
                  onSelect={handleFilterChange}
                  defaultOptions={StatusLabelOptions}
                />
              </FormControl>
            );
          }
        }
      }
    }
  ];

  return (
    <DataTable
      error={error}
      loading={loading}
      data={data}
      columns={columns}
      count={count}
      orderBy={uiState.orderBy}
      direction={uiState.direction}
      page={uiState.page}
      rowsPerPage={uiState.perPage}
      searchText={uiState.keyword || ''}
      onResetfiltersClick={handleResetFiltersClick}
      onSearchTextChange={handleSearchChange}
      onSearchClose={() => {
        handleSearchChange();
        setSearching(false);
      }}
      onColumnSortClick={handleColumnSortClick}
      onPerPageClick={handlePerPageClick}
      onPageClick={handlePageClick}
      onColumnDisplayClick={handleColumnDisplayClick}
      selectableRows="single"
      onRowsSelect={onRowsSelect}
      customToolbarSelect={rows => {
        if (data?.length === 0) return null;
        const selectedRowIndex = rows?.data[0]?.index;
        const rowData = data[selectedRowIndex];
        const { productCode, idProduct, status } = rowData;
        return (
          <SelectedProductCustomMenu
            productCode={productCode}
            idProduct={idProduct}
            setUiState={setUiState}
            selectedRowIndex={selectedRowIndex}
            setData={setData}
            d
            productStatus={status}
          />
        );
      }}
    />
  );
};

export default ProductsTableAdapter;
