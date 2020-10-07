// @flow
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'App.css';
import { THEME } from 'GlobalStyles';
import Routes from 'routes/Routes';

const App = () => {
  return (
    <MuiThemeProvider theme={THEME}>
      <Routes />
    </MuiThemeProvider>
  );
};

export default App;
