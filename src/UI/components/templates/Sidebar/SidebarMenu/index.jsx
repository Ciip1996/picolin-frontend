// @flow
import React from 'react';
import { EntityRoutes } from 'routes/constants';
import CategoryIcon from '@mui/icons-material/Category';
import {
  InventoryIcon,
  TransfersIcon,
  SalesIcon,
  PaymentIcon,
  ProductNamesIcon,
  WarehouseIcon,
  ProductsIcon
} from 'UI/res/icons';
import { colors } from 'UI/res';
import {
  userHasAdminOrManagerPermissions,
  userHasEmployeePermissions
} from 'services/Authorization';
import Contents from './strings';

const isUserEmployee = userHasEmployeePermissions();
const isUserManagerOrAdmin = userHasAdminOrManagerPermissions();

const language =
  localStorage.getItem('language') || process.env.REACT_APP_DEFAULT_LANGUAGE;

const sideBarMenu = [
  {
    title: Contents[language].warehouse,
    route: 'warehouse',
    icon: {
      inactive: <WarehouseIcon fill={colors.oxford} />,
      opened: <WarehouseIcon fill={colors.oxford} />,
      active: <WarehouseIcon fill={colors.oxford} />
    },
    subItems: [
      {
        title: Contents[language].inventory,
        route: EntityRoutes.Inventory,
        icon: {
          inactive: <InventoryIcon fill={colors.oxford} />,
          opened: null,
          active: <InventoryIcon fill={colors.white} />
        },
        display: isUserEmployee
      },
      {
        title: Contents[language].products,
        route: EntityRoutes.Products,
        icon: {
          inactive: <ProductsIcon fill={colors.oxford} />,
          opened: null,
          active: <ProductsIcon fill={colors.white} />
        },
        display: isUserManagerOrAdmin
      },
      {
        title: Contents[language].names,
        route: EntityRoutes.ProductNames,
        icon: {
          inactive: <ProductNamesIcon fill={colors.oxford} />,
          opened: null,
          active: <ProductNamesIcon fill={colors.white} />
        },
        display: isUserManagerOrAdmin
      },
      {
        title: Contents[language].productTypes,
        route: EntityRoutes.ProductTypes,
        icon: {
          inactive: <CategoryIcon fill={colors.oxford} />,
          opened: null,
          active: <CategoryIcon fill={colors.white} />
        },
        display: isUserManagerOrAdmin
      }
    ],
    display: isUserEmployee
  },
  {
    title: Contents[language].sales,
    route: EntityRoutes.Sales,
    icon: {
      inactive: <SalesIcon fill={colors.oxford} />,
      opened: null,
      active: <SalesIcon fill={colors.white} />
    },
    display: isUserEmployee
  },

  {
    title: Contents[language].payments,
    route: EntityRoutes.Payments,
    icon: {
      inactive: <PaymentIcon fill={colors.oxford} />,
      opened: null,
      active: <PaymentIcon fill={colors.white} />
    },
    display: isUserEmployee
  },
  {
    title: Contents[language].transfers,
    route: EntityRoutes.Transfers,
    icon: {
      inactive: <TransfersIcon fill={colors.oxford} />,
      opened: null,
      active: <TransfersIcon fill={colors.white} />
    },
    display: isUserManagerOrAdmin
  }
];

export default sideBarMenu;
