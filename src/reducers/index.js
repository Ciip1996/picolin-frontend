// @flow
import { combineReducers } from 'redux';
import appReducer from './app';
import mapReducer from './map';
import dashboardReducer from './dashboard';
import notificationReducer from './notification';

const rootReducer = combineReducers({
  app: appReducer,
  map: mapReducer,
  dashboard: dashboardReducer,
  notification: notificationReducer
});

/** Reducer that combines domain and app reducer */
export default rootReducer;
