// @flow
import React from 'react';
import ScrollToTop from 'react-router-scroll-top';
import { useHistory } from 'react-router-dom';

import Sidebar from 'UI/components/templates/Sidebar';
import NavBar from 'UI/components/organisms/NavBar';
import ActionButton from 'UI/components/atoms/ActionButton';

import { AddIcon, colors } from 'UI/res';
import { globalStyles } from 'GlobalStyles';
import { sideBarWidth, navBarHeight } from 'UI/constants/dimensions';
import { EntityRoutes } from 'routes/constants';

// eslint-disable-next-line no-unused-vars
const MainLayout = ({ children, ...rest }: Object) => {
  const history = useHistory();

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
    }
  };

  const GoToNewPage = () => {
    history.push(EntityRoutes.NewSale);
  };

  return (
    <ScrollToTop>
      <div className="App" style={styles.App}>
        <NavBar />
        <div style={globalStyles.flexContentWrapper}>
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
  );
};

export default MainLayout;
