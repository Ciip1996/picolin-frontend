import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { THEME } from 'GlobalStyles';

export const useActionButtonStyles = makeStyles(() => ({
  smallRowActionButton: { height: 28, width: 110 }
}));

export const getMuiTheme = () =>
  createMuiTheme({
    ...THEME,
    overrides: {
      ...THEME.overrides,
      MUIDataTable: {
        paper: {
          boxShadow: 'none'
        }
      }
    }
  });
