// @flow
import React, { useEffect, useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'App.css';
import { THEME } from 'GlobalStyles';
import Routes from 'routes/Routes';
import moment from 'moment';
import 'moment/locale/es';

const DEFAULT_LOCALE = 'es';
const DEFAULT_LANGUAGE = 'Spanish';

// function storeLanguageInLocalStorage(language) {
//   localStorage.setItem('language', language);
// }
moment.locale(DEFAULT_LOCALE); // set default locale manually to Spanish

const App = () => {
  const [locale, setLocale] = useState('');
  const [language, setLanguage] = useState('');

  useEffect(() => {
    setLocale(DEFAULT_LOCALE);
    setLanguage(DEFAULT_LANGUAGE);
    localStorage.setItem('language', language);
    localStorage.setItem('locale', locale);
  }, [language, locale]);

  return (
    <MuiThemeProvider theme={THEME}>
      <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} locale={locale}>
        <Routes />
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};

export default App;
