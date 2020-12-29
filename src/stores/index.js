// @flow

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import type { GlobalState } from 'types/index';

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const createStoreFromStateAndReducer = (initialState: GlobalState, rootReducer: any) =>
  createStore(rootReducer, initialState, storeEnhancers(applyMiddleware(thunk)));

export default createStoreFromStateAndReducer;
