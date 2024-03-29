// @flow
import * as React from 'react';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link, useLocation } from 'react-router-dom';
import Collapse from '@material-ui/core/Collapse';
import { Endpoints } from 'UI/constants/endpoints';
import API from 'services/API';
import { getErrorData, nestTernary } from 'UI/utils';

import { CollapsibleArrowOpen, CollapsibleArrowClosed } from 'UI/res';
import SalesSummary from 'UI/components/organisms/SalesSummary';
import {
  showAlert as showAlertAction,
  confirm as confirmAction
} from 'actions/app';
import { DEFAULT_STORE } from 'UI/constants/defaults';
import { isAuthenticated } from 'services/Authentication';

import { styles, useStyles, useSidebarStyles } from './styles';
import sideBarMenu from './SidebarMenu';

type SidebarProps = {
  children?: React.Node,
  showAlert: any => void
};

type SidebarIcon = {
  inactive: any,
  opened: any,
  active: any
};

type SidebarItemProps = {
  title: string,
  route: string,
  icon: SidebarIcon,
  subItems: Array<Object>
};

const isActiveItem = (item: SidebarItemProps, route) =>
  route.startsWith(item.route);

const isActiveParent = (item: SidebarItemProps, route) =>
  item.subItems && item.subItems.some(subitem => isActiveItem(subitem, route));

const getParent = route =>
  sideBarMenu
    .filter((menuItem: Object) => menuItem.subItems)
    .find((parent: Object) => isActiveParent(parent, route));

const Sidebar = (props: SidebarProps) => {
  const location = useLocation();
  const pathName = location.pathname;
  const { children, showAlert } = props;
  const [selectedRoute, setSelectedRoute] = useState(pathName);
  const [income, setIncome] = useState({
    cash: null,
    card: null
  });

  const classes = useStyles();
  const sidebarClasses = useSidebarStyles();

  const activeParent = getParent(selectedRoute);
  const [openedItems, setOpenedItems] = useState(
    activeParent ? [activeParent.route] : []
  );

  const SidebarItem = (RenderItemProps: Object) => {
    const { item } = RenderItemProps;
    const isActive = isActiveItem(item, selectedRoute);
    return (
      <ListItem
        style={!item.display ? { display: 'none' } : undefined}
        className={isActive ? sidebarClasses.itemSelected : sidebarClasses.item}
        button
        onClick={() => handleListItemClick(item)}
      >
        <div style={styles.iconWrapper}>
          <ListItemIcon>
            {isActive
              ? nestTernary(item.subItems, item.icon.opened, item.icon.active)
              : item.icon.inactive}
          </ListItemIcon>
        </div>
        <ListItemText
          className={sidebarClasses.label}
          disableTypography
          primary={item.title}
        />
      </ListItem>
    );
  };

  const SidebarSubitem = (SidebarSubitemProps: Object) => {
    const { item } = SidebarSubitemProps;
    return item.subItems.map(subitem => {
      const isActive = isActiveItem(subitem, selectedRoute);

      return (
        <Link
          key={subitem.route}
          to={subitem.route}
          className="nav-link router-link"
        >
          <ListItem
            style={!subitem.display ? { display: 'none' } : undefined}
            className={
              isActive
                ? sidebarClasses.subitemSelected
                : sidebarClasses.subitems
            }
            button
            onClick={() => handleListItemClick(subitem)}
          >
            <div style={styles.iconWrapper}>
              <ListItemIcon>
                {isActive ? subitem.icon.active : subitem.icon.inactive}
              </ListItemIcon>
            </div>
            <ListItemText
              className={sidebarClasses.label}
              disableTypography
              primary={subitem.title}
            />
          </ListItem>
        </Link>
      );
    });
  };

  useEffect(() => {
    setSelectedRoute(location.pathname);
    const parent = getParent(location.pathname);
    parent && setOpenedItems(prevState => [...prevState, parent.route]);
  }, [location.pathname]);

  useEffect(() => {
    const getData = async () => {
      try {
        if (!isAuthenticated()) {
          // if no authenticated return null
          return null;
        }
        const queryParams = queryString.stringify({
          idStore: DEFAULT_STORE.id
        });
        const response = await API.get(
          `${Endpoints.GetDayIncome}?${queryParams}`
        );
        if (response) {
          setIncome({
            card: response.data.find(each => each.paymentMethod === 'Tarjeta')
              ?.value,
            cash: response.data.find(each => each.paymentMethod === 'Efectivo')
              ?.value
          });
        }
      } catch (err) {
        const { title, message, severity } = getErrorData(err);
        showAlert({
          severity,
          title,
          autoHideDuration: 8000,
          body: message
        });
        throw err;
      }
      return null;
    };
    setInterval(getData, 10000);
    getData();
  }, [showAlert]);

  const toggleParent = route => {
    setOpenedItems(prevState => {
      return prevState.includes(route)
        ? prevState.filter(openedItem => openedItem !== route)
        : [...prevState, route];
    });
  };

  const handleListItemClick = item => {
    if (item.subItems) {
      toggleParent(item.route);
    }
  };
  return (
    <div style={styles.sideBarWrapper}>
      <div style={styles.itemWrapper}>{children}</div>
      <div className={classes.root}>
        <List component="nav">
          {sideBarMenu.map((item: Object) =>
            item.subItems ? (
              <div key={item.route} className="nav-link router-link">
                <ListItem
                  className={
                    openedItems.includes(item.route)
                      ? sidebarClasses.collapsibleMenu
                      : sidebarClasses.item
                  }
                  button
                  onClick={() => handleListItemClick(item)}
                >
                  <ListItemIcon>
                    {isActiveParent(item, selectedRoute)
                      ? item.icon.opened
                      : nestTernary(
                          openedItems.includes(item.route),
                          item.icon.active,
                          item.icon.inactive
                        )}
                  </ListItemIcon>
                  <ListItemText
                    className={sidebarClasses.label}
                    disableTypography
                    primary={item.title}
                  />
                  {openedItems.includes(item.route) ? (
                    <CollapsibleArrowClosed size={8} />
                  ) : (
                    <CollapsibleArrowOpen size={8} />
                  )}
                </ListItem>
                <Collapse
                  key={item.route}
                  in={openedItems.includes(item.route)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <SidebarSubitem item={item} />
                  </List>
                </Collapse>
              </div>
            ) : (
              <Link
                key={item.route}
                to={item.route}
                className="nav-link router-link"
              >
                <SidebarItem item={item} />
              </Link>
            )
          )}
        </List>
      </div>
      <SalesSummary cash={income.cash} card={income.card} />
    </div>
  );
};

Sidebar.defaultProps = {
  children: undefined
};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert)),
    showConfirm: confirmation => dispatch(confirmAction(confirmation))
  };
};

const SidebarConnected = connect(null, mapDispatchToProps)(Sidebar);

export default SidebarConnected;
