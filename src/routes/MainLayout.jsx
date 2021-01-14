// @flow
import React, { useState } from 'react';
import ScrollToTop from 'react-router-scroll-top';
import { useHistory } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';

import Sidebar from 'UI/components/templates/Sidebar';
import NavBar from 'UI/components/organisms/NavBar';
import ActionButton from 'UI/components/atoms/ActionButton';
import CloseCashierDrawer from 'UI/components/organisms/CloseCashierDrawer';
import ConfirmCloseCashierDrawer from 'UI/components/organisms/ConfirmCloseCashierDrawer';

import { drawerAnchor } from 'UI/constants/defaults';

import { AddIcon, colors } from 'UI/res';
import { sideBarWidth, navBarHeight } from 'UI/constants/dimensions';
import { EntityRoutes } from 'routes/constants';

// eslint-disable-next-line no-unused-vars
const MainLayout = ({ children, ...rest }: Object) => {
  const history = useHistory();

  const [uiState, setUiState] = useState({
    isConfirmCloseCashierDrawerOpen: false,
    isCloseCashierDrawerOpen: false,
    closeCashierForm: {
      card: 21,
      cash: 10
    }
  });

  const styles = {
    App: {
      backgroundColor: colors.appBackground,
      height: '100%'
    },
    sidebar: {
      width: sideBarWidth,
      margin: 0,
      padding: 0,
      left: 0,
      bottom: 0,
      top: navBarHeight,
      overflow: 'hidden',
      position: 'fixed',
      zIndex: 101,
      borderRight: `1px solid ${colors.middleGrey}`,
      height: `calc(100% - ${navBarHeight}px)`
    },
    flexContentWrapper: {
      height: '100%',
      flex: 1,
      display: 'flex'
    }
  };

  const GoToNewPage = () => {
    history.push(EntityRoutes.NewSale);
  };

  const onCloseCashier = () => {
    setUiState(prevState => ({ ...prevState, isCloseCashierDrawerOpen: true }));
  };
  const onConfirmedCloseCashier = () => {
    setUiState(prevState => ({ ...prevState, isCloseCashierDrawerOpen: false }));
  };

  const onContinueWithCloseCashier = formData => {
    setUiState(prevState => ({
      ...prevState,
      isConfirmCloseCashierDrawerOpen: true,
      closeCashierForm: formData
    }));
  };

  const toggleDrawer = (drawer: string, open: boolean) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setUiState(prevState => ({ ...prevState, [drawer]: open }));
  };

  return (
    <>
      <ScrollToTop>
        <div className="App" style={styles.App}>
          <NavBar handleCloseCashier={onCloseCashier} />
          <div style={styles.flexContentWrapper}>
            <div style={styles.sidebar}>
              <Sidebar>
                <ActionButton
                  style={{ width: 200, minHeight: 48 }}
                  text="Nueva Venta"
                  onClick={GoToNewPage}
                  variant="important"
                >
                  <AddIcon fill={colors.white} size={18} />
                </ActionButton>
              </Sidebar>
            </div>
            {children}
          </div>
        </div>
      </ScrollToTop>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isCloseCashierDrawerOpen}
        onClose={toggleDrawer('isCloseCashierDrawerOpen', false)}
      >
        <div role="presentation">
          <CloseCashierDrawer
            onContinue={onContinueWithCloseCashier}
            onShowAlert={() => {}}
            handleClose={toggleDrawer('isCloseCashierDrawerOpen', false)}
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isConfirmCloseCashierDrawerOpen}
        onClose={toggleDrawer('isConfirmCloseCashierDrawerOpen', false)}
      >
        <div role="presentation">
          <ConfirmCloseCashierDrawer
            cashierData={uiState?.closeCashierForm ? uiState?.closeCashierForm : undefined}
            onConfirmedCloseCashier={onConfirmedCloseCashier}
            onShowAlert={() => {}}
            handleClose={toggleDrawer('isConfirmCloseCashierDrawerOpen', false)}
          />
        </div>
      </Drawer>
    </>
  );
};

export default MainLayout;
