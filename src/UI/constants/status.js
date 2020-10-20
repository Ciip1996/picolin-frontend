import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

export const CompanyStatus = {
  unsigned: {
    style_class_name: colors.inactive,
    title: 'Not Signed'
  },
  signed: {
    style_class_name: colors.active,
    title: 'Signed'
  }
};

export const PendingDeclinationStatusBy = {
  'Regional Director': 6,
  'Production Director': 7
};

export const AdditionalRecruiterType = {
  Collaborator: 'collaborator',
  Accountable: 'accountable',
  Main: 'main'
};

export const AdditionalRecruiterStatus = {
  Requested: 'requested',
  Approved: 'approved',
  Declined: 'declined',
  Removed: 'removed'
};
