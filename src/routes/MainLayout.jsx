// @flow
import React from 'react';
import ScrollToTop from 'react-router-scroll-top';

import Sidebar from 'UI/components/templates/Sidebar';
import NavBar from 'UI/components/organisms/NavBar';
import ActionButton from 'UI/components/atoms/ActionButton';

import { AddIcon, colors } from 'UI/res';
import { globalStyles } from 'GlobalStyles';
import { sideBarWidth, navBarHeight } from 'UI/constants/dimensions';

// eslint-disable-next-line no-unused-vars
const MainLayout = ({ children, ...rest }: Object) => {
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
  return (
    <ScrollToTop>
      <div className="App" style={styles.App}>
        <NavBar />
        <div style={globalStyles.flexContentWrapper}>
          <div style={styles.sidebar}>
            <Sidebar>
              <ActionButton text="Nueva Venta">
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
