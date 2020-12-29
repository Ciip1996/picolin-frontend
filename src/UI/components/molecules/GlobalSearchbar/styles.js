import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { colors } from '../../../res';
import { input } from '../../../constants/dimensions';

export const themeOverride = createMuiTheme({
  palette: {
    primary: {
      light: colors.greyFocus,
      main: colors.greyFocus
    }
  },
  overrides: {
    MuiInputLabel: {
      outlined: {
        transform: 'translate(14px, 13px) scale(1)'
      }
    },
    MuiFormLabel: {
      root: {
        '&.Mui-focused': {
          color: colors.darkGrey
        }
      }
    }
  }
});

export const useAutocompleteStyles = makeStyles(theme => ({
  root: {
    ...theme.input,
    '& .MuiOutlinedInput-root': {
      margin: '0px !important',
      transform: 'translate(14px, 13px) scale(1)',
      padding: '0 !important',
      '& fieldset': {
        // borderColor: colors.componentFill,
        borderWidth: 1
      }
    }
  },
  inputRoot: {
    height: input.height,
    width: '100%',
    borderRadius: input.borderRadius,
    border: 0
  }
}));

export const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 420,
    width: '100%',
    maxWidth: 1024,
    height: input.height,
    borderRadius: input.borderRadius,
    // borderColor: colors.transparent,
    borderWidth: 0,
    position: 'relative',
    '&:hover': {
      color: colors.darkGrey,
      '& path': {
        fill: colors.middleGrey
      }
    }
  },
  input: {
    flex: 1,
    fontSize: 18,
    position: 'absolute',
    width: 576
  },
  wrapper: {
    position: 'absolute',
    right: 0,
    flex: 1,
    display: 'flex',
    height: '100%'
  },
  iconButton: {
    padding: '0 12px !important'
  }
}));
