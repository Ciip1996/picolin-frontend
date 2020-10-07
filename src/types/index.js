// @flow

import type { MapState } from './map';
import type { DashboardState } from './dashboard';
import type { AppState } from './app';
import type { NotificationState } from './notification';

export type GlobalState = {
  app: AppState,
  map: MapState,
  dashboard: DashboardState,
  notification: NotificationState
};

export type Map = { [name: string]: any };
