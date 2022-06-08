// @flow
import React, { useState, useEffect, useCallback } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';

/** Atoms, Components and Styles */
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
// import ModifyInventoryDrawer from 'UI/components/organisms/ModifyInventoryDrawer';
import FeedInventoryDrawer from 'UI/components/organisms/FeedInventoryDrawer';
import QRCodeDrawer from 'UI/components/organisms/QRCodeDrawer';
import ActionButton from 'UI/components/atoms/ActionButton';
import { showAlert, confirm as confirmAction } from 'actions/app';
import { drawerAnchor, PageTitles } from 'UI/constants/defaults';
import { userHasAdminOrManagerPermissions } from 'services/Authorization';

/** API / EntityRoutes / Endpoints / EntityType */
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorData } from 'UI/utils';
import type { Filters } from 'types/app';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import { saveFilters, getFilters } from 'services/FiltersStorage';
import { AddIcon, colors } from 'UI/res';
import InventoryTableAdapter from 'UI/pages/Inventory/InventoryTableAdapter';
import Contents from './strings';
import { type UIStateInventory } from './types';

type InventoryListProps = {
  onShowAlert: any => void
};

const InventoryList = (props: InventoryListProps) => {
  const { onShowAlert } = props;
  const language = localStorage.getItem('language');

  const isUserAdminOrManager = userHasAdminOrManagerPermissions();
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(false);

  const [data, setData] = useState<any>(null);
  const [count, setCount] = useState(0);

  const savedSearch = getFilters('inventory');
  const savedFilters = savedSearch?.filters;
  const savedParams = savedSearch?.params;
  const [filters, setFilters] = useState<Filters>(savedFilters || {});

  const defaultValue: UIStateInventory = {
    keyword: savedParams?.keyword,
    orderBy: savedParams?.orderBy,
    direction: savedParams?.direction,
    page: savedParams?.page - 1 || 0,
    perPage: savedParams?.perPage || 10,
    isQRCodeDrawerOpen: false,
    isDeleteModal: false,
    isModifyInventoryDrawer: false,
    selectedProduct: null,
    isFeedInventoryDrawerOpen: isUserAdminOrManager && false
  };

  const [uiState, setUiState] = useState<UIStateInventory>(defaultValue);

  const toggleDrawer = (drawer: string, open: boolean) => event => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setUiState((prevState: UIStateInventory) => ({
      ...prevState,
      [drawer]: open
    }));
  };

  const getData = useCallback(async () => {
    try {
      const {
        store_filter,
        gender_filter = undefined,
        material_filter = undefined,
        type_filter = undefined,
        color_filter = undefined,
        stock_filter = undefined,
        minSalePrice_filter = undefined,
        maxSalePrice_filter = undefined,
        minCost_filter = undefined,
        maxCost_filter = undefined,
        status_filter = undefined
      } = filters;

      const params = {
        keyword: uiState.keyword,
        orderBy: uiState.orderBy,
        direction: uiState.direction,
        page: uiState.page + 1,
        perPage: uiState.perPage,
        gender: gender_filter?.id,
        material: material_filter?.title,
        idType: type_filter?.id,
        color: color_filter?.title,
        stock: stock_filter?.numberValue,
        minSalePrice: minSalePrice_filter?.numberValue,
        maxSalePrice: maxSalePrice_filter?.numberValue,
        minCost: minCost_filter?.numberValue,
        maxCost: maxCost_filter?.numberValue,
        status: status_filter?.id
      };

      saveFilters('inventory', { filters, params });

      const queryParams = queryString.stringify(params);
      const url = `${Endpoints.Inventory}${Endpoints.GetInventory}?`.replace(
        ':idStore',
        store_filter ? store_filter?.id : 'ALL'
      );

      const response = await API.get(`${url}${queryParams}`);
      if (response?.status === 200) {
        setData(response?.data?.inventory || []);
      } else if (response?.status === 500) {
        setError(true);
      }
      setCount(Number(response?.data?.totalResults) || 0);
      setLoading(false);
      setSearching(false);
      setError(false);
    } catch (err) {
      const { title, message, severity } = getErrorData(err);
      setError(true);
      setData([]);
      setLoading(false);
      setSearching(false);
      onShowAlert({
        severity,
        title,
        autoHideDuration: 3000,
        body: message
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

  const handleSearchChange = newKeyword => {
    const purgedKeyword = newKeyword && newKeyword.replace(/'/g, '');
    setSearching(true);
    setUiState(prevState => ({
      ...prevState,
      keyword: purgedKeyword === '' ? undefined : purgedKeyword,
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

  const onInventoryInserted = () => {
    setUiState(prevState => ({
      ...prevState,
      isQRCodeDrawerOpen: false,
      isFeedInventoryDrawerOpen: false
    }));
  };

  const onRowsSelect = (currentRowsSelected: Array<any>) => {
    const { dataIndex } = currentRowsSelected[0];
    const selectedProduct = data[dataIndex];
    setUiState(prevState => ({
      ...prevState,
      selectedProduct: selectedProduct || null
    }));
  };

  const handleColumnSortClick = ({ orderBy, direction }) => {
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

  useEffect(() => {
    if (error) {
      setData([]);
      setSearching(false);
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    document.title = PageTitles.Inventory;
    getData();
  }, [getData]);

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={loading}
        title={Contents[language]?.labInventory}
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
            <AutocompleteSelect
              name="store_filter"
              placeholder={Contents[language]?.labInventory}
              url={Endpoints.Stores}
              selectedValue={filters.store_filter}
              onSelect={handleFilterChange}
            />
            {isUserAdminOrManager && (
              <ActionButton
                text={Contents[language]?.feedInventory}
                onClick={toggleDrawer(
                  'isFeedInventoryDrawerOpen',
                  !uiState.isFeedInventoryDrawerOpen
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
        <InventoryTableAdapter
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
      </ListPageLayout>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isQRCodeDrawerOpen}
        onClose={toggleDrawer('isQRCodeDrawerOpen', false)}
      >
        <div role="presentation">
          <QRCodeDrawer
            selectedProduct={uiState.selectedProduct}
            onShowAlert={onShowAlert}
            handleClose={toggleDrawer('isQRCodeDrawerOpen', false)}
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
            onInventoryInserted={onInventoryInserted}
            onShowAlert={onShowAlert}
            handleClose={() => {
              setUiState(prevState => ({
                ...prevState,
                isFeedInventoryDrawerOpen: false,
                rowsSelected: []
              }));
            }}
          />
        </div>
      </Drawer>
    </ContentPageLayout>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert)),
    showConfirm: confirmation => dispatch(confirmAction(confirmation))
  };
};

export default connect(null, mapDispatchToProps)(InventoryList);
