import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { input } from 'UI/constants/dimensions';

export const styles = {
  cardAction: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingLeft: 25,
    paddingRight: 48
  },
  button: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0
  },
  loading: {
    backgroundColor: colors.darkGrey
  },
  finished: {
    backgroundColor: colors.silverGrey,
    color: colors.black
  },
  success: {
    backgroundColor: colors.active
  },
  error: {
    backgroundColor: colors.silverGrey,
    borderWidth: 1,
    color: colors.black,
    border: `1px solid ${colors.error}`,
    marginBottom: 15
  },
  errorLabel: {
    color: colors.error,
    top: '100%',
    position: 'absolute',
    zIndex: 1
  }
};

export const useProgressStyles = makeStyles({
  root: {
    color: colors.active
  }
});

export const useStyles = makeStyles(theme => ({
  root: {
    ...theme.input,
    height: input.height,
    margin: 0,
    '& div': {
      height: 'auto !important'
    },
    display: 'flex',
    justifyContent: 'space-between',
    textTransform: 'lowercase',
    color: colors.white,
    fontSize: 16,
    fontWeight: 300,
    alignItems: 'center',
    padding: '0px 0px 0px 25px',
    position: 'relative'
  }
}));
