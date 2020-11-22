// @flow
const AppName = 'Picolin Store';

export const drawerAnchor = 'right';

export const usCenterCoordinates = {
  latitude: 39.052136,
  longitude: -94.71583
};

export const waitingTimeBeforeRedirect = 3000;

export const DateFormats = {
  Usa: {
    DetailDate: 'MMMM DD, YYYY',
    SimpleDate: 'MM/DD/YYYY',
    SimpleDateTime: 'MM/DD/YYYY HH:mm a',
    DayDate: 'dddd, MM/DD/YYYY',
    QueryFormat: 'YYYY-MM-DD HH:mm:ss',
    MonthDay: 'MMM DD',
    MonthDayYear: 'MMM DD, YYYY'
  },
  International: {
    DetailDate: 'DD MMMM, YYYY',
    DetailDateTime: 'DD/MMMM/YYYY HH:mm a',
    SimpleDate: 'DD/MM/YYYY',
    SimpleDateTime: 'DD/MM/YYYY HH:mm a',
    DayDate: 'dddd, DD/MM/YYYY',
    QueryFormat: 'YYYY-MM-DD HH:mm:ss',
    MonthDay: 'DD MMM',
    MonthDayYear: 'DD MMM, YYYY'
  },
  SQL: 'YYYY-MM-DD'
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
  NewSale: `${AppName} | Nueva Venta`,
  Sales: `${AppName} | Ventas`,
  Login: `${AppName} | Inicio de Sesión`,
  RegisterUser: `${AppName} | Registar usuario`,
  Home: `${AppName} | Inicio`,
  Dashboard: `${AppName} | Dashboard`,
  NotFound: `${AppName} | Not Found`,
  Inventory: `${AppName} | Inventario`,
  Transfers: `${AppName} | Transferencias`
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
