import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res/index';

export const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0)
  },
  shadow: {
    ...theme.textShadow
  },
  titleLabel: {
    margin: theme.spacing(0)
  },
  circularProgress: {
    color: colors.succes
  }
}));

export const styles = {
  borderRadius: 30
};
