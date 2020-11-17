import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';
import { input } from 'UI/constants/dimensions';

export const useChipStyles = makeStyles(() => ({
  root: {
    backgroundColor: colors.componentFill,
    justifyContent: 'space-between',
    display: 'flex',
    margin: '2px 3px'
  }
}));

export const useAutocompleteStyles = makeStyles(theme => ({
  inputRoot: {
    // borderColor: colors.inactiveInputText,
    borderRadius: input.borderRadius,
    minHeight: input.height,
    padding: '5px 60px 5px 5px !important',
    backgroundColor: colors.transparent
  },
  root: {
    ...theme.input,
    display: 'flex',
    alignItems: 'flex-start'
  },
  input: {
    flex: 1,
    display: 'flex',
    padding: '0px 0px 0px 6px !important'
  }
}));

export const useAutocompleteStylesDisabled = makeStyles(theme => ({
  inputRoot: {
    borderRadius: input.borderRadius,
    minHeight: input.height,
    padding: '5px 60px 5px 5px !important',
    backgroundColor: colors.lightgrey,
    color: 'rgb(166, 166, 166)'
  },
  root: {
    ...theme.input,
    display: 'flex',
    alignItems: 'flex-start',
    '& fieldset': {
      border: `1px solid ${colors.black}`
    }
  },
  input: {
    flex: 1,
    display: 'flex',
    padding: '0px 0px 0px 6px !important'
  }
  // input: {
  //   display: 'none'
  // }
}));

export const useChipStylesDisabled = makeStyles(theme => ({
  root: {
    backgroundColor: colors.appBackground,
    width: '27%',
    margin: 8,
    justifyContent: 'space-between',
    display: 'flex',
    fontWeight: theme.typography.fontWeightLight,
    fontSize: 14
  }
}));

export const styles = {
  textField: {
    height: '100%'
  }
};
