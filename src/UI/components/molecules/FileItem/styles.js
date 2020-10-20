import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const styles = {
  loading: {
    color: colors.darkGrey
  },
  finished: {
    color: colors.black
  },
  success: {
    color: colors.active
  },
  error: {
    color: colors.error,
    marginBottom: 15
  },
  fileLabel: {
    flex: 1
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
    margin: '24px 0',
    '& div': {
      height: 'auto !important'
    },
    display: 'flex',
    justifyContent: 'space-between',
    textTransform: 'lowercase',
    color: colors.black,
    backgroundColor: colors.transparent,
    alignItems: 'center',
    padding: 0,
    position: 'relative'
  }
}));
