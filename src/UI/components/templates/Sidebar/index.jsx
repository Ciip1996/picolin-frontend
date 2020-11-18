// @flow
import React, { useState, useEffect } from 'react';
import queryString from 'query-string';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link, useLocation } from 'react-router-dom';
import Collapse from '@material-ui/core/Collapse';
import { Endpoints } from 'UI/constants/endpoints';
import API from 'services/API';

import { CollapsibleArrowOpen, CollapsibleArrowClosed } from 'UI/res';
import SalesSummary from 'UI/components/organisms/SalesSummary';

import { nestTernary } from 'UI/utils';
import { styles, useStyles, useSidebarStyles } from './styles';
import sideBarMenu from './SidebarMenu';

type SidebarProps = {
  children?: any
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

const isActiveItem = (item: SidebarItemProps, route) => route.startsWith(item.route);

const isActiveParent = (item: SidebarItemProps, route) =>
  item.subItems && item.subItems.some(subitem => isActiveItem(subitem, route));

const getParent = route =>
  sideBarMenu
    .filter((menuItem: Object) => menuItem.subItems)
    .find((parent: Object) => isActiveParent(parent, route));

const Sidebar = (props: SidebarProps) => {
  const location = useLocation();
  const pathName = location.pathname;
  const { children } = props;
  const [selectedRoute, setSelectedRoute] = useState(pathName);
  const [income, setIncome] = useState({
    cash: null,
    card: null
  });

  const classes = useStyles();
  const sidebarClasses = useSidebarStyles();

  const activeParent = getParent(selectedRoute);
  const [openedItems, setOpenedItems] = useState(activeParent ? [activeParent.route] : []);

  const SidebarItem = (RenderItemProps: Object) => {
    const { item } = RenderItemProps;
    const isActive = isActiveItem(item, selectedRoute);
    return (
      <ListItem
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
        <ListItemText className={sidebarClasses.label} disableTypography primary={item.title} />
      </ListItem>
    );
  };

  const SidebarSubitem = (SidebarSubitemProps: Object) => {
    const { item } = SidebarSubitemProps;

    return item.subItems.map(subitem => {
      const isActive = isActiveItem(subitem, selectedRoute);
      return (
        <Link key={subitem.route} to={subitem.route} className="nav-link router-link">
          <ListItem
            className={isActive ? sidebarClasses.subitemSelected : sidebarClasses.subitems}
            button
            onClick={() => handleListItemClick(subitem)}
          >
            <div style={styles.iconWrapper}>
              <ListItemIcon>{isActive ? subitem.icon.active : subitem.icon.inactive}</ListItemIcon>
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
    // GetDayIncome;
    const getData = async () => {
      try {
        const queryParams = queryString.stringify({
          idStore: 1
        });
        const response = await API.get(`${Endpoints.GetDayIncome}?${queryParams}`);
        if (response) {
          setIncome({
            cash: response.data.find(each => each.paymentMethod === 'Tarjeta')?.value,
            card: response.data.find(each => each.paymentMethod === 'Efectivo')?.value
          });
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('getIncome Error: ', err.response);
        // throw err;
      }
    };
    getData();
  }, []);

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
              <Link key={item.route} to={item.route} className="nav-link router-link">
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

export default Sidebar;
