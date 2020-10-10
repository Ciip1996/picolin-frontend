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
  // DashboardIcon,
  // DashboardActivityIcon,
  NamesIcon,
  colors,
  SearchProjectIcon,
  FeeAgreementIcon
} from 'UI/res';

import { FeatureFlags } from 'UI/constants/featureFlags';
import { getFeatureFlags } from 'UI/utils';

const featureFlags = getFeatureFlags();

const inventorySubItems = [
  {
    title: 'Candidates',
    route: EntityRoutes.Candidates,
    icon: {
      inactive: <CandidatesIcon />,
      opened: null,
      active: <CandidatesIcon fill={colors.completeBlack} />
    }
  },
  {
    title: 'Job Orders',
    route: EntityRoutes.JobOrders,
    icon: {
      inactive: <JobOrdersIcon />,
      opened: null,
      active: <JobOrdersIcon fill={colors.completeBlack} />
    }
  }
];
!featureFlags.includes(FeatureFlags.Names) &&
  inventorySubItems.push({
    title: 'Companies', // TODO: remove this one and uncomment the others.
    route: EntityRoutes.Companies,
    icon: {
      inactive: <CompaniesIcon />,
      opened: null,
      active: <CompaniesIcon fill={colors.completeBlack} />
    }
  });

const sideBarMenu = [
  {
    title: 'Home',
    route: EntityRoutes.Home,
    subItems: null,
    icon: {
      inactive: <HomeIcon />,
      opened: <HomeIcon contrast={colors.iconInactive} fill={colors.black} />,
      active: <HomeIcon contrast={colors.red} fill={colors.black} />
    }
  },
  {
    title: 'Map',
    route: EntityRoutes.Map,
    subItems: null,
    icon: {
      inactive: <MapIcon />,
      opened: <MapIcon contrast={colors.iconInactive} fill={colors.black} />,
      active: <MapIcon contrast={colors.red} fill={colors.black} />
    }
  },
  {
    title: 'Inventory',
    route: 'inventory',
    icon: {
      inactive: <InventoryIcon />,
      opened: <InventoryIcon contrast={colors.red} fill={colors.black} />,
      active: <InventoryIcon contrast={colors.iconInactive} fill={colors.black} />
    },
    subItems: inventorySubItems
  }
  // {
  //   title: 'Dashboard',
  //   route: 'dashboard',
  //   icon: {
  //     inactive: <DashboardIcon />,
  //     opened: <DashboardIcon contrast={colors.red} fill={colors.black} />,
  //     active: <DashboardIcon contrast={colors.iconInactive} fill={colors.black} />
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
  // },
];

featureFlags.includes(FeatureFlags.Names) &&
  sideBarMenu.push({
    title: 'Contacts',
    route: 'contacts',
    icon: {
      inactive: <DirectoryIcon />,
      opened: <DirectoryIcon contrast={colors.red} fill={colors.black} />,
      active: <DirectoryIcon contrast={colors.iconInactive} fill={colors.black} />
    },
    subItems: [
      {
        title: 'Names',
        route: EntityRoutes.Names,
        icon: {
          inactive: <NamesIcon />,
          opened: null,
          active: <NamesIcon fill={colors.completeBlack} />
        }
      },
      {
        title: 'Companies',
        route: EntityRoutes.Companies,
        icon: {
          inactive: <CompaniesIcon />,
          opened: null,
          active: <CompaniesIcon fill={colors.completeBlack} />
        }
      }
    ]
  });

featureFlags.includes(FeatureFlags.SearchProjects) &&
  sideBarMenu.push({
    title: 'Search Project ',
    route: EntityRoutes.SearchProject,
    icon: {
      inactive: <SearchProjectIcon />,
      opened: <SearchProjectIcon contrast={colors.iconInactive} fill={colors.black} />,
      active: <SearchProjectIcon contrast={colors.red} fill={colors.black} />
    }
  });

featureFlags.includes(FeatureFlags.FeeAgreement) &&
  sideBarMenu.push({
    title: 'Fee Agreement',
    route: EntityRoutes.FeeAgreements,
    subItems: null,
    icon: {
      inactive: <FeeAgreementIcon />,
      opened: <FeeAgreementIcon contrast={colors.iconInactive} fill={colors.black} />,
      active: <FeeAgreementIcon contrast={colors.red} fill={colors.black} />
    }
  });

export default sideBarMenu;
