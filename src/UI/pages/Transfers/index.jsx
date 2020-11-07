// @flow
import React, { useState, useEffect, useCallback } from 'react';

import queryString from 'query-string';
import { connect } from 'react-redux';

import { FormControl } from '@material-ui/core';
import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';

import { showAlert } from 'actions/app';
import { drawerAnchor, PageTitles } from 'UI/constants/defaults';

/** Atoms, Components and Styles */

/** Components */
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import DataTable from 'UI/components/organisms/DataTable';
import TransferProductsDrawer from 'UI/components/molecules/TransferDrawer';
import Drawer from '@material-ui/core/Drawer';

/** API / EntityRoutes / Endpoints / EntityType */
// import Box from '@material-ui/core/Box';
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorMessage } from 'UI/utils';
import type { Filters } from 'types/app';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import { getFilters, saveFilters } from 'services/FiltersStorage';
// import ActionButton from 'UI/components/atoms/ActionButton';

import Contents from './strings';

const CellSkeleton = ({ children, searching }) => {
  return searching ? <CustomSkeleton width="90%" height={18} /> : <>{children}</>;
};

type TransferListProps = {
  onShowAlert: any => void
};

const columnItems = [
  { id: 0, name: 'idTransferProduct', display: true },
  { id: 1, name: 'user', display: true },
  { id: 2, name: 'productCode', display: true },
  { id: 3, name: 'type', display: true },
  { id: 4, name: 'color', display: true },
  { id: 5, name: 'origin', display: true },
  { id: 6, name: 'destination', display: true },
  { id: 7, name: 'quantity', display: true }
];

const getSortDirections = (orderBy: string, direction: string) =>
  columnItems.map(item => (item.name === orderBy ? direction : 'none'));

const TransferList = (props: TransferListProps) => {
  const { onShowAlert } = props;
  const language = localStorage.getItem('language');

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(false);

  const [data, setData] = useState<any>(null);
  const [count, setCount] = useState(0);

  const savedSearch = getFilters('transfers');
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
    keyword: savedParams?.keyword || null,
    orderBy: savedParams?.orderBy || null,
    direction: savedParams?.direction || null,
    page: savedParams?.page - 1 || 0,
    perPage: savedParams?.perPage || 10,
    isTransferDrawerOpen: true
  });

  const getData = useCallback(async () => {
    try {
      const { store_filter, gender_filter = {}, type_filter = {}, color_filter = {} } = filters;
      console.log(store_filter);
      const params = {
        keyword: uiState.keyword || undefined,
        // orderBy: uiState.orderBy,
        // page: uiState.page + 1,
        // perPage: uiState.perPage,
        gender: gender_filter?.title || undefined,
        type: type_filter?.title || undefined,
        color: color_filter?.title || undefined
      };

      saveFilters('transfers', { filters, params });

      const queryParams = queryString.stringify(params);
      // const url = `${Endpoints.Transfers}${Endpoints.GetTransfers}`.replace(
      //  ':idStore',
      //  store_filter ? store_filter?.idStore : 'ALL'
      // );
      const url = `${Endpoints.Transfers}/getTransfer`;
      const response = await API.get(`${url}${queryParams}`);
      if (response?.status === 200) {
        setData(response?.data || []);
      }
      setCount(Number(response?.data?.totalResults) || 0);
      setLoading(false);
      setSearching(false);
      setError(false);
    } catch (err) {
      setError(true);
      onShowAlert({
        severity: 'error',
        title: Contents[language]?.pageTitle,
        autoHideDuration: 3000,
        body: getErrorMessage(err)
      });
    }
  }, [filters, onShowAlert, uiState.keyword, language]);

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
      name: 'idTransferProduct',
      label: Contents[language]?.IdTransfer,
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
      name: 'user',
      label: Contents[language]?.User,
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
                  placeholder={Contents[language]?.User}
                  url={Endpoints.Colors}
                  selectedValue={filters.color_filter}
                  // renderOption={option => (
                  //   <>
                  //     {statusStartAdornment('')}
                  //     &nbsp;
                  //     <span>{option.title && option.title}</span>
                  //   </>
                  // )}
                  onSelect={handleFilterChange}
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
      name: 'productCode',
      label: Contents[language]?.Code,
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
      name: 'type',
      label: Contents[language]?.Type,
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
      name: 'color',
      label: Contents[language]?.Color,
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
      name: 'origin',
      label: Contents[language]?.Origin,
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
                  placeholder={Contents[language]?.origin}
                  selectedValue={filters.gender_filter}
                  onSelect={handleFilterChange}
                  // defaultOptions={genders}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'destination',
      label: Contents[language]?.Destination,
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
                  url="/getTypes"
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
      name: 'quantity',
      label: Contents[language]?.Quantity,
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
    document.title = PageTitles.Transfers;
    getData();
  }, [error, getData]);

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={loading}
        title={Contents[language]?.PageTitle}
        selector={
          <AutocompleteSelect
            name="store_filter"
            placeholder={Contents[language]?.labInventory}
            url={Endpoints.Stores}
            selectedValue={filters.store_filter}
            onSelect={handleFilterChange}
          />
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
          // page={uiState.page}
          // rowsPerPage={uiState.perPage}
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
        open={uiState.isTransferDrawerOpen}
        onClose={toggleDrawer('isTransferDrawerOpen', false)}
      >
        <div role="presentation">
          <div />
          <TransferProductsDrawer />
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

export default connect(null, mapDispatchToProps)(TransferList);
