// @flow
import React, { useState, useEffect, useCallback } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { Box } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';

/** Atoms, Components and Styles */
// import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import { getErrorData } from 'UI/utils';
import { colors, AddIcon } from 'UI/res';
import ActionButton from 'UI/components/atoms/ActionButton';
import AddProductDrawer from 'UI/components/organisms/AddProductDrawer';
import FeedInventoryDrawer from 'UI/components/organisms/FeedInventoryDrawer';
import QRCodeDrawer from 'UI/components/organisms/QRCodeDrawer';
import ProductsTableAdapter from 'UI/pages/Products/ProductsTableAdapter';
/** API / EntityRoutes / Endpoints / EntityType */
import API from 'services/API';
import type { Filters } from 'types/app';
import { drawerAnchor, PageTitles } from 'UI/constants/defaults';
import { Endpoints } from 'UI/constants/endpoints';
import { saveFilters, getFilters } from 'services/FiltersStorage';
import { showAlert } from 'actions/app';
import { userHasAdminOrManagerPermissions } from 'services/Authorization';
import Contents from './strings';

import { type UIStateProduct } from './types';

type ProductsListProps = {
  onShowAlert: any => {}
};

const ProductsList = (props: ProductsListProps) => {
  const { onShowAlert } = props;
  const language = localStorage.getItem('language');
  const isUserAdminOrManager = userHasAdminOrManagerPermissions();

  const [error, setError] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

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

  const [uiState, setUiState] = useState<UIStateProduct>({
    keyword: savedParams?.keyword,
    orderBy: savedParams?.orderBy || 'idProduct',
    direction: savedParams?.direction || 'asc',
    page: savedParams?.page - 1 || 0,
    perPage: savedParams?.perPage || 10,
    isAddProductDrawerOpen: false && isUserAdminOrManager,
    isModifyProductDrawerOpen: false,
    isFeedInventoryDrawerOpen: false,
    isQRCodeDrawerOpen: false,
    selectedProduct: null,
    isDeleteModal: false,
    preloadedProduct: {},
    rowsSelected: undefined
  });

  const getData = useCallback(async () => {
    try {
      const {
        provider_filter = undefined,
        status_filter = undefined
      } = filters;

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
        setData(response?.data?.products || []);
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

  const onProductInserted = (selectedProduct: Object) => {
    setUiState(prevState => ({
      ...prevState,
      isQRCodeDrawerOpen: true,
      isAddProductDrawerOpen: false,
      selectedProduct
    }));
    setRefresh(true);
  };

  const onInventoryInserted = (inventoryId: number) => {
    setUiState(prevState => ({
      ...prevState,
      isQRCodeDrawerOpen: false,
      isAddProductDrawerOpen: false,
      isFeedInventoryDrawerOpen: false,
      insertedInventoryId: inventoryId
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

  const onRowsSelect = (currentRowsSelected: Array<any>) => {
    const { dataIndex } = currentRowsSelected[0];
    const selectedProduct = data[dataIndex];
    setUiState(prevState => ({
      ...prevState,
      selectedProduct: selectedProduct || null,
      rowsSelected: undefined
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

  const handleFilterChange = (name: string, value: any) => {
    setSearching(true);
    setFilters({ ...filters, [name]: value });
    setUiState(prevState => ({
      ...prevState,
      page: 0
    }));
  };

  useEffect(() => {
    if (error) {
      setData([]);
      setSearching(false);
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    document.title = PageTitles.Products;
    getData();
  }, [getData]);

  useEffect(() => {
    if (refresh) {
      getData();
    }
  }, [getData, refresh]);

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
                onClick={() => {
                  setUiState(prevState => ({
                    ...prevState,
                    isAddProductDrawerOpen: true,
                    selectedProduct: {}
                  }));
                }}
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
            <ProductsTableAdapter
              loading={loading}
              error={error}
              count={count}
              data={data || []}
              uiState={uiState}
              searching={searching}
              filters={filters}
              handleFilterChange={handleFilterChange}
              handleResetFiltersClick={handleResetFiltersClick}
              handleSearchChange={handleSearchChange}
              handleColumnSortClick={handleColumnSortClick}
              handlePerPageClick={handlePerPageClick}
              handlePageClick={handlePageClick}
              setRefresh={setRefresh}
              setUiState={setUiState}
              onRowsSelect={onRowsSelect}
              setSearching={setSearching}
              rowsSelected={uiState.rowsSelected || undefined}
            />
          </Box>
        </Box>
      </ListPageLayout>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isAddProductDrawerOpen}
        onClose={() => {
          setUiState(prevState => ({
            ...prevState,
            isAddProductDrawerOpen: false,
            selectedProduct: {},
            rowsSelected: []
          }));
        }}
      >
        <div role="presentation">
          <AddProductDrawer
            selectedProduct={uiState.selectedProduct}
            onProductInserted={onProductInserted}
            onShowAlert={onShowAlert}
            handleClose={() => {
              setUiState(prevState => ({
                ...prevState,
                isAddProductDrawerOpen: false,
                selectedProduct: {},
                rowsSelected: []
              }));
            }}
            isEditMode={false}
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isModifyProductDrawerOpen}
        onClose={() => {
          setUiState(prevState => ({
            ...prevState,
            isModifyProductDrawerOpen: false,
            selectedProduct: {},
            rowsSelected: []
          }));
        }}
      >
        <div role="presentation">
          <AddProductDrawer
            selectedProduct={uiState.selectedProduct}
            onProductInserted={onProductInserted}
            onShowAlert={onShowAlert}
            handleClose={() => {
              setUiState(prevState => ({
                ...prevState,
                isModifyProductDrawerOpen: false,
                selectedProduct: {},
                rowsSelected: []
              }));
            }}
            isEditMode
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isFeedInventoryDrawerOpen}
        onClose={() => {
          setUiState(prevState => ({
            ...prevState,
            isFeedInventoryDrawerOpen: false,
            selectedProduct: {},
            rowsSelected: []
          }));
        }}
      >
        <div role="presentation">
          <FeedInventoryDrawer
            preloadedProduct={uiState.selectedProduct}
            onInventoryInserted={onInventoryInserted}
            onShowAlert={onShowAlert}
            handleClose={() => {
              setUiState(prevState => ({
                ...prevState,
                isFeedInventoryDrawerOpen: false,
                selectedProduct: {},
                rowsSelected: []
              }));
            }}
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
            selectedProduct={uiState?.selectedProduct}
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

export default connect(null, mapDispatchToProps)(ProductsList);
