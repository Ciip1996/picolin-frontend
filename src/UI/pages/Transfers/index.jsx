// @flow
import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import Drawer from '@material-ui/core/Drawer';

import { showAlert } from 'actions/app';
import { drawerAnchor, PageTitles } from 'UI/constants/defaults';

/** Atoms, Components and Styles */

/** Components */
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import TransferProductsDrawer from 'UI/components/molecules/TransferDrawer';

/** API / EntityRoutes / Endpoints / EntityType */
import Box from '@material-ui/core/Box';

import ListPageLayout from 'UI/components/templates/ListPageLayout';
import { getFilters } from 'services/FiltersStorage';

import ActionButton from 'UI/components/atoms/ActionButton';

type TransfersListsProps = {
  onShowAlert: any => void
};

const TransfersLists = (props: TransfersListsProps) => {
  const { onShowAlert } = props;
  const history = useHistory();

  useEffect(() => {
    document.title = PageTitles.Sales;
  }, []);

  const [loading, setLoading] = useState(false);

  const savedSearch = getFilters('transferencias');
  const savedParams = savedSearch?.params;

  const [uiState, setUiState] = useState({
    keyword: savedParams?.keyword || '',
    orderBy: savedParams?.orderBy || '',
    direction: savedParams?.direction || '',
    page: savedParams?.page - 1 || 0,
    perPage: savedParams?.perPage || 10,
    isTransferDrawerOpen: true
  });

  const toggleDrawer = (drawer: string, open: boolean) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setUiState(prevState => ({ ...prevState, [drawer]: open }));
  };

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={loading}
        title="TRANSFERENCIAS"
        selector={
          <Box
            display="flex"
            flex={1}
            alignContent="center"
            justifyContent="center"
            flexDirection="column"
          >
            {/* <AutocompleteSelect
              name="userFilter"
              placeholder="Transferencias to show"
              selectedValue={filters.userFilter || filterOptions[0]}
              onSelect={handleFilterChange}
              defaultOptions={filterOptions}
            /> */}
            <ActionButton
              text="Transferir"
              onClick={toggleDrawer('isTransferDrawerOpen', !uiState.isTransferDrawerOpen)}
            />
          </Box>
        }
        // filters={filters}
        // onFilterRemove={handleFilterRemove}
        // onFiltersReset={handleResetFiltersClick}
      />
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isTransferDrawerOpen}
        onClose={toggleDrawer('isTransferDrawerOpen', false)}
      >
        <div role="presentation">
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

export default connect(null, mapDispatchToProps)(TransfersLists);
