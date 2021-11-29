// @flow
import React, { useState, useEffect, useCallback } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { FormControl, Box } from '@material-ui/core';
import PropTypes from 'prop-types';

/** Atoms, Components and Styles */
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import DataTable from 'UI/components/organisms/DataTable';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import ProductNamesDetailCard from 'UI/components/organisms/SalesDetailCard';
import { getErrorData } from 'UI/utils';

import Modal from '@material-ui/core/Modal';

/** API / EntityRoutes / Endpoints / EntityType */
import API from 'services/API';
import type { Filters } from 'types/app';
import { PageTitles } from 'UI/constants/defaults';
import { Endpoints } from 'UI/constants/endpoints';
import { saveFilters, getFilters } from 'services/FiltersStorage';
import { showAlert } from 'actions/app';
import Contents from './strings';

const CellSkeleton = ({ children, searching }) => {
  return searching ? (
    <CustomSkeleton width="90%" height={18} />
  ) : (
    <>{children}</>
  );
};

const ProductNamesListProps = {
  onShowAlert: PropTypes.func.isRequired
};

const columnItems = [
  { id: 0, name: 'idName', display: true },
  { id: 1, name: 'name', display: true },
  { id: 2, name: 'status', display: true },
  { id: 3, name: 'idProvider', display: true },
  { id: 4, name: 'provider', display: true }
];

const getSortDirections = (orderBy, direction) =>
  columnItems.map(item => (item.name === orderBy ? direction : 'none'));

const ProductNamesList = props => {
  const { onShowAlert } = props;
  const language = localStorage.getItem('language');

  const [error, setError] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([{}]);
  const [selectedSale, setSelectedSale] = useState({});
  const [openModal, setOpenModal] = React.useState(false);

  const [count, setCount] = useState(0);

  const handleOpenProject = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const savedSearch = getFilters('productos');
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

  const getData = useCallback(async () => {
    try {
      const {
        store_filter,
        date_filter = undefined,
        payment_filter = undefined,
        invoice_filter = undefined
      } = filters;

      const params = {
        keyword: uiState.keyword,
        orderBy: uiState.orderBy,
        direction: uiState.direction,
        page: uiState.page + 1,
        perPage: uiState.perPage,
        nameString: date_filter?.filterWord,
        idPaymentMethod: payment_filter?.id,
        store: store_filter?.id,
        invoice: invoice_filter?.id
      };

      saveFilters('productos', { filters, params });

      const queryParams = queryString.stringify(params);
      const url = `${Endpoints.Names}${Endpoints.GetProductNames}?`;

      const response = await API.get(`${url}${queryParams}`);

      if (response?.status === 200) {
        setData(response?.data?.names || []);
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
        `${Endpoints.ProductNames}${Endpoints.GetSaleDetailsByIdSale}`.replace(
          ':id',
          id
        )
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
    handleOpenProject();
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
      name: 'idName',
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
      name: 'name',
      label: Contents[language]?.labDate,
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
      name: 'status',
      label: Contents[language]?.labStatus,
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
                <AutocompleteSelect
                  name="status_filter"
                  placeholder={Contents[language]?.labStatus}
                  selectedValue={filters.status_filter}
                  defaultOptions={[
                    { id: 0, title: Contents[language]?.enabled },
                    { id: 1, title: Contents[language]?.disabled }
                  ]}
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'idProvider',
      label: Contents[language]?.labIdProvider,
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
                  name="provider_filter"
                  selectedValue={filters.provider_filter}
                  placeholder={Contents[language]?.labProvider}
                  url={Endpoints.Provider}
                  defaultOptions={[]}
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'provider',
      label: Contents[language]?.labProvider,
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
    }
  ];

  useEffect(() => {
    if (error) {
      setData([]);
      setSearching(false);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    document.title = PageTitles.ProductNames;
    getData();
  }, [error, getData]);

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={loading}
        title={Contents[language]?.pageTitle}
        selector={null}
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
        </Box>
      </ListPageLayout>
      <Modal
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex'
        }}
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ProductNamesDetailCard
          saleData={selectedSale}
          onCloseModal={handleCloseModal}
        />
      </Modal>
    </ContentPageLayout>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

ProductNamesList.propTypes = ProductNamesListProps;

export default connect(null, mapDispatchToProps)(ProductNamesList);
