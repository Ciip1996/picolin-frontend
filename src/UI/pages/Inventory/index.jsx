// @flow
import React, { useState, useEffect, useCallback } from 'react';

// import queryString from 'query-string';
import { connect } from 'react-redux';

import { FormControl } from '@material-ui/core';
import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';

import { showAlert } from 'actions/app';
import Drawer from '@material-ui/core/Drawer';
import { drawerAnchor, PageTitles } from 'UI/constants/defaults';
/** Atoms, Components and Styles */
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';

/** Components */
import DataTable from 'UI/components/organisms/DataTable';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import InventoryProductDrawer from 'UI/components/molecules/InventoryDrawer';

/** API / EntityRoutes / Endpoints / EntityType */
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorMessage } from 'UI/utils';
import type { Filters } from 'types/app';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import { saveFilters, getFilters } from 'services/FiltersStorage';

const CellSkeleton = ({ children, searching }) => {
  return searching ? <CustomSkeleton width="90%" height={18} /> : <>{children}</>;
};

type InventoryListProps = {
  onShowAlert: any => void
};

// const chainedSelects = {
//   state: ['city', 'zip']
// };

const columnItems = [
  { id: 0, name: 'productCode', display: true },
  { id: 1, name: 'color', display: true },
  { id: 2, name: 'size', display: true },
  { id: 3, name: 'pieces', display: true },
  { id: 4, name: 'salePrice', display: true },
  { id: 5, name: 'gender', display: true },
  { id: 6, name: 'type', display: true },
  { id: 7, name: 'reservedQuantity', display: true },
  { id: 8, name: 'stock', display: true }
];

const getSortDirections = (orderBy: string, direction: string) =>
  columnItems.map(item => (item.name === orderBy ? direction : 'none'));

