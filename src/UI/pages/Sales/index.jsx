// @flow
import React, { useState, useEffect, useCallback } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { FormControl, Box } from '@material-ui/core';
import moment from 'moment';

/** Atoms, Components and Styles */
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';
import CustomDatePicker from 'UI/components/atoms/CustomDatePicker';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import DataTable from 'UI/components/organisms/DataTable';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import SalesDetailCard from 'UI/components/organisms/SalesDetailCard';
import { toLocalTime, getErrorData } from 'UI/utils';

/** API / EntityRoutes / Endpoints / EntityType */
import API from 'services/API';
import { DateFormats, PageTitles } from 'UI/constants/defaults';

import { Endpoints } from 'UI/constants/endpoints';
import type { Filters } from 'types/app';
import { saveFilters, getFilters } from 'services/FiltersStorage';

import { showAlert } from 'actions/app';
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
  const [selectedSale, setSelectedSale] = useState({});

  const [count, setCount] = useState(0);

  const invoiceOptions = [
    { id: 0, title: Contents[language]?.no },
    { id: 1, title: Contents[language]?.yes }
  ];

  const dateSelectOptions = [
    { id: 0, title: Contents[language]?.day, filterWord: 'day' },
    { id: 1, title: Contents[language]?.week, filterWord: 'week' },
    { id: 2, title: Contents[language]?.month, filterWord: 'month' },
    { id: 3, title: Contents[language]?.year, filterWord: 'year' }
  ];

  const savedSearch = getFilters('ventas');
  const savedFilters = savedSearch?.filters;
  const savedParams = savedSearch?.params;

  const [filters, setFilters] = useState<Filters>(savedFilters || {});

  const [uiState, setUiState] = useState({
    keyword: savedParams?.keyword || undefined,
    orderBy: savedParams?.orderBy || undefined,
    direction: savedParams?.direction || undefined,
    page: savedParams?.page - 1 || 0,
    perPage: savedParams?.perPage || 10,
    isTransferDrawerOpen: true
  });

  const getDateStringFromFilter = (filterDate: any) => {
    if (filterDate) {
      return typeof filterDate.date === 'object'
        ? filterDate.date.format(DateFormats.SQL)
        : moment(filterDate.date).format(DateFormats.SQL);
    }
    return undefined;
  };

  const getData = useCallback(async () => {
    try {
      const {
        store_filter,
        date_filter = undefined,
        payment_filter = undefined,
        invoice_filter = undefined,
        startDate_filter,
        endDate_filter
      } = filters;

      const params = {
        keyword: uiState.keyword,
        orderBy: uiState.orderBy,
        direction: uiState.direction,
        page: uiState.page + 1,
        perPage: uiState.perPage,
        date: date_filter?.filterWord,
        idPaymentMethod: payment_filter?.id,
        store: store_filter?.id,
        invoice: invoice_filter?.id,
        initialDate: getDateStringFromFilter(startDate_filter),
        finalDate: getDateStringFromFilter(endDate_filter)
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
      const { response } = err;
      console.log(err, response);
      setError(true);
      onShowAlert({
        severity: 'error',
        // title: Contents[language]?.pageTitle,
        autoHideDuration: 3000,
        title: getErrorData(err)?.title || 'Error en conexión',
        body: getErrorData(err).message || JSON.stringify(err)
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

  const getSaleDetail = async (id: any) => {
    try {
      const response = await API.get(
        `${Endpoints.Sales}${Endpoints.GetSaleDetails}`.replace(':id', id)
      );
      if (response.status === 200) {
        const detailedData = { ...response.data };
        setSelectedSale(detailedData);
      }
    } catch (getSaleDetailError) {
      setError(true);
      onShowAlert({
        severity: 'error',
        autoHideDuration: 3000,
        title: getErrorData(getSaleDetailError).title,
        body: getErrorData(getSaleDetailError).message
      });
      throw getSaleDetailError;
    }
  };

  const handleRowClick = (rowData: Object) => {
    const { id } = data[rowData.rowIndex];
    getSaleDetail(id);
  };

  const sortDirection = getSortDirections(uiState.orderBy, uiState.direction);

  const columns = [
    {
      name: 'id',
      options: {
        filter: true,
        sort: false,
        print: false,
        display: 'excluded',
        filterType: 'custom'
      }
    },
    {
      name: 'idSale',
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
      name: 'date',
      label: Contents[language]?.labDate,
      options: {
        filter: true,
        sort: true,
        display: columnItems[1].display,
        sortDirection: sortDirection[1],
        customBodyRender: value => {
          const localTime = toLocalTime(value);
          const formattedDate =
            localTime && localTime.format(DateFormats.International.DetailDateTime);
          return (
            <CellSkeleton searching={searching}>
              <strong>{formattedDate}</strong>
            </CellSkeleton>
          );
        },
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <CustomDatePicker
                  label="Desde: "
                  name="startDate_filter"
                  value={filters?.startDate_filter?.date || null}
                  onDateChange={(name, date) =>
                    handleFilterChange(
                      name && name,
                      date && {
                        title: `Desde fecha ${
                          date ? date.format(DateFormats.International.DetailDate) : ''
                        }`,
                        date
                      }
                    )
                  }
                />
              </FormControl>
            );
          }
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
        display: columnItems[2].display,
        sortDirection: sortDirection[2],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        },
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <CustomDatePicker
                  label="Hasta"
                  name="endDate_filter"
                  value={filters?.endDate_filter?.date || null}
                  onDateChange={(name, date) =>
                    handleFilterChange(
                      name && name,
                      date && {
                        title: `Hasta fecha ${
                          date ? date.format(DateFormats.International.DetailDate) : ''
                        }`,
                        date
                      }
                    )
                  }
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'paymentMethod',
      label: Contents[language]?.labPayment,
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
                  name="payment_filter"
                  placeholder={Contents[language]?.labPayment}
                  url={Endpoints.PaymentMethods}
                  selectedValue={filters.payment_filter}
                  onSelect={handleFilterChange}
                  // defaultOptions={payment}
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
        display: columnItems[4].display,
        sortDirection: sortDirection[4],
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
        display: columnItems[5].display,
        sortDirection: sortDirection[5],
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="invoice_filter"
                  placeholder={Contents[language]?.labInvoice}
                  selectedValue={filters.invoice_filter}
                  defaultOptions={invoiceOptions}
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        },
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value ? 'SI' : 'NO'}</CellSkeleton>;
        }
      }
    },
    {
      name: 'quantity',
      label: Contents[language]?.labQuantity,
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
            defaultOptions={dateSelectOptions}
          />
        }
        filters={filters}
        onFilterRemove={handleFilterRemove}
        onFiltersReset={handleResetFiltersClick}
      >
        <Box display="flex" flex={1}>
          <Box flex={2}>
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
          </Box>
          <Box display="flex" flex={1} justifyContent="center">
            <SalesDetailCard saleData={selectedSale} />
          </Box>
        </Box>
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
