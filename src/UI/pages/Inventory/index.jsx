// @flow
import React, { useState, useEffect, useCallback } from 'react';

import queryString from 'query-string';
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

type RostersListProps = {
  onShowAlert: any => void
};

const chainedSelects = {
  state: ['city', 'zip']
};

const columnItems = [
  { id: 0, name: 'productCode', display: true },
  { id: 1, name: 'color', display: true },
  { id: 2, name: 'size', display: true },
  { id: 3, name: 'pieces', display: true },
  { id: 4, name: 'salePrice', display: true },
  { id: 5, name: 'gender', display: true },
  { id: 6, name: 'type', display: true },
  { id: 7, name: 'stock', display: true },
  { id: 8, name: 'reservedQuantity', display: true }
];

const getSortDirections = (orderBy: string, direction: string) =>
  columnItems.map(item => (item.name === orderBy ? direction : 'none'));

const RostersList = (props: RostersListProps) => {
  const { onShowAlert } = props;

  useEffect(() => {
    document.title = PageTitles.Inventory;
  }, []);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const [data, setData] = useState<any>(null);
  const [count, setCount] = useState(0);
  const gpacAll = { id: 0, title: 'tienda' };
  const [rosterTypes, setRosterTypes] = useState([gpacAll]);

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
      const { state, city, size, office } = filters;

      const params = {
        keyword: uiState.keyword,
        orderBy: uiState.orderBy,
        direction: uiState.direction,
        stateId: state ? state.id : null,
        cityId: city ? city.id : null,
        roleId: size ? size.id : null,
        office: office ? office.address : null,
        page: uiState.page + 1,
        perPage: uiState.perPage
      };

      saveFilters('inventory', { filters, params });

      // const queryParams = queryString.stringify(params);
      const response = await API.get('/getInventory/TODOS');

      setData(response?.data);
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
  }, [filters, uiState, onShowAlert]);

  const handleSearchChange = newKeyword => {
    setSearching(true);
    setUiState(prevState => ({
      ...prevState,
      keyword: newKeyword,
      page: 0
    }));
  };

  const handleFilterChange = (name?: string, value: any) => {
    setSearching(true);
    setFilters({ ...filters, [name]: value });
    setUiState(prevState => ({
      ...prevState,
      page: 0
    }));

    if (name && chainedSelects[name]) {
      chainedSelects[name].forEach(chainedSelect => {
        setFilters((prevState: Filters): Filters => ({ ...prevState, [chainedSelect]: null }));
      });
    }
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
        }
      }
    },
    {
      name: 'reservedQuantity',
      label: 'Status',
      options: {
        filter: true,
        sort: true,
        display: columnItems[7].display,
        sortDirection: sortDirection[7],
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
                    placeholder="Tipo"
                    url={`${Endpoints.Users}/${Endpoints.Inventory}/${Endpoints.Offices}`}
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
                  <AutocompleteSelect
                    name="office"
                    placeholder="Color"
                    url={`${Endpoints.Users}/${Endpoints.Inventory}/${Endpoints.Offices}`}
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
                  <AutocompleteSelect
                    name="office"
                    placeholder="Talla"
                    url={`${Endpoints.Users}/${Endpoints.Inventory}/${Endpoints.Offices}`}
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
                  <AutocompleteSelect
                    name="office"
                    placeholder="Género"
                    url={`${Endpoints.Users}/${Endpoints.Inventory}/${Endpoints.Offices}`}
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
                  <AutocompleteSelect
                    name="office"
                    placeholder="Estatus"
                    url={`${Endpoints.Users}/${Endpoints.Inventory}/${Endpoints.Offices}`}
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
                  <AutocompleteSelect
                    name="office"
                    placeholder="Inventario"
                    url={`${Endpoints.Users}/${Endpoints.Inventory}/${Endpoints.Offices}`}
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

  const getRosterTypes = useCallback(async () => {
    try {
      const response = await API.get(
        `${Endpoints.Roles}?${queryString.stringify({
          filter: 'inventory'
        })}`
      );
      if (response) {
        setRosterTypes([gpacAll, ...response.data]);
      }
    } catch (error) {
      onShowAlert({
        severity: 'error',
        title: 'Inventory',
        autoHideDuration: 3000,
        body: getErrorMessage(error)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onShowAlert]);

  useEffect(() => {
    getData();
    getRosterTypes();
  }, [getData, getRosterTypes]);

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
              name="size"
              placeholder="Inventory to show"
              selectedValue={filters.size || rosterTypes[0]}
              onSelect={handleFilterChange}
              defaultOptions={rosterTypes}
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

export default connect(null, mapDispatchToProps)(RostersList);
