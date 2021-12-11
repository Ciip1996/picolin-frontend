// @flow
import React, { useState, Fragment } from 'react';

import { useHistory } from 'react-router-dom';

import CardActionArea from '@material-ui/core/CardActionArea';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import { type User } from 'types/app';
import { userHasAdminPermissions } from 'services/Authorization';

import {
  isAuthenticated,
  getCurrentUser,
  logout
} from 'services/Authentication';
import { FeatureFlags } from 'UI/constants/featureFlags';
import { getFeatureFlags } from 'UI/utils';

import { PicolinLogo, colors } from 'UI/res';

import CustomAvatar from 'UI/components/atoms/CustomAvatar';
// import CustomIconButton from 'UI/components/atoms/CustomIconButton';
// import GlobalSearchbar from 'UI/components/molecules/GlobalSearchbar';

import { drawerAnchor } from 'UI/constants/defaults';
import { EntityRoutes } from 'routes/constants';
import { useStyles, styles } from './styles';

const featureFlags = getFeatureFlags();

type NavBarProps = {
  handleCloseCashier: () => any
};

const NavBar = ({ handleCloseCashier }: NavBarProps) => {
  const user: User = isAuthenticated() ? getCurrentUser() : {};
  const isUserAdmin = userHasAdminPermissions();
  const classes = useStyles();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);

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

  const navigateToRegisterUserPage = e => {
    e.preventDefault();
    history.push(EntityRoutes.RegisterUser);
  };

  const goHome = e => {
    e.preventDefault();
    history.push('/');
  };

  return (
    <Fragment key={drawerAnchor}>
      <div className={classes.wrapper}>
        <div
          item="true"
          className={classes.divItem}
          style={styles.leftContainer}
        >
          <Link href="/" onClick={goHome}>
            <div style={{ marginLeft: 30 }}>
              <PicolinLogo />
            </div>
          </Link>
        </div>
        {/* <div item="true" className={classes.divItem} style={styles.middleContainer}>
          {location.pathname !== EntityRoutes.Home && (
            <div style={styles.searchbarWrapper}>
              <GlobalSearchbar />
            </div>
          )}
        </div> */}
        <div
          item="true"
          className={classes.divItem}
          style={styles.rightContainer}
        >
          <div className={classes.userCardWrapper}>
            <Box display="flex" position="relative">
              <CardActionArea
                onClick={handleOpenMenuClick}
                className={classes.userCard}
              >
                <div className={classes.name}>{user?.userName}</div>
                <CustomAvatar
                  acron={isUserAdmin ? 'ADM' : 'EMP'}
                  backgroundColor={
                    isUserAdmin ? colors?.primary : colors?.secondary
                  }
                />
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
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                )}
                {isUserAdmin ? (
                  <MenuItem
                    onClick={navigateToRegisterUserPage}
                    className={classes.menuLink}
                  >
                    Registrar Usuario
                  </MenuItem>
                ) : null}
                <MenuItem
                  onClick={handleCloseCashier}
                  className={classes.menuLink}
                >
                  Corte de Caja
                </MenuItem>
                <MenuItem onClick={handleLogout} className={classes.loginLink}>
                  Cerrar Sesión
                </MenuItem>
              </Menu>
            </Box>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NavBar;
