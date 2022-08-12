// @flow
import React, { useEffect } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import 'App.css';
import { THEME } from 'GlobalStyles';
import Routes from 'routes/Routes';
import moment from 'moment-timezone';
import {
  getCurrentSessionExpirationDate,
  logout
} from 'services/Authentication';
import { now } from 'lodash';
import 'moment/locale/es';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocalStorage } from 'UI/utils';

// For production:

// const DEFAULT_LOCALE = 'es';
// const DEFAULT_LANGUAGE = 'Spanish';

// For demo:
const DEFAULT_LOCALE = 'en';
const DEFAULT_LANGUAGE = 'English';

moment.locale(DEFAULT_LOCALE); // set default locale manually to Spanish
moment.tz.setDefault('America/Mexico_City'); // set default timezones for dates from database

const App = () => {
  const [locale, setLocale] = useLocalStorage('locale', '');
  const [language, setLanguage] = useLocalStorage('language', '');

  console.log({ language, locale });

  useEffect(() => {
    // everytime the user refresh the website or opens it for the first time:
    const sessionExpirationDate = getCurrentSessionExpirationDate();
    if (sessionExpirationDate) {
      // there is a session stored locally
      const isSessionValid = sessionExpirationDate.getTime() >= now();
      if (!isSessionValid) {
        // session invalid -> logout
        logout();
      }
    }
    // !sessionExpirationDate no session stored -> let login or leave the site open
  }, []);

  useEffect(() => {
    if (language === '' || locale === '') {
      setLocale(DEFAULT_LOCALE);
      setLanguage(DEFAULT_LANGUAGE);
    }
  }, [language, locale, setLanguage, setLocale]);

  return (
    <MuiThemeProvider theme={THEME}>
      <MuiPickersUtilsProvider
        utils={MomentUtils}
        libInstance={moment}
        locale={locale}
      >
        <Routes />
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};

export default App;
