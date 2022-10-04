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
import LanguageIcon from '@mui/icons-material/Language';
import {
  isAuthenticated,
  getCurrentUser,
  logout
} from 'services/Authentication';
import { FeatureFlags } from 'UI/constants/featureFlags';
import { getFeatureFlags, useLanguage, useLocalStorage } from 'UI/utils';
import { PicolinLogo, colors } from 'UI/res';
import CustomAvatar from 'UI/components/atoms/CustomAvatar';
import { drawerAnchor } from 'UI/constants/defaults';
import { EntityRoutes } from 'routes/constants';
import { useStyles, styles } from './styles';
import Contents from './strings';

const featureFlags = getFeatureFlags();

type NavBarProps = {
  handleCloseCashier: () => any
};

const NavBar = ({ handleCloseCashier }: NavBarProps) => {
  // eslint-disable-next-line no-unused-vars
  const [locale, setLocale] = useLocalStorage('locale', '');
  // eslint-disable-next-line no-unused-vars
  const [localStorageLanguage, setLanguage] = useLocalStorage('language', '');

  const language = useLanguage();

  const user: User = isAuthenticated() ? getCurrentUser() : {};
  const isUserAdmin = userHasAdminPermissions();
  const classes = useStyles();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElLanguage, setAnchorElLanguage] = useState(null);

  const handleOpenMenuClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleOpenMenuLanguageClick = event => {
    setAnchorElLanguage(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseLanguage = () => {
    setAnchorElLanguage(null);
  };

  const handleSelectEnglishLanguage = () => {
    setLocale('en');
    setLanguage('English');
    window.location.reload();
  };

  const handleSelectSpanishLanguage = () => {
    setLocale('es');
    setLanguage('Spanish');
    window.location.reload();
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

  const getEmployeeColor: Function = () => {
    if (user.roleId === 0 && isUserAdmin) return colors?.navyBlue;
    if (user.roleId === 1 && isUserAdmin) return colors?.red;
    if (user.roleId === 2) return colors?.purple;
    if (user.roleId === 3) return colors?.primary;
    return colors?.secondary;
  };

  const getEmployeeAcron: Function = () => {
    if (user.roleId === 0 && isUserAdmin) return 'SUPER';
    if (user.roleId === 1 && isUserAdmin) return 'ADMIN';
    if (user.roleId === 3) return 'VENTA';
    if (user.roleId === 2) return 'ALMAC';
    return 'EMP';
  };
  const employeeAcron: string = getEmployeeAcron();
  const employeeColor: string = getEmployeeColor();
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
                onClick={handleOpenMenuLanguageClick}
                className={`${classes.userCard} + ${classes.languageContainer}`}
              >
                <LanguageIcon />
                <div className={classes.language}>LANG</div>
              </CardActionArea>
              <Menu
                id="language-menu"
                anchorEl={anchorElLanguage}
                keepMounted
                open={Boolean(anchorElLanguage)}
                onClose={handleCloseLanguage}
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
                <MenuItem
                  onClick={handleSelectEnglishLanguage}
                  disabled={language === 'English'}
                >
                  English / Inglés
                </MenuItem>
                <MenuItem
                  onClick={handleSelectSpanishLanguage}
                  disabled={language === 'Spanish'}
                >
                  Spanish / Español
                </MenuItem>
              </Menu>
            </Box>
          </div>
          <div className={classes.userCardWrapper}>
            <Box display="flex" position="relative">
              <CardActionArea
                onClick={handleOpenMenuClick}
                className={classes.userCard}
              >
                <div className={classes.name}>{user?.userName}</div>
                <CustomAvatar
                  style={{ fontSize: 11 }}
                  acron={employeeAcron}
                  backgroundColor={employeeColor}
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
                    {Contents[language]?.registerUser}
                  </MenuItem>
                ) : null}
                <MenuItem
                  onClick={handleCloseCashier}
                  className={classes.menuLink}
                >
                  {Contents[language]?.closeCashier}
                </MenuItem>
                <MenuItem onClick={handleLogout} className={classes.loginLink}>
                  {Contents[language]?.logOut}
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
