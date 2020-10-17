// @flow
const AppName = 'Picolin Store';

export const drawerAnchor = 'right';

export const usCenterCoordinates = {
  latitude: 39.052136,
  longitude: -94.71583
};

export const waitingTimeBeforeRedirect = 3000;

export const DateFormats = {
  DetailDate: 'MMMM DD, YYYY',
  SimpleDate: 'MM/DD/YYYY',
  SimpleDateTime: 'MM/DD/YYYY HH:mm a',
  DayDate: 'dddd, MM/DD/YYYY',
  QueryFormat: 'YYYY-MM-DD HH:mm:ss',
  MonthDay: 'MMM DD',
  MonthDayYear: 'MMM DD, YYYY'
};

export const FilterType = {
  Autocomplete: 'autocomplete',
  Text: 'text',
  Select: 'select',
  Search: 'search'
};

export const HideMode = {
  Hidden: 'hidden',
  Unmounted: 'unmounted'
};

export const GranularityFormats = {
  hour: 'EEE dd, HH aa',
  hour24: 'HH aa',
  day: 'MMM dd',
  week: 'MMM dd, yyyy',
  month: 'MMM yyyy'
};

export const PageTitles = {
  Sales: `${AppName} | Ventas`,
  Login: `${AppName} | Login`,
  Home: `${AppName} | Home`,
  Candidate: `${AppName} | Candidates`,
  CandidateProfile: `${AppName} | Candidate Profile`,
  CandidateCreate: `${AppName} | New Candidate`,
  Company: `${AppName} | Companies`,
  CompanyProfile: `${AppName} | Company Profile`,
  CompanyCreate: `${AppName} | New Company`,
  JobOrder: `${AppName} | Job Orders`,
  JobOrderProfile: `${AppName} | Job Order Profile`,
  JobOrderCreate: `${AppName} | New Job Order`,
  Dashboard: `${AppName} | Overview`,
  Name: `${AppName} | Names`,
  NameProfile: `${AppName} | Name Profile`,
  SearchProject: `${AppName} | Search Project`,
  SearchProjectPreview: `${AppName} | Search Project Preview`,
  NotFound: `${AppName} | Not Found`,
  HiringAuthority: `${AppName} | Hiring Authority Profile`,
  Roster: `${AppName} | Roster`
};

export const DrawerName = {
  Notifications: 'notifications',
  OperatingMetrics: 'metrics',
  FeeAgreements: 'feeagreement'
};

export const RecruiterBarMode = {
  Compact: 'compact',
  Large: 'large'
};

export const DefaultProfile = {
  id: null,
  title: null,
  name: null,
  contact: null,
  personalInformation: null,
  specialty: null,
  subspecialty: null,
  position: null,
  email: null,
  current_company: null,
  sourceType: null,
  recruiter: null,
  coach: null,
  additionalRecruiters: [],
  company: null,
  address: null,
  source: null,
  signed: null,
  website: null,
  free_game: false
};

export const VisibilityNotifications = {
  All: 'all',
  Unread: 'unread',
  Read: 'read'
};
