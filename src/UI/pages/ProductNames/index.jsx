// @flow
import React, { useState, useEffect, useCallback } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { FormControl, Box } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';

/** Atoms, Components and Styles */
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import DataTable from 'UI/components/organisms/DataTable';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import { getErrorData } from 'UI/utils';
import { colors, AddIcon } from 'UI/res';
import ActionButton from 'UI/components/atoms/ActionButton';
import AddProductNameDrawer from 'UI/components/organisms/AddProductNameDrawer';
import ModifyProductNameDrawer from 'UI/components/organisms/ModifyProductNameDrawer';

// import ViewProductNameDetails from 'UI/components/organisms/ViewProductNameDetails';
/** API / EntityRoutes / Endpoints / EntityType */
import API from 'services/API';
import type { Filters } from 'types/app';
import { drawerAnchor, PageTitles } from 'UI/constants/defaults';
import { Endpoints } from 'UI/constants/endpoints';
import { saveFilters, getFilters } from 'services/FiltersStorage';
import { showAlert } from 'actions/app';
import { userHasAdminOrManagerPermissions } from 'services/Authorization';
import StatusLabel, {
  StatusLabelOptions
} from 'UI/components/atoms/StatusLabel';
import CellSkeleton from 'UI/components/molecules/CellSkeleton';
import SelectedProductNameCustomToolbar, {
  type ProductName
} from './SelectedProductNameCustomToolbar';

import Contents from './strings';

const filter_name = 'product_names';

type ProductNamesListProps = {
  onShowAlert: any => {}
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

const ProductNamesList = (props: ProductNamesListProps) => {
  const { onShowAlert } = props;
  const language = localStorage.getItem('language');
  const isUserAdminOrManager = userHasAdminOrManagerPermissions();

  const [error, setError] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const [data, setData] = useState([{}]);
  const [count, setCount] = useState(0);

  const savedSearch = getFilters(filter_name);
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
    orderBy: savedParams?.orderBy || 'idName',
    direction: savedParams?.direction || 'asc',
    page: savedParams?.page - 1 || 0,
    perPage: savedParams?.perPage || 10,
    isAddProductNameDrawerOpen: false && isUserAdminOrManager,
    isModifyInventoryDrawer: false && isUserAdminOrManager,
    selectedProductName: {}
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

      saveFilters(filter_name, { filters, params });

      const queryParams = queryString.stringify(params);
      const url = `${Endpoints.ProductNames}${Endpoints.GetProductNames}?`;

      const response = await API.get(`${url}${queryParams}`);

      if (response?.status === 200) {
        setData(response?.data?.names || []);
      }
      setCount(Number(response?.data?.totalResults) || 0);
      setLoading(false);
      setSearching(false);
      setError(false);
      setRefresh(false);
    } catch (err) {
      const { title, message, severity } = getErrorData(err);
      setError(true);
      onShowAlert({
        severity,
        autoHideDuration: 3000,
        title,
        body: message || JSON.stringify(err)
      });
      throw err;
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

  const onRowsSelect = (currentRowsSelected: Array<any>) => {
    const { dataIndex } = currentRowsSelected[0];
    const selectedProduct = data[dataIndex];
    setUiState(prevState => ({
      ...prevState,
      selectedProduct: selectedProduct || null
    }));
  };

  const onProductNameInserted = productName => {
    setUiState(prevState => ({
      ...prevState,
      isAddProductNameDrawerOpen: false,
      isModifyInventoryDrawer: false,
      keyword: productName || undefined,
      page: 0,
      perPage: 10
    }));
    setRefresh(true);
  };

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

  // const getNameDetail = async (id: any) => {
  //   try {
  //     const response = await API.get(
  //       `${Endpoints.ProductNames}${Endpoints.GetProductNameDetailsByIdName}`.replace(
  //         ':id',
  //         id
  //       )
  //     );
  //     if (response.status === 200) {
  //       const detailedData = response.data;
  //       setSelectedProductName(detailedData);
  //       setUiState(prevState => ({
  //         ...prevState,
  //         isModifyInventoryDrawer: true
  //       }));
  //     }
  //   } catch (getSaleDetailError) {
  //     setError(true);
  //     onShowAlert({
  //       severity: 'error',
  //       autoHideDuration: 3000,
  //       title: getErrorData(getSaleDetailError).title,
  //       body: getErrorData(getSaleDetailError).message
  //     });
  //     throw getSaleDetailError;
  //   }
  // };

  const handleRowClick = () => {
    // (rowData: Object) => {
    // const { idName } = data[rowData.rowIndex];
    // getNameDetail(idName);
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
          return (
            <CellSkeleton searching={searching}>
              <StatusLabel value={value} />
            </CellSkeleton>
          );
        },
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="status_filter"
                  placeholder={Contents[language]?.labStatus}
                  selectedValue={filters.status_filter}
                  defaultOptions={StatusLabelOptions}
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
    if (refresh) {
      getData();
    }
  }, [getData, refresh]);

  useEffect(() => {
    if (error) {
      setData([]);
      setSearching(false);
      setLoading(false);
    }
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
                  'isAddProductNameDrawerOpen',
                  !uiState.isAddProductNameDrawerOpen
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
              onRowsSelect={onRowsSelect}
              setSearching={setSearching}
              selectableRows="single"
              customToolbarSelect={selectedRows => {
                if (data?.length === 0) return null;
                const selectedRowIndex = selectedRows?.data[0]?.index;
                const rowData = data[selectedRowIndex];
                const productName: ProductName = rowData;
                return (
                  <SelectedProductNameCustomToolbar
                    productName={productName}
                    setUiState={setUiState}
                    selectedRowIndex={selectedRowIndex}
                    setRefresh={setRefresh}
                  />
                );
              }}
            />
          </Box>
        </Box>
      </ListPageLayout>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isModifyInventoryDrawer}
        onClose={toggleDrawer('isModifyInventoryDrawer', false)}
      >
        <div role="presentation">
          <ModifyProductNameDrawer
            selectedProductName={uiState.selectedProductName}
            onProductNameInserted={onProductNameInserted}
            onShowAlert={onShowAlert}
            handleClose={toggleDrawer('isModifyInventoryDrawer', false)}
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isAddProductNameDrawerOpen}
        onClose={toggleDrawer('isAddProductNameDrawerOpen', false)}
      >
        <div role="presentation">
          <AddProductNameDrawer
            selectedProductName={{}}
            onProductNameInserted={onProductNameInserted}
            onShowAlert={onShowAlert}
            handleClose={toggleDrawer('isAddProductNameDrawerOpen', false)}
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

export default connect(null, mapDispatchToProps)(ProductNamesList);
