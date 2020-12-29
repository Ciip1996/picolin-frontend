// @flow
import { combineReducers } from 'redux';
import appReducer from './app';

const rootReducer = combineReducers({
  app: appReducer
});

/** Reducer that combines domain and app reducer */
export default rootReducer;
