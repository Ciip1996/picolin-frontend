// @flow
import React, { useState, useEffect, useCallback } from 'react';

import queryString from 'query-string';
import { connect } from 'react-redux';

import { FormControl } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';

import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';
import ActionButton from 'UI/components/atoms/ActionButton';

import { showAlert } from 'actions/app';
import { drawerAnchor, PageTitles } from 'UI/constants/defaults';

/** Atoms, Components and Styles */
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import TextBox from 'UI/components/atoms/TextBox';
import DataTable from 'UI/components/organisms/DataTable';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import AddInventoryProductDrawer from 'UI/components/organisms/AddInventoryProductDrawer';
import QRCodeDrawer from 'UI/components/organisms/QRCodeDrawer';

/** API / EntityRoutes / Endpoints / EntityType */
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorData, currencyFormatter } from 'UI/utils';
import type { Filters } from 'types/app';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import { saveFilters, getFilters } from 'services/FiltersStorage';
import { AddIcon, colors } from 'UI/res';
import Contents from './strings';

const CellSkeleton = ({ children, searching }) => {
  return searching ? <CustomSkeleton width="90%" height={18} /> : <>{children}</>;
};

type InventoryListProps = {
  onShowAlert: any => void
};

const columnItems = [
  { id: 0, name: 'productCode', display: true },
  { id: 1, name: 'color', display: true },
  { id: 2, name: 'size', display: true },
  { id: 3, name: 'pieces', display: true },
  { id: 4, name: 'salePrice', display: true },
  { id: 5, name: 'gender', display: true },
  { id: 6, name: 'type', display: true },
  { id: 7, name: 'reservedQuantity', display: false },
  { id: 8, name: 'characteristic', display: true },
  { id: 9, name: 'stock', display: true }
];

const getSortDirections = (orderBy: string, direction: string) =>
  columnItems.map(item => (item.name === orderBy ? direction : 'none'));

