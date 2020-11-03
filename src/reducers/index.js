// @flow
import { combineReducers } from 'redux';
import appReducer from './app';
import dashboardReducer from './dashboard';

const rootReducer = combineReducers({
  app: appReducer,
  dashboard: dashboardReducer
});

/** Reducer that combines domain and app reducer */
export default rootReducer;
