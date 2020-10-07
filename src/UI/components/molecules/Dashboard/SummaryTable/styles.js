import { createMuiTheme } from '@material-ui/core/styles';
import { THEME } from 'GlobalStyles';

export const getMuiTheme = () =>
  createMuiTheme({
    ...THEME,
    overrides: {
      ...THEME.overrides,
      MUIDataTable: {
        paper: {
          boxShadow: 'none'
        }
      },
      MuiTableRow: {
        root: {
          height: 56,
          cursor: 'pointer'
        }
      }
    }
  });
