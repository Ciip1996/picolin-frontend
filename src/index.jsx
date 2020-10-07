// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';

import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import createStore from './stores/index';
import initialState from './stores/initial';
import rootReducer from './reducers/index';

const store = createStore(initialState, rootReducer);

const root = document.getElementById('root');

if (root !== null) {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <SnackbarProvider maxSnack={3} preventDuplicate>
          <App />
        </SnackbarProvider>
      </Provider>
    </React.StrictMode>,
    root
  );
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
