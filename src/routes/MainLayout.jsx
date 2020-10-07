// @flow
import React, { useEffect } from 'react';
import ScrollToTop from 'react-router-scroll-top';

import Sidebar from 'UI/components/templates/Sidebar';
import NavBar from 'UI/components/organisms/NavBar';
import ButtonMenu from 'UI/components/molecules/ButtonMenu';

import { AddIcon, colors, CandidatesIcon, CompaniesIcon, JobOrdersIcon, AddNameIcon } from 'UI/res';
import { globalStyles } from 'GlobalStyles';
import { EntityRoutes } from 'routes/constants';
import { sideBarWidth, navBarHeight } from 'UI/constants/dimensions';

import { FeatureFlags } from 'UI/constants/featureFlags';
import { getFeatureFlags } from 'UI/utils';

import { checkNotificationPermission } from 'services/FirebaseMessaging';

const featureFlags = getFeatureFlags();

// eslint-disable-next-line no-unused-vars
const MainLayout = ({ children, ...rest }: Object) => {
  useEffect(() => {
    featureFlags.includes(FeatureFlags.Notifications) && checkNotificationPermission();
  }, []);

  const MenuItems = [
    {
      icon: <CandidatesIcon />,
      title: 'Candidate',
      link: EntityRoutes.CandidateCreate,
      visible: true
    },
    {
      icon: <CompaniesIcon />,
      title: 'Company',
      link: EntityRoutes.CompanyCreate,
      visible: true
    },
    {
      icon: <JobOrdersIcon />,
      title: 'Job Order',
      link: EntityRoutes.JobOrderCreate,
      visible: true
    },
    {
      icon: <AddNameIcon />,
      title: 'Name',
      link: EntityRoutes.NameCreate,
      visible: featureFlags.includes(FeatureFlags.Names)
    }
  ];
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
              <ButtonMenu MenuItems={MenuItems} text="Add" width="200px">
                <AddIcon fill={colors.white} size={18} />
              </ButtonMenu>
            </Sidebar>
          </div>
          {children}
        </div>
      </div>
    </ScrollToTop>
  );
};

export default MainLayout;
