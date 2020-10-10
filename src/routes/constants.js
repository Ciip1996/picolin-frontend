const jobOrderProfile = '/joborders/profile/:id';

export const EntityRoutes = {
  Login: '/login',

  Home: '/home',

  Candidates: '/candidates',
  CandidateProfile: '/candidates/profile/:id',
  CandidateCreate: '/candidates/create',

  Companies: '/companies',
  CompanyProfile: '/companies/profile/:id',
  CompanyCreate: '/companies/create',

  JobOrders: '/joborders',
  JobOrderProfile: jobOrderProfile,
  JoborderProfile: jobOrderProfile, // PLEASE do not delete. It's required for the map to work, as the links to profiles are dynamically generated
  JobOrderCreate: '/joborders/create',

  Dashboard: '/dashboard',
  DashboardOverview: '/dashboard/overview',

  Names: '/names',
  NameProfile: '/names/profile/:id',
  NameCreate: '/names/create',
  HiringAuthorityCreate: '/hiringauthority/create',
  HiringAuthorityProfile: '/hiringauthority/profile/:id',

  SearchProject: '/searchproject',
  SearchProjectPreview: '/searchproject/preview',
  BulkEmail: '/bulkemail',
  Email: '/email',
  FeeAgreementDrawers: '/feeagreement/drawers',
  FeeAgreements: '/feeagreements',

  Calls: '/calls',
  TextMessage: '/textMessage',
  Roster: '/roster'
};
