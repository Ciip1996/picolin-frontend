// @flow
import React, { useState, Fragment } from 'react';

import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';

import CardActionArea from '@material-ui/core/CardActionArea';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from '@material-ui/core/Drawer';
import Link from '@material-ui/core/Link';

import { isAuthenticated, getCurrentUser, logout } from 'services/Authentication';
import { EntityRoutes } from 'routes/constants';
import { FeatureFlags } from 'UI/constants/featureFlags';
import { getFeatureFlags } from 'UI/utils';

import { GpacLogo, Operating10Icon, colors } from 'UI/res';

import CustomAvatar from 'UI/components/atoms/CustomAvatar';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import GlobalSearchbar from 'UI/components/molecules/GlobalSearchbar';
import NotificationPreview from 'UI/components/organisms/NotificationPreview';
import NotificationButton from 'UI/components/organisms/NotificationButton';
import OperatingDrawer from 'UI/components/organisms/OperatingDrawer';

import { drawerAnchor, DrawerName } from 'UI/constants/defaults';
import { useStyles, styles } from './styles';

const featureFlags = getFeatureFlags();

const NavBar = () => {
  const user = isAuthenticated() && getCurrentUser();
  const classes = useStyles();
  const location = useLocation();
  const { drawer } = queryString.parse(location.search);
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const [uiState, setUiState] = useState({
    isOperatingOpen: drawer === DrawerName.OperatingMetrics,
    areNotificationsOpen: drawer === DrawerName.Notifications || drawer === DrawerName.FeeAgreements
  });

  const handleOpenMenuClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const toggleDrawer = (activeDrawer, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setUiState(prevState => ({ ...prevState, [activeDrawer]: open }));
  };

  const goHome = e => {
    e.preventDefault();
    history.push('/');
  };

  return (
    <Fragment key={drawerAnchor}>
      <div className={classes.wrapper}>
        <div item="true" className={classes.divItem} style={styles.leftContainer}>
          <Link href="/" onClick={goHome}>
            <GpacLogo style={{ marginLeft: 50 }} width={140} height={43} />
          </Link>
        </div>
        <div item="true" className={classes.divItem} style={styles.middleContainer}>
          {location.pathname !== EntityRoutes.Home && (
            <div style={styles.searchbarWrapper}>
              <GlobalSearchbar />
            </div>
          )}
        </div>
        <div item="true" className={classes.divItem} style={styles.rightContainer}>
          <div className={classes.userCardWrapper}>
            {featureFlags.includes(FeatureFlags.Notifications) && (
              <NotificationButton onDrawerOpen={toggleDrawer('areNotificationsOpen', true)} />
            )}
            <Box display="flex" position="relative">
              <CardActionArea onClick={handleOpenMenuClick} className={classes.userCard}>
                <div className={classes.name}>{user?.personalInformation?.first_name}</div>
                <CustomAvatar acron={user?.initials} backgroundColor={user?.color} />
                <MoreVertIcon />
              </CardActionArea>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorReference="none"
                PaperProps={{
                  style: {
                    width: 150,
                    padding: 0,
                    right: 10,
                    top: 75
                  }
                }}
                MenuListProps={{
                  style: {
                    padding: 0
                  }
                }}
              >
                {featureFlags.includes(FeatureFlags.MenuNavBar) && (
                  <>
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                  </>
                )}

                <MenuItem onClick={handleLogout} className={classes.menuLink}>
                  Log Out
                </MenuItem>
              </Menu>
            </Box>
          </div>
        </div>
      </div>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.areNotificationsOpen}
        onClose={toggleDrawer('areNotificationsOpen', false)}
        BackdropProps={{ invisible: true }}
      >
        <NotificationPreview onClose={toggleDrawer('areNotificationsOpen', false)} />
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isOperatingOpen}
        onClose={toggleDrawer('isOperatingOpen', false)}
      >
        <div role="presentation">
          <OperatingDrawer onClose={toggleDrawer('isOperatingOpen', false)} />
        </div>
      </Drawer>
    </Fragment>
  );
};

export default NavBar;
