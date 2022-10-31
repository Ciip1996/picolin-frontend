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
  idUser: number,
  userName: string,
  roleId: number,
  name: string,
  firstLastName: string,
  secondLastName: string
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

export type DataResponseFilter = {
  key: string,
  value: Array<any>
};

export type DrawerUiState = {
  isSaving: boolean,
  isSuccess: boolean,
  isReadOnly: boolean,
  isFormDisabled: boolean
};
