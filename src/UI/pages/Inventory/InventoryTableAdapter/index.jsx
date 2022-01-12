// @flow
import React from 'react';
// import PropTypes from 'prop-types';
import DataTable from 'UI/components/organisms/DataTable';
import CellSkeleton from 'UI/components/molecules/CellSkeleton';
import { FormControl } from '@material-ui/core';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import TextBox from 'UI/components/atoms/TextBox';
import { Endpoints } from 'UI/constants/endpoints';
import { currencyFormatter } from 'UI/utils';
import StatusLabel, {
  StatusLabelOptions
} from 'UI/components/atoms/StatusLabel';
import SelectedInventoryCustomMenu from '../SelectedInventoryCustomMenu';
import Contents from '../strings';
import { type UIStateInventory, FilterInventory } from '../types';

type InventoryTableAdapterPropTypes = {|
  data: Array<Object>,
  uiState: UIStateInventory,
  searching: boolean,
  count: number,
  filters: FilterInventory,
  handleFilterChange: (string, any) => any,
  onRowsSelect: (row: Array<any>, allRowsSelected: Array<any>) => void,
  handleResetFiltersClick: () => any,
  handleSearchChange: () => any,
  handleColumnSortClick: any => any,
  handlePerPageClick: () => any,
  handlePageClick: () => any,
  setData: () => any,
  setUiState: UIStateInventory => any,
  setSearching: boolean => any,
  error: boolean,
  loading: boolean
|};

