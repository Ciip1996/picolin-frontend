// @flow
import React from 'react';
import { EntityRoutes } from 'routes/constants';
import {
  InventoryIcon,
  DirectoryIcon,
  CandidatesIcon,
  MapIcon,
  CompaniesIcon,
  JobOrdersIcon,
  HomeIcon,
  DashboardIcon,
  DashboardActivityIcon,
  NamesIcon,
  SearchProjectIcon,
  FeeAgreementIcon,
  SalesIcon
} from 'UI/res/icons';

import { colors } from 'UI/res';

import { FeatureFlags } from 'UI/constants/featureFlags';
import { getFeatureFlags } from 'UI/utils';

const featureFlags = getFeatureFlags();

const sideBarMenu = [
  {
    title: 'Ventas',
    route: EntityRoutes.Sales,
    icon: {
      inactive: <SalesIcon fill={colors.oxford} />,
      opened: null,
      active: <SalesIcon fill={colors.white} />
    }
  },
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
    title: 'Transferencias',
    route: EntityRoutes.Transfers,
    icon: {
      inactive: <InventoryIcon fill={colors.oxford} />,
      opened: null,
      active: <InventoryIcon fill={colors.white} />
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

featureFlags.includes(FeatureFlags.Dashboard) &&
  sideBarMenu.push({
    title: 'Dashboard',
    route: 'dashboard',
    icon: {
      inactive: <DashboardIcon />,
      opened: <DashboardIcon fill={colors.black} />,
      active: <DashboardIcon fill={colors.black} />
    },
    subItems: [
      {
        title: 'Activity',
        route: EntityRoutes.DashboardOverview,
        icon: {
          inactive: <DashboardActivityIcon />,
          opened: null,
          active: <DashboardActivityIcon fill={colors.completeBlack} />
        }
      }
    ]
  });

export default sideBarMenu;
