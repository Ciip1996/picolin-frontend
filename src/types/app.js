// @flow
export type Severity = 'warning' | 'info' | 'success' | 'error';

export type AlertMessage = {
  key: number,
  severity: Severity,
  autoHideDuration?: number,
  title: string,
  body?: string,
  isOpen: boolean,
  onDismissClick: any,
  isNotification: boolean,
  onClick: () => void
};

export type Confirmation = {
  severity: Severity,
  title: string,
  message: string,
  onConfirm: any => any
} | null;

export type Filters = { [name: string]: any };

export type User = {
  // token: string,
  userName: string,
  name: string,
  role: string
};

export type AppUiState = {
  alerts: AlertMessage[],
  confirmation?: Confirmation
};

export type AppDomainState = {
  currentUser: User
};

export type AppState = {
  ui: ?AppUiState,
  domain: ?AppDomainState
};

export type InfoLabel = {
  title: string,
  description: string,
  color?: string
};

export type TabCardDefinition = {
  showAvatar: boolean,
  infoLabelsResolver: any => InfoLabel[]
};

export type DashboardPeriod = {
  startDate: Date,
  endDate: Date
};

export type DataResponseFilter = {
  key: string,
  value: Array<any>
};

export type FeeAgreementMode = 'fee' | 'guarantee' | 'verbiage' | 'all';

export type DrawerUiState = {
  isSaving: boolean,
  isSuccess: boolean,
  isReadOnly: boolean,
  isFormDisabled: boolean
};

export type EntityProfile = {
  id: ?number,
  title: ?string,
  company: ?any,
  address: ?any,
  source: ?string,
  signed: ?any,
  name: ?string,
  contact: ?any,
  website: ?string,
  personalInformation: ?any,
  specialty: ?any,
  subspecialty: ?any,
  position: ?any,
  email: ?string,
  current_company: ?string,
  sourceType: ?any,
  recruiter: ?any,
  coach: ?any,
  additionalRecruiters: ?(any[]),
  free_game: boolean
};

export type UserRole = {
  id: number,
  title: string
};