const InventoryTableAdapter = (props: InventoryTableAdapterPropTypes) => {
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
    { id: -1, name: 'idTable', display: true },
    { id: 0, name: 'idProduct', display: true },
    { id: 1, name: 'productCode', display: true },
    { id: 2, name: 'color', display: true },
    { id: 3, name: 'size', display: true },
    { id: 4, name: 'pieces', display: false },
    { id: 5, name: 'salePrice', display: true },
    { id: 6, name: 'gender', display: true },
    { id: 7, name: 'type', display: true },
    { id: 8, name: 'reservedQuantity', display: false },
    { id: 9, name: 'material', display: true },
    { id: 10, name: 'stock', display: true },
    { id: 11, name: 'name', display: true },
    { id: 12, name: 'status', display: false },
    { id: 13, name: 'store', display: true },
    { id: 14, name: 'observations', display: false }
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
        filter: false,
        sort: false,
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
        filterType: 'custom'
      }
    },
    {
      name: 'productCode',
      label: Contents[language]?.labCode,
      options: {
        filter: true,
        sort: true,
        display: columnItems[1].display,
        sortDirection: sortDirection[1],
        filterType: 'custom',
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>
              <strong>{value}</strong>
            </CellSkeleton>
          );
        }
      }
    },
    {
      name: 'name',
      label: Contents[language]?.labName,
      options: {
        filter: true,
        sort: true,
        display: columnItems[11].display,
        sortDirection: sortDirection[11],
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>{value || '--'}</CellSkeleton>
          );
        },
        filterType: 'custom'
      }
    },
    {
      name: 'color',
      label: Contents[language]?.labColor,
      options: {
        filter: true,
        sort: true,
        display: columnItems[2].display,
        sortDirection: sortDirection[2],
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="color_filter"
                  placeholder={Contents[language]?.labColor}
                  url={Endpoints.Colors}
                  selectedValue={filters.color_filter}
                  onSelect={handleFilterChange}
                />
                <TextBox
                  inputType="number"
                  name="minSalePrice_filter"
                  placeholder={Contents[language]?.minSalePrice}
                  defaultValue={filters?.minSalePrice_filter?.numberValue}
                  onChange={(name, numberValue) => {
                    handleFilterChange(
                      name,
                      numberValue
                        ? {
                            numberValue,
                            title: `minSalePrice: ${numberValue}`
                          }
                        : undefined
                    );
                  }}
                />
                <TextBox
                  inputType="number"
                  name="minCost_filter"
                  placeholder={Contents[language]?.minCost}
                  defaultValue={filters?.minCost_filter?.numberValue}
                  onChange={(name, numberValue) => {
                    handleFilterChange(
                      name,
                      numberValue
                        ? {
                            numberValue,
                            title: `minCost: ${numberValue}`
                          }
                        : undefined
                    );
                  }}
                />
              </FormControl>
            );
          }
        },
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'size',
      label: Contents[language]?.labSize,
      options: {
        filter: true,
        sort: true,
        display: columnItems[3].display,
        sortDirection: sortDirection[3],
        filterType: 'custom',
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>
              {value === -1 ? 'Unitalla' : value}
            </CellSkeleton>
          );
        }
      }
    },
    {
      name: 'pieces',
      label: Contents[language]?.labPieces,
      options: {
        filter: true,
        sort: true,
        display: columnItems[4].display,
        sortDirection: sortDirection[4],
        filterType: 'custom',
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>
              {value || (value === 0 ? 0 : '--')}
            </CellSkeleton>
          );
        }
      }
    },
    {
      name: 'salePrice',
      label: Contents[language]?.labPrice,
      options: {
        filter: true,
        sort: true,
        display: columnItems[5].display,
        sortDirection: sortDirection[5],
        filterType: 'custom',
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>
              {value ? currencyFormatter(value) : currencyFormatter(0)}
            </CellSkeleton>
          );
        }
      }
    },
    {
      name: 'gender',
      label: Contents[language]?.labGender,
      options: {
        filter: true,
        sort: true,
        display: columnItems[6].display,
        sortDirection: sortDirection[6],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        },
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="gender_filter"
                  placeholder={Contents[language]?.labGender}
                  url={Endpoints.Genders}
                  selectedValue={filters.gender_filter}
                  onSelect={handleFilterChange}
                />
                <TextBox
                  inputType="number"
                  name="maxSalePrice_filter"
                  placeholder={Contents[language]?.maxSalePrice}
                  defaultValue={filters?.maxSalePrice_filter?.numberValue}
                  onChange={(name, numberValue) => {
                    handleFilterChange(
                      name,
                      numberValue
                        ? {
                            numberValue,
                            title: `maxSalePrice: ${numberValue}`
                          }
                        : undefined
                    );
                  }}
                />
                <TextBox
                  inputType="number"
                  name="maxCost_filter"
                  placeholder={Contents[language]?.maxCost}
                  defaultValue={filters?.maxCost_filter?.numberValue}
                  onChange={(name, numberValue) => {
                    handleFilterChange(
                      name,
                      numberValue
                        ? {
                            numberValue,
                            title: `maxCost: ${numberValue}`
                          }
                        : undefined
                    );
                  }}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'type',
      label: Contents[language]?.labType,
      options: {
        filter: true,
        sort: true,
        display: columnItems[7].display,
        sortDirection: sortDirection[7],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        },
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="type_filter"
                  placeholder={Contents[language]?.labType}
                  url={Endpoints.GetTypes}
                  selectedValue={filters.type_filter}
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'reservedQuantity',
      label: Contents[language]?.labReserved,
      options: {
        filter: true,
        sort: true,
        display: columnItems[8].display,
        sortDirection: sortDirection[8],
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>{value || '--'}</CellSkeleton>
          );
        },
        filterType: 'custom'
      }
    },
    {
      name: 'material',
      label: Contents[language]?.labMaterials,
      options: {
        filter: true,
        sort: true,
        display: columnItems[9].display,
        sortDirection: sortDirection[9],
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>{value || '--'}</CellSkeleton>
          );
        },
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <div display="flex">
                  <AutocompleteSelect
                    name="material_filter"
                    placeholder={Contents[language]?.labMaterials}
                    url={Endpoints.Materials}
                    selectedValue={filters.material_filter}
                    onSelect={handleFilterChange}
                  />
                </div>
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'stock',
      label: Contents[language]?.labStock,
      options: {
        filter: true,
        sort: true,
        display: columnItems[10].display,
        sortDirection: sortDirection[10],
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>
              {value || (value === 0 ? 0 : '--')}
            </CellSkeleton>
          );
        },
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <TextBox
                  inputType="number"
                  name="stock_filter"
                  label={Contents[language]?.labStock}
                  defaultValue={filters?.stock_filter?.numberValue}
                  onChange={(name, numberValue) => {
                    handleFilterChange(
                      name,
                      numberValue
                        ? {
                            numberValue,
                            title: `Stock: ${numberValue}`
                          }
                        : undefined
                    );
                  }}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'status',
      label: Contents[language]?.labStatus,
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
                  placeholder={Contents[language]?.labStatus}
                  selectedValue={filters?.status_filter}
                  onSelect={handleFilterChange}
                  defaultOptions={StatusLabelOptions}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'store',
      label: Contents[language]?.labStore,
      options: {
        filter: true,
        sort: true,
        display: columnItems[13].display,
        sortDirection: sortDirection[13],
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'observations',
      label: Contents[language]?.labObservations,
      options: {
        filter: true,
        sort: true,
        display: columnItems[14].display,
        sortDirection: sortDirection[14],
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
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
      onRowsSelect={onRowsSelect}
      onColumnSortClick={handleColumnSortClick}
      onPerPageClick={handlePerPageClick}
      onPageClick={handlePageClick}
      onColumnDisplayClick={handleColumnDisplayClick}
      selectableRows="single"
      customToolbarSelect={selectedRows => {
        if (data?.length === 0) return null;
        const selectedRowIndex = selectedRows?.data[0]?.index;
        const rowData = data[selectedRowIndex];
        const { idInventory, productCode, productId, status } = rowData;
        return (
          <SelectedInventoryCustomMenu
            idInventory={idInventory}
            productCode={productCode}
            productId={productId}
            setUiState={setUiState}
            selectedRowIndex={selectedRowIndex}
            setData={setData}
            inventoryStatus={status}
          />
        );
      }}
    />
  );
};

export default InventoryTableAdapter;
