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
import QRCodeDrawer from 'UI/components/organisms/QRCodeDrawer';
import ProductsTableAdapter from 'UI/pages/Products/ProductsTableAdapter';
import ModifyProductDrawer from 'UI/components/organisms/ModifyProductDrawer';
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
    isQRCodeDrawerOpen: false,
    selectedProduct: null,
    isDeleteModal: false
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
        setData(response?.data?.names || []);
      }
      setCount(Number(response?.data?.totalResults) || 0);
      setLoading(false);
      setSearching(false);
      setError(false);
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

  const onRowsSelect = (currentRowsSelected: Array<any>) => {
    const { dataIndex } = currentRowsSelected[0];
    const selectedProduct = data[dataIndex];
    setUiState(prevState => ({
      ...prevState,
      selectedProduct: selectedProduct || null
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
    if (data?.length === 0) {
      setLoading(true);
      setSearching(true);
      getData();
    }
  }, [data, getData]);

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
              setData={setData}
              setUiState={setUiState}
              onRowsSelect={onRowsSelect}
              setSearching={setSearching}
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
          <AddProductDrawer
            onProductInserted={onProductInserted}
            onShowAlert={onShowAlert}
            handleClose={toggleDrawer('isAddProductDrawerOpen', false)}
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
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isModifyProductDrawerOpen}
        onClose={toggleDrawer('isModifyProductDrawerOpen', false)}
      >
        <div role="presentation">
          <ModifyProductDrawer
            onProductInserted={onProductInserted}
            onShowAlert={onShowAlert}
            handleClose={toggleDrawer('isModifyProductDrawerOpen', false)}
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
