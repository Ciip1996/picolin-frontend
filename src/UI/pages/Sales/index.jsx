// @flow
import React, { useState, useEffect, useCallback } from 'react';
import queryString from 'query-string';
import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';
// import NumberFormat from 'react-number-format';

// import queryString from 'query-string';
import { connect } from 'react-redux';

import { FormControl } from '@material-ui/core';

import { showAlert } from 'actions/app';

/** Atoms, Components and Styles */
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';

/** Components */
import DataTable from 'UI/components/organisms/DataTable';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';

/** API / EntityRoutes / Endpoints / EntityType */
import API from 'services/API';

// import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorMessage } from 'UI/utils';
import type { Filters } from 'types/app';

import ListPageLayout from 'UI/components/templates/ListPageLayout';
import { saveFilters, getFilters } from 'services/FiltersStorage';
import { PageTitles } from 'UI/constants/defaults';
import Contents from './strings';

const CellSkeleton = ({ children, searching }) => {
  return searching ? <CustomSkeleton width="90%" height={18} /> : <>{children}</>;
};

type SalesListProps = {
  onShowAlert: any => void
};

const columnItems = [
  { id: 0, name: 'idSale', display: true },
  { id: 1, name: 'date', display: true },
  { id: 2, name: 'total', display: true },
  { id: 3, name: 'paymentMethod', display: true },
  { id: 4, name: 'store', display: true },
  { id: 5, name: 'invoice', display: true },
  { id: 6, name: 'quantity', display: true }
];

const getSortDirections = (orderBy: string, direction: string) =>
  columnItems.map(item => (item.name === orderBy ? direction : 'none'));

const SalesList = (props: SalesListProps) => {
  const { onShowAlert } = props;
  const language = localStorage.getItem('language');

  const [error, setError] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<any>([{}]);
  const [count, setCount] = useState(0);

  const payment = [
    { id: 0, title: Contents[language]?.cash },
    { id: 1, title: Contents[language]?.card }
  ];

  const invoice = [
    { id: 0, title: Contents[language]?.no },
    { id: 1, title: Contents[language]?.yes }
  ];

  const init = [
    { id: 0, title: Contents[language]?.day },
    { id: 1, title: Contents[language]?.week },
    { id: 2, title: Contents[language]?.month }
  ];

  const savedSearch = getFilters('ventas');
  const savedFilters = savedSearch?.filters;
  const savedParams = savedSearch?.params;

  // const genders = [
  // { id: 0, title: Contents[language]?.Girl },
  // { id: 1, title: Contents[language]?.Boy }
  // ];

  // const genders = [
  // { id: 0, title: Contents[language]?.Girl },
  // { id: 1, title: Contents[language]?.Boy }
  // ];

  const [filters, setFilters] = useState<Filters>(savedFilters || {});

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
      const { store_filter, date_filter = {}, payment_filter = {}, invoice_filter = {} } = filters;

      const params = {
        keyword: uiState.keyword || undefined,
        // orderBy: uiState.orderBy,
        page: uiState.page + 1,
        perPage: uiState.perPage,
        date: date_filter?.title || undefined,
        paymentMethod: payment_filter?.title || undefined,
        store: store_filter?.id || undefined,
        invoice: invoice_filter?.id || undefined
      };

      saveFilters('ventas', { filters, params });

      const queryParams = queryString.stringify(params);
      const url = `${Endpoints.Sales}${Endpoints.GetSales}?`.replace(
        ':idStore',
        store_filter ? store_filter?.id : 'ALL'
      );

      const response = await API.get(`${url}${queryParams}`);

      if (response?.status === 200) {
        setData(response?.data?.sales || []);
      }
      setCount(Number(response?.data?.totalResults) || 0);
      setLoading(false);
      setSearching(false);
      setError(false);
    } catch (err) {
      // console.log(err);
      setError(true);
      onShowAlert({
        severity: 'error',
        title: Contents[language]?.pageTitle,
        autoHideDuration: 3000,
        body: getErrorMessage(err)
      });
    }
  }, [filters, onShowAlert, uiState.keyword, uiState.page, uiState.perPage, language]);

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
    // history.push(EntityRoutes.CandidateProfile.replace(':id', id));
  };

  const sortDirection = getSortDirections(uiState.orderBy, uiState.direction);

  const columns = [
    {
      name: 'idSale',
      options: {
        filter: true,
        sort: false,
        display: 'excluded',
        filterType: 'custom'
      }
    },
    {
      name: 'date',
      label: Contents[language]?.labDate,
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
      name: 'total',
      label: Contents[language]?.labTotal,
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
      name: 'paymentMethod',
      label: Contents[language]?.labPayment,
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
                  name="payment_filter"
                  placeholder={Contents[language]?.labPayment}
                  // url={Endpoints.Sales}
                  selectedValue={filters.payment_filter}
                  // renderOption={option => (
                  //   <>
                  //     {statusStartAdornment('')}
                  //     &nbsp;
                  //     <span>{option.title && option.title}</span>
                  //   </>
                  // )}
                  onSelect={handleFilterChange}
                  defaultOptions={payment}
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
      name: 'store',
      label: Contents[language]?.labStore,
      options: {
        filter: true,
        sort: true,
        display: columnItems[3].display,
        sortDirection: sortDirection[3],
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="store_filter"
                  placeholder={Contents[language]?.labStore}
                  url={Endpoints.Stores}
                  selectedValue={filters.store_filter}
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        },
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value?.title}</CellSkeleton>;
        }
      }
    },
    {
      name: 'invoice',
      label: Contents[language]?.labInvoice,
      options: {
        filter: true,
        sort: true,
        display: columnItems[4].display,
        sortDirection: sortDirection[4],
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="invoice_filter"
                  placeholder={Contents[language]?.labInvoice}
                  selectedValue={filters.invoice_filter}
                  // renderOption={option => {
                  //   console.log(option);
                  //   return <span>{option === 0 ? 'NO' : 'SI'}</span>;
                  // }}
                  defaultOptions={invoice}
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
      name: 'quantity',
      label: Contents[language]?.labQuantity,
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
    document.title = PageTitles.Sales;
    getData();
  }, [error, getData]);

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={loading}
        title={Contents[language]?.pageTitle}
        selector={
          <AutocompleteSelect
            name="date_filter"
            placeholder={Contents[language]?.pageTitle}
            url={Endpoints.Stores}
            selectedValue={filters.date_filter}
            onSelect={handleFilterChange}
            defaultOptions={init}
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
    </ContentPageLayout>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(SalesList);
