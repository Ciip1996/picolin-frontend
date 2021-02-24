// @flow

import { FeatureFlags } from 'UI/constants/featureFlags';
import { getFeatureFlags } from 'UI/utils';

export type EntityFilter = {
  id: number,
  title: string,
  order: number
};

const featureFlags = getFeatureFlags();

// export const entityTypes = featureFlags.includes(FeatureFlags.Names)
//   ? [
//       { id: 'candidate', title: 'Candidates', singular: 'Candidate', isActive: true },
//       { id: 'joborder', title: 'Job Orders', singular: 'Job Order', isActive: true },
//       { id: 'company', title: 'Companies', singular: 'Company', isActive: true },
//       { id: 'name', title: 'Names', singular: 'Name', isActive: false }
//     ]
//   : [
//       { id: 'candidate', title: 'Candidates', singular: 'Candidate', isActive: true },
//       { id: 'joborder', title: 'Job Orders', singular: 'Job Order', isActive: true },
//       { id: 'company', title: 'Companies', singular: 'Company', isActive: true }
//     ];

export const entityTypes = [
  {
    id: 'candidate',
    title: 'Candidates',
    singular: 'Candidate',
    isActive: true
  },
  {
    id: 'joborder',
    title: 'Job Orders',
    singular: 'Job Order',
    isActive: true
  },
  {
    id: 'company',
    title: 'Companies',
    singular: 'Company',
    isActive: true
  }
];

featureFlags.includes(FeatureFlags.Names) &&
  entityTypes.push({ id: 'name', title: 'Names', singular: 'Name', isActive: false });

// featureFlags.includes(FeatureFlags.FeeAgreement) &&
//   entityTypes.push({
//     id: 'feeagreement',
//     title: 'Fee Agreement',
//     singular: 'Name',
//     isActive: false
//   });

export const entyTypesFilters = (type: string): EntityFilter[] => {
  return [
    { id: 0, title: `My ${type}`, order: 0 },
    { id: 1, title: `${type} in the industries I work`, order: 1 },
    { id: 2, title: `My team ${type}`, order: 2 },
    { id: 3, title: `All ${type}`, order: 5 }
  ];
};

export const accountabilityFilters = (type: string): EntityFilter[] => {
  return [
    ...entyTypesFilters(type),
    { id: 4, title: `My collaborations`, order: 3 },
    { id: 5, title: `Free game ${type}`, order: 4 }
  ].sort((a: EntityFilter, b: EntityFilter) => a.order - b.order);
};
