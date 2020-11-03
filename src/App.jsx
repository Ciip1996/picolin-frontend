// @flow
import React, { useEffect } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'App.css';
import { THEME } from 'GlobalStyles';
import Routes from 'routes/Routes';

// function storeLanguageInLocalStorage(language) {
//   localStorage.setItem('language', language);
// }

const App = () => {
  // const languageStoredInLocalStorage = localStorage.getItem('language');
  // const [language, setLanguage] = useState(languageStoredInLocalStorage || 'English');

  useEffect(() => {
    localStorage.setItem('language', 'Spanish');
  }, []);
  return (
    <MuiThemeProvider theme={THEME}>
      <Routes />
    </MuiThemeProvider>
  );
};

export default App;
