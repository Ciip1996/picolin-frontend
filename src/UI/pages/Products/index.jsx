// @flow
import React, { useState, useEffect, useCallback } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { FormControl, Box } from '@material-ui/core';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';

/** Atoms, Components and Styles */
// import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import DataTable from 'UI/components/organisms/DataTable';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import { getErrorData } from 'UI/utils';
import { colors, AddIcon } from 'UI/res';
import ActionButton from 'UI/components/atoms/ActionButton';
import AddInventoryProductDrawer from 'UI/components/organisms/AddInventoryProductDrawer';

/** API / EntityRoutes / Endpoints / EntityType */
import API from 'services/API';
import type { Filters } from 'types/app';
import { drawerAnchor, PageTitles } from 'UI/constants/defaults';
import { Endpoints } from 'UI/constants/endpoints';
import { saveFilters, getFilters } from 'services/FiltersStorage';
import { showAlert } from 'actions/app';
import { userHasAdminOrManagerPermissions } from 'services/Authorization';
import Contents from './strings';

const CellSkeleton = ({ children, searching }) => {
  return searching ? (
    <CustomSkeleton width="90%" height={18} />
  ) : (
    <>{children}</>
  );
};

const ProductsListProps = {
  onShowAlert: PropTypes.func.isRequired
};

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
  { id: 13, name: 'observations', display: true }
];
const getSortDirections = (orderBy, direction) =>
  columnItems.map(item => (item.name === orderBy ? direction : 'none'));

const ProductsList = props => {
  const { onShowAlert } = props;
  const language = localStorage.getItem('language');
  const isUserAdminOrManager = userHasAdminOrManagerPermissions();

  const [error, setError] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([{}]);
  const [count, setCount] = useState(0);

  const savedSearch = getFilters('productos');
  const savedFilters = savedSearch?.filters;
  const savedParams = savedSearch?.params;

  const [filters, setFilters] = useState<Filters>(savedFilters || {});

  const toggleDrawer = (drawer: string, open: boolean) => event => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setUiState(prevState => ({ ...prevState, [drawer]: open }));
  };

  const [uiState, setUiState] = useState({
    keyword: savedParams?.keyword || undefined,
    orderBy: savedParams?.orderBy || 'idProduct',
    direction: savedParams?.direction || 'asc',
    page: savedParams?.page - 1 || 0,
    perPage: savedParams?.perPage || 10,
    isAddProductDrawerOpen: false && isUserAdminOrManager,
    isViewDetailsProductDrawerOpen: false
  });

  const getData = useCallback(async () => {
    try {
      const { provider_filter = undefined, status_filter } = filters;

      const params = {
        keyword: uiState.keyword,
        orderBy: uiState.orderBy,
        direction: uiState.direction,
        page: uiState.page + 1,
        perPage: uiState.perPage,
        providerId: provider_filter?.id,
        status: status_filter?.id
      };

      saveFilters('productos', { filters, params });

      const queryParams = queryString.stringify(params);
      const url = `${Endpoints.Products}${Endpoints.GetProducts}?`;

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

  const onProductInserted = () => {
    setUiState(prevState => ({
      ...prevState,
      isAddProductDrawerOpen: false
    }));
  };

  const handleSearchChange = newKeyword => {
    setSearching(true);
    setUiState(prevState => ({
      ...prevState,
      keyword: newKeyword,
      page: 0
    }));
  };

  // TODO: add filters and uncomment
  // const handleFilterChange = (name: string, value: any) => {
  //   setSearching(true);
  //   setFilters({ ...filters, [name]: value });
  //   setUiState(prevState => ({
  //     ...prevState,
  //     page: 0
  //   }));
  // };

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
    // (rowData: Object) => {
    // const { idProduct } = data[rowData.rowIndex];
  };

  const sortDirection = getSortDirections(uiState.orderBy, uiState.direction);

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
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
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
    document.title = PageTitles.Products;
    getData();
  }, [error, getData]);

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={loading}
        title={Contents[language]?.pageTitle}
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
            {isUserAdminOrManager && (
              <ActionButton
                text={Contents[language]?.addNewNameProduct}
                onClick={toggleDrawer(
                  'isAddProductDrawerOpen',
                  !uiState.isAddProductDrawerOpen
                )}
              >
                <AddIcon fill={colors.white} size={18} />
              </ActionButton>
            )}
          </Box>
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
        </Box>
      </ListPageLayout>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isAddProductDrawerOpen}
        onClose={toggleDrawer('isAddProductDrawerOpen', false)}
      >
        <div role="presentation">
          {/* TODO: test and check that this is working fine */}
          <AddInventoryProductDrawer
            onProductInserted={onProductInserted}
            onShowAlert={onShowAlert}
            handleClose={toggleDrawer('isAddProductDrawerOpen', false)}
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

ProductsList.propTypes = ProductsListProps;

export default connect(null, mapDispatchToProps)(ProductsList);
