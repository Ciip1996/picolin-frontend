// @flow
import React from 'react';
import { EntityRoutes } from 'routes/constants';
import {
  InventoryIcon,
  TransfersIcon,
  SalesIcon,
  PaymentIcon,
  ProductNamesIcon
  // TicketIcon
} from 'UI/res/icons';

import { colors } from 'UI/res';
import {
  userHasAdminOrManagerPermissions,
  userHasEmployeePermissions
} from 'services/Authorization';

const isUserEmployee = userHasEmployeePermissions();
const isUserManagerOrAdmin = userHasAdminOrManagerPermissions();

const sideBarMenu = [
  {
    title: 'Productos',
    route: 'products',
    icon: {
      inactive: <InventoryIcon fill={colors.oxford} />,
      opened: <InventoryIcon fill={colors.oxford} />,
      active: <InventoryIcon fill={colors.oxford} />
    },
    subItems: [
      {
        title: 'Inventario',
        route: EntityRoutes.Inventory,
        icon: {
          inactive: <InventoryIcon fill={colors.oxford} />,
          opened: null,
          active: <InventoryIcon fill={colors.white} />
        },
        display: isUserEmployee
      },
      {
        title: 'Nombres',
        route: EntityRoutes.ProductNames,
        icon: {
          inactive: <ProductNamesIcon fill={colors.oxford} />,
          opened: null,
          active: <ProductNamesIcon fill={colors.white} />
        },
        display: isUserManagerOrAdmin
      }
    ],
    display: isUserEmployee
  },
  {
    title: 'Ventas',
    route: EntityRoutes.Sales,
    icon: {
      inactive: <SalesIcon fill={colors.oxford} />,
      opened: null,
      active: <SalesIcon fill={colors.white} />
    },
    display: isUserEmployee
  },

  {
    title: 'Pagos',
    route: EntityRoutes.Payments,
    icon: {
      inactive: <PaymentIcon fill={colors.oxford} />,
      opened: null,
      active: <PaymentIcon fill={colors.white} />
    },
    display: isUserEmployee
  },
  {
    title: 'Transferencias',
    route: EntityRoutes.Transfers,
    icon: {
      inactive: <TransfersIcon fill={colors.oxford} />,
      opened: null,
      active: <TransfersIcon fill={colors.white} />
    },
    display: isUserManagerOrAdmin
  }
  // {
  //   title: 'Generador de Tickets',
  //   route: EntityRoutes.TicketGenerator,
  //   icon: {
  //     inactive: <TicketIcon fill={colors.oxford} />,
  //     opened: null,
  //     active: <TicketIcon fill={colors.white} />
  //   },
  //   display: isUserManagerOrAdmin
  // }
];

export default sideBarMenu;
