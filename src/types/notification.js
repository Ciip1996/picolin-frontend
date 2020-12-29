// @flow
export type Notification = {
  id: string,
  title: string,
  body: string,
  created_at: string,
  read_on: string | Date,
  icon: string,
  color: string,
  click_url: string,
  click_action: string
};

export type NotificationUiState = {
  isLoading?: boolean,
  hasError?: boolean,
  hasMore?: boolean
};

export type NotificationDomainState = {
  params: any,
  notifications: Array<Notification>,
  total: number,
  filterTotal: number
};

export type NotificationState = {
  ui: NotificationUiState,
  domain: NotificationDomainState
};