const InventoryList = (props: InventoryListProps) => {
  const { onShowAlert } = props;

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const [data, setData] = useState<any>(null);
  const [count, setCount] = useState(0);
  const defaultInventory = { idStore: 0, store: '' };
  const [inventorySelect, setInventorySelect] = useState([defaultInventory]);

  const genders = [
    { id: 0, title: 'Masculino' },
    { id: 0, title: 'Femenino' }
  ];

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
    keyword: savedParams?.keyword || '',
    orderBy: savedParams?.orderBy || '',
    direction: savedParams?.direction || '',
    page: savedParams?.page - 1 || 0,
    perPage: savedParams?.perPage || 10,
    isTransferDrawerOpen: true
  });

  const getData = useCallback(async () => {
    try {
      console.log('getting data - filters: ', filters);
      const { store } = filters;
      const params = {
        keyword: uiState.keyword,
        orderBy: uiState.orderBy,
        page: uiState.page + 1,
        perPage: uiState.perPage,
        store: store ? store.store : undefined
      };
      // debugger;

      saveFilters('inventory', { filters, params });

      const url = filters?.store
        ? '/getInventory/:filtros'.replace(':filtros', filters?.store?.store)
        : '/getInventory/TODOS';
      // const queryParams = queryString.stringify(params);
      const response = await API.get(url);

      if (response?.status === 200 && response?.data) {
        setData(response?.data);
      }
      setCount(0);
      setLoading(false);
      setSearching(false);
    } catch (error) {
      onShowAlert({
        severity: 'error',
        title: 'Inventory',
        autoHideDuration: 3000,
        body: getErrorMessage(error)
      });
    }
  }, [filters, onShowAlert, uiState.keyword, uiState.orderBy, uiState.page, uiState.perPage]);

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
    setFilters({ ...filters, [filterName]: null });
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
      name: 'id',
      options: {
        filter: true,
        sort: false,
        display: 'excluded',
        filterType: 'custom'
      }
    },
    {
      name: 'productCode',
      label: 'Código',
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
      label: 'Color',
      options: {
        filter: true,
        sort: true,
        display: columnItems[1].display,
        sortDirection: sortDirection[1],
        filterType: 'custom',
        // filterOptions: {
        //   display: () => {
        //     return (
        //       <FormControl>
        //         <AutocompleteSelect
        //           name="office"
        //           placeholder="Color"
        //           url={`${Endpoints.Users}/${Endpoints.Inventory}/${Endpoints.Offices}`}
        //           selectedValue={filters.office}
        //           renderOption={option => (
        //             <>
        //               <span>{`${option.title}`}</span>
        //               {option.state && ','}
        //               &nbsp;
        //               <strong>{option.state && option.state}</strong>
        //             </>
        //           )}
        //           onSelect={handleFilterChange}
        //         />
        //       </FormControl>
        //     );
        //   }
        // },
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'size',
      label: 'Talla',
      options: {
        filter: true,
        sort: true,
        display: columnItems[2].display,
        sortDirection: sortDirection[2],
        filterType: 'custom',
        // filterOptions: {
        //   display: () => {
        //     return (
        //       <FormControl>
        //         <AutocompleteSelect
        //           name="office"
        //           placeholder="Talla"
        //           url={`${Endpoints.Users}/${Endpoints.Inventory}/${Endpoints.Offices}`}
        //           selectedValue={filters.office}
        //           renderOption={option => (
        //             <>
        //               <span>{`${option.title}`}</span>
        //               {option.state && ','}
        //               &nbsp;
        //               <strong>{option.state && option.state}</strong>
        //             </>
        //           )}
        //           onSelect={handleFilterChange}
        //         />
        //       </FormControl>
        //     );
        //   }
        // },
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'pieces',
      label: 'Piezas',
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
      label: 'Precio',
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
      name: 'gender',
      label: 'Género',
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
                  placeholder="Género"
                  selectedValue={filters.gender_filter || genders[0]}
                  onSelect={handleFilterChange}
                  defaultOptions={genders}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'type',
      label: 'Tipo',
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
                  placeholder="Tipo"
                  url="/getTypes"
                  selectedValue={filters?.type_filter}
                  renderOption={option => <span>{`${option?.type}`}</span>}
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
      label: 'Apartados',
      options: {
        filter: true,
        sort: true,
        display: columnItems[7].display,
        sortDirection: sortDirection[7],
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
                    name="office"
                    placeholder="Estatus"
                    url=""
                    selectedValue={filters.office}
                    renderOption={option => (
                      <>
                        <span>{`${option.title}`}</span>
                        {option.state && ','}
                        &nbsp;
                        <strong>{option.state && option.state}</strong>
                      </>
                    )}
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
      label: 'Stock',
      options: {
        filter: true,
        sort: true,
        display: columnItems[8].display,
        sortDirection: sortDirection[8],
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        },
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <div display="flex">
                  <AutocompleteSelect
                    name="office"
                    placeholder="Estatus"
                    url=""
                    selectedValue={filters.office}
                    renderOption={option => (
                      <>
                        <span>{`${option.title}`}</span>
                        {option.state && ','}
                        &nbsp;
                        <strong>{option.state && option.state}</strong>
                      </>
                    )}
                    onSelect={handleFilterChange}
                  />
                </div>
              </FormControl>
            );
          }
        }
      }
    }
  ];

  const getInventories = useCallback(async () => {
    try {
      const response = await API.get(`${Endpoints.Stores}`);
      if (response?.status === 200) {
        setInventorySelect(response.data);
      }
    } catch (error) {
      onShowAlert({
        severity: 'error',
        title: 'Inventario',
        autoHideDuration: 3000,
        body: getErrorMessage(error) // TODO: change error messages
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onShowAlert]);

  useEffect(() => {
    document.title = PageTitles.Inventory;
    getData();
    getInventories();
  }, [getData, getInventories]);

  useEffect(() => {
    console.log('new useeffect', filters);
  }, [filters]);

  return (
    (
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isTransferDrawerOpen}
        onClose={toggleDrawer('isTransferDrawerOpen', false)}
      >
        <div role="presentation">
          <InventoryProductDrawer />
        </div>
      </Drawer>
    ),
    (
      <ContentPageLayout>
        <ListPageLayout
          loading={loading}
          title="INVENTARIO"
          selector={
            <AutocompleteSelect
              name="store"
              placeholder="Inventario"
              displayKey="store"
              url={Endpoints.Stores}
              selectedValue={filters?.store}
              onSelect={handleFilterChange}
              defaultOptions={inventorySelect}
            />
          }
          filters={filters}
          onFilterRemove={handleFilterRemove}
          onFiltersReset={handleResetFiltersClick}
        >
          <DataTable
            loading={loading}
            data={data}
            columns={columns}
            count={count}
            page={uiState.page}
            rowsPerPage={uiState.perPage}
            searchText={uiState.keyword}
            onRowClick={handleRowClick}
            onResetfiltersClick={handleResetFiltersClick}
            onSearchTextChange={handleSearchChange}
            onColumnSortClick={handleColumnSortClick}
            onPerPageClick={handlePerPageClick}
            onPageClick={handlePageClick}
            onColumnDisplayClick={handleColumnDisplayClick}
            selectableRows="none"
          />
        </ListPageLayout>
      </ContentPageLayout>
    )
  );
};
const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(InventoryList);
