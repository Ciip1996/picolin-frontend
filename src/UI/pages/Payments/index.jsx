// @flow
import React, { useState, useEffect, useCallback } from 'react';

import queryString from 'query-string';
import { connect } from 'react-redux';
import moment from 'moment';

import { FormControl } from '@material-ui/core';
import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';
import ActionButton from 'UI/components/atoms/ActionButton';
import CustomDatePicker from 'UI/components/atoms/CustomDatePicker';
import { currencyFormatter, getErrorData, toLocalTime } from 'UI/utils';

import { showAlert } from 'actions/app';
import { drawerAnchor, PageTitles, DateFormats } from 'UI/constants/defaults';

/** Atoms, Components and Styles */

/** Components */
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import DataTable from 'UI/components/organisms/DataTable';
import PaymentDrawer from 'UI/components/organisms/PaymentDrawer';
import Drawer from '@material-ui/core/Drawer';

/** API / EntityRoutes / Endpoints / EntityType */
import Box from '@material-ui/core/Box';
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';

import type { Filters } from 'types/app';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import { getFilters, saveFilters } from 'services/FiltersStorage';
import { AddIcon, colors } from 'UI/res';

import Contents from './strings';

const CellSkeleton = ({ children, searching }) => {
  return searching ? <CustomSkeleton width="90%" height={18} /> : <>{children}</>;
};

type PaymentListProps = {
  onShowAlert: any => void
};

const columnItems = [
  { id: 0, name: 'idpayment', display: true },
  { id: 1, name: 'user', display: true },
  { id: 2, name: 'concept', display: true },
  { id: 3, name: 'category', display: true },
  { id: 4, name: 'cost', display: true },
  { id: 5, name: 'date', display: true },
  { id: 6, name: 'store', display: true }
];

const getSortDirections = (orderBy: string, direction: string) =>
  columnItems.map(item => (item.name === orderBy ? direction : 'none'));

const PaymentList = (props: PaymentListProps) => {
  const { onShowAlert } = props;
  const language = localStorage.getItem('language');

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(false);

  const [data, setData] = useState<any>(null);
  const [count, setCount] = useState(0);

  const savedSearch = getFilters('payments');
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
    isPaymentDrawerOpen: false
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
        // store_filter,
        store_filter = undefined,
        category_filter = undefined,
        date_filter = undefined,
        users_filter = undefined
      } = filters;

      const params = {
        keyword: uiState.keyword,
        orderBy: uiState.orderBy,
        direction: uiState.direction,
        page: uiState.page + 1,
        perPage: uiState.perPage,
        idCategory: category_filter?.id,
        date: getDateStringFromFilter(date_filter),
        idUser: users_filter?.id
      };

      saveFilters('payments', { filters, params });

      const queryParams = queryString.stringify(params);

      const url = `${Endpoints.Cashier}${Endpoints.StorePayments}?`.replace(
        ':idStore',
        store_filter ? store_filter?.id : 'ALL'
      );

      // const url = `${Endpoints.Cashier}${Endpoints.StorePayments}?:${store_filter}`;
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
        // title: Contents[language]?.pageTitle,
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
      name: 'idpayment',
      label: Contents[language]?.IdPayment,
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
                  name="users_filter"
                  placeholder={Contents[language]?.User}
                  url={Endpoints.Users}
                  selectedValue={filters.users_filter}
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
      name: 'concept',
      label: Contents[language]?.Concept,
      options: {
        filter: false,
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
      name: 'category',
      label: Contents[language]?.Category,
      options: {
        filter: true,
        sort: true,
        display: columnItems[3].display,
        sortDirection: sortDirection[3],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        },
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="category_filter"
                  placeholder={Contents[language]?.Category}
                  url={Endpoints.StorePaymentCategories}
                  selectedValue={filters.category_filter}
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'cost',
      label: Contents[language]?.Cost,
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
      name: 'date',
      label: Contents[language]?.date,
      options: {
        filter: true,
        sort: true,
        display: columnItems[5].display,
        sortDirection: sortDirection[5],
        filterType: 'custom',
        customBodyRender: value => {
          const localTime = toLocalTime(value);
          const formattedDate =
            localTime && localTime.format(DateFormats.International.SimpleDateTime);
          return (
            <CellSkeleton searching={searching}>
              <strong>{formattedDate || '--'}</strong>
            </CellSkeleton>
          );
        },
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <CustomDatePicker
                  label="Fecha"
                  name="date_filter"
                  value={filters?.date_filter?.date || null}
                  onDateChange={(name, date) =>
                    handleFilterChange(
                      name && name,
                      date && {
                        title: `En fecha ${
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
      name: 'store',
      label: Contents[language]?.Location,
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
                  name="store_filter"
                  placeholder={Contents[language]?.Location}
                  url={Endpoints.Stores}
                  selectedValue={filters.store_filter}
                  onSelect={handleFilterChange}
                />
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
    document.title = PageTitles.Payments;
    getData();
  }, [error, getData]);

  const onPaymentCompleted = () => {
    setUiState(prevState => ({ ...prevState, isPaymentDrawerOpen: false }));
    setSearching(true);
    setLoading(true);
    getData();
  };

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={loading}
        title={Contents[language]?.PageTitle}
        filters={filters}
        onFilterRemove={handleFilterRemove}
        onFiltersReset={handleResetFiltersClick}
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
            <ActionButton
              text={Contents[language]?.makePayment}
              onClick={toggleDrawer('isPaymentDrawerOpen', !uiState.isPaymentDrawerOpen)}
            >
              <AddIcon fill={colors.white} size={18} />
            </ActionButton>
          </Box>
        }
      >
        <DataTable
          error={error}
          loading={loading}
          data={data}
          orderBy={uiState.orderBy}
          direction={uiState.direction}
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
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isPaymentDrawerOpen}
        onClose={toggleDrawer('isPaymentDrawerOpen', false)}
      >
        <div role="presentation">
          <PaymentDrawer
            onRegisterPayment={onPaymentCompleted}
            onShowAlert={onShowAlert}
            handleClose={toggleDrawer('isPaymentDrawerOpen', false)}
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

export default connect(null, mapDispatchToProps)(PaymentList);
