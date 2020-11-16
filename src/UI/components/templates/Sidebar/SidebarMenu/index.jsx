// @flow
import React from 'react';
import { EntityRoutes } from 'routes/constants';
import {
  InventoryIcon,
  // DashboardIcon,
  TransfersIcon,
  // DashboardActivityIcon,
  SalesIcon
} from 'UI/res/icons';

import { colors } from 'UI/res';
import { Roles } from 'UI/constants/roles';
import { userHasRole } from 'services/Authorization';

const isUserAdmin = userHasRole(Roles.Admin);
const sideBarMenu = [
  {
    title: 'Inventario',
    route: EntityRoutes.Inventory,
    icon: {
      inactive: <InventoryIcon fill={colors.oxford} />,
      opened: null,
      active: <InventoryIcon fill={colors.white} />
    }
  },
  {
    title: 'Ventas',
    route: EntityRoutes.Sales,
    icon: {
      inactive: <SalesIcon fill={colors.oxford} />,
      opened: null,
      active: <SalesIcon fill={colors.white} />
    }
  }

  // The following code is used for the collapsible menu:
  //   {
  //   title: 'Inventario',
  //   route: 'inventory',
  //   icon: {
  //     inactive: <InventoryIcon />,
  //     opened: <InventoryIcon  fill={colors.black} />,
  //     active: <InventoryIcon  fill={colors.black} />
  //   },
  //   subItems: inventorySubItems
  // }
];

isUserAdmin &&
  sideBarMenu.push(
    {
      title: 'Transferencias',
      route: EntityRoutes.Transfers,
      icon: {
        inactive: <TransfersIcon fill={colors.oxford} />,
        opened: null,
        active: <TransfersIcon fill={colors.white} />
      }
    }
    // {
    //   title: 'Dashboard',
    //   route: 'dashboard',
    //   icon: {
    //     inactive: <DashboardIcon />,
    //     opened: <DashboardIcon fill={colors.black} />,
    //     active: <DashboardIcon fill={colors.black} />
    //   },
    //   subItems: [
    //     {
    //       title: 'Activity',
    //       route: EntityRoutes.DashboardOverview,
    //       icon: {
    //         inactive: <DashboardActivityIcon />,
    //         opened: null,
    //         active: <DashboardActivityIcon fill={colors.completeBlack} />
    //       }
    //     }
    //   ]
    // }
  );

export default sideBarMenu;