const InventoryList = (props: InventoryListProps) => {
  const { onShowAlert } = props;
  const language = localStorage.getItem('language');

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(false);

  const [data, setData] = useState<any>(null);
  const [count, setCount] = useState(0);

  const savedSearch = getFilters('inventory');
  const savedFilters = savedSearch?.filters;
  const savedParams = savedSearch?.params;
  const [filters, setFilters] = useState<Filters>(savedFilters || {});

  const toggleDrawer = (drawer: string, open: boolean) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setUiState(prevState => ({ ...prevState, [drawer]: open }));
  };

  const [uiState, setUiState] = useState({
    keyword: savedParams?.keyword || undefined,
    orderBy: savedParams?.orderBy || undefined,
    direction: savedParams?.direction || undefined,
    page: savedParams?.page - 1 || 0,
    perPage: savedParams?.perPage || 10,
    isAddProductDrawerOpen: false,
    isQRCodeDrawerOpen: false,
    productCode: undefined
  });

  const getData = useCallback(async () => {
    try {
      const {
        store_filter,
        gender_filter = undefined,
        characteristic_filter = undefined,
        type_filter = undefined,
        color_filter = undefined,
        stock_filter = undefined,
        minSalePrice_filter = undefined,
        maxSalePrice_filter = undefined,
        minCost_filter = undefined,
        maxCost_filter = undefined
      } = filters;

      const params = {
        keyword: uiState.keyword,
        orderBy: uiState.orderBy,
        direction: uiState.direction,
        page: uiState.page + 1,
        perPage: uiState.perPage,
        gender: gender_filter?.title,
        characteristic: characteristic_filter?.title,
        idType: type_filter?.id,
        color: color_filter?.title,
        stock: stock_filter?.numberValue,
        minSalePrice: minSalePrice_filter?.numberValue,
        maxSalePrice: maxSalePrice_filter?.numberValue,
        minCost: minCost_filter?.numberValue,
        maxCost: maxCost_filter?.numberValue
      };

      saveFilters('inventory', { filters, params });

      const queryParams = queryString.stringify(params);
      const url = `${Endpoints.Inventory}${Endpoints.GetInventory}?`.replace(
        ':idStore',
        store_filter ? store_filter?.id : 'ALL'
      );

      const response = await API.get(`${url}${queryParams}`);
      if (response?.status === 200) {
        setData(response?.data?.inventory || []);
      }

      setCount(Number(response?.data?.totalResults) || 0);
      setLoading(false);
      setSearching(false);
      setError(false);
    } catch (err) {
      setError(true);
      onShowAlert({
        severity: 'error',
        autoHideDuration: 3000,
        title: getErrorData(err)?.title || 'Error en conexión',
        body: getErrorData(err)?.message || 'Contacte a soporte técnico'
      });
    }
  }, [
    filters,
    onShowAlert,
    uiState.keyword,
    uiState.page,
    uiState.perPage,
    uiState.orderBy,
    uiState.direction
  ]);

  const handleSearchChange = newKeyword => {
    setSearching(true);
    setUiState(prevState => ({
      ...prevState,
      keyword: newKeyword,
      page: 0
    }));
  };

  const handleFilterChange = (name: string, value: any) => {
    setSearching(true);
    setFilters({ ...filters, [name]: value });
    setUiState(prevState => ({
      ...prevState,
      page: 0
    }));
  };

  const handleResetFiltersClick = () => {
    setSearching(true);
    setFilters({});
  };

  const handleFilterRemove = (filterName: string) => {
    setSearching(true);
    setFilters({ ...filters, [filterName]: undefined });
  };

  const onProductInserted = (productCode: string) => {
    setUiState(prevState => ({
      ...prevState,
      isQRCodeDrawerOpen: true,
      isAddProductDrawerOpen: false,
      productCode
    }));
  };

  const handleColumnSortClick = newSortDirection => {
    const { orderBy, direction } = newSortDirection;
    setSearching(true);

    setUiState(prevState => ({
      ...prevState,
      orderBy,
      direction,
      page: 0
    }));
  };

  const handlePerPageClick = newPerPage => {
    setSearching(true);
    setUiState(prevState => ({
      ...prevState,
      page: 0,
      perPage: newPerPage
    }));
  };

  const handlePageClick = newPage => {
    setSearching(true);

    setUiState(prevState => ({
      ...prevState,
      page: newPage
    }));
  };

  const handleColumnDisplayClick = newColumnDisplay => {
    const { column, display } = newColumnDisplay;
    const index = columnItems.findIndex(item => item.name === column);
    columnItems[index].display = display;
  };

  const handleRowClick = () => {
    // const { id } = data[newItem.rowIndex];
    // history.push(EntityRoutes.RostserProfile.replace(':id', id));
  };

  const sortDirection = getSortDirections(uiState.orderBy, uiState.direction);

  const columns = [
    {
      name: 'idInventory',
      options: {
        filter: true,
        sort: false,
        display: 'excluded',
        filterType: 'custom'
      }
    },
    {
      name: 'productCode',
      label: Contents[language]?.labCode,
      options: {
        filter: true,
        sort: true,
        display: columnItems[0].display,
        sortDirection: sortDirection[0],
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
      name: 'color',
      label: Contents[language]?.labColor,
      options: {
        filter: true,
        sort: true,
        display: columnItems[1].display,
        sortDirection: sortDirection[1],
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
        display: columnItems[2].display,
        sortDirection: sortDirection[2],
        filterType: 'custom',
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>{value === -1 ? 'Unitalla' : value}</CellSkeleton>
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
        display: columnItems[3].display,
        sortDirection: sortDirection[3],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'salePrice',
      label: Contents[language]?.labPrice,
      options: {
        filter: true,
        sort: true,
        display: columnItems[4].display,
        sortDirection: sortDirection[4],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{currencyFormatter(value)}</CellSkeleton>;
        }
      }
    },
    {
      name: 'gender',
      label: Contents[language]?.labGender,
      options: {
        filter: true,
        sort: true,
        display: columnItems[5].display,
        sortDirection: sortDirection[5],
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
        display: columnItems[7].display,
        sortDirection: sortDirection[7],
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value || '--'}</CellSkeleton>;
        },
        filterType: 'custom'
      }
    },
    {
      name: 'characteristic',
      label: Contents[language]?.labCharacteristic,
      options: {
        filter: true,
        sort: true,
        display: columnItems[8].display,
        sortDirection: sortDirection[8],
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value || '--'}</CellSkeleton>;
        },
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <div display="flex">
                  <AutocompleteSelect
                    name="characteristic_filter"
                    placeholder={Contents[language]?.labCharacteristic}
                    url={Endpoints.Characteristics}
                    selectedValue={filters.characteristic_filter}
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
        display: columnItems[9].display,
        sortDirection: sortDirection[9],
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value || '--'}</CellSkeleton>;
        },
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <div display="flex">
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
                </div>
              </FormControl>
            );
          }
        }
      }
    }
  ];

  useEffect(() => {
    if (error) {
      setData([]);
      setSearching(false);
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    document.title = PageTitles.Inventory;
    getData();
  }, [error, getData]);

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={loading}
        title={Contents[language]?.labInventory}
        selector={
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="center"
            flexWrap="wrap"
            minWidth={238}
          >
            <AutocompleteSelect
              name="store_filter"
              placeholder={Contents[language]?.labInventory}
              url={Endpoints.Stores}
              selectedValue={filters.store_filter}
              onSelect={handleFilterChange}
            />
            <ActionButton
              text={Contents[language]?.addNewProduct}
              onClick={toggleDrawer('isAddProductDrawerOpen', !uiState.isAddProductDrawerOpen)}
            >
              <AddIcon fill={colors.white} size={18} />
            </ActionButton>
          </Box>
        }
        filters={filters}
        onFilterRemove={handleFilterRemove}
        onFiltersReset={handleResetFiltersClick}
      >
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
          searchText={uiState.keyword}
          onRowClick={handleRowClick}
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
        />
      </ListPageLayout>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isAddProductDrawerOpen}
        onClose={toggleDrawer('isAddProductDrawerOpen', false)}
      >
        <div role="presentation">
          <AddInventoryProductDrawer
            onProductInserted={onProductInserted}
            onShowAlert={onShowAlert}
            handleClose={toggleDrawer('isAddProductDrawerOpen', false)}
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isQRCodeDrawerOpen}
        onClose={toggleDrawer('isQRCodeDrawerOpen', false)}
      >
        <div role="presentation">
          <QRCodeDrawer
            productCode={uiState.productCode}
            onShowAlert={onShowAlert}
            handleClose={toggleDrawer('isQRCodeDrawerOpen', false)}
          />
        </div>
      </Drawer>
    </ContentPageLayout>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(InventoryList);
