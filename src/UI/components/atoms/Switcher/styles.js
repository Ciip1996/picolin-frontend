import { makeStyles } from '@material-ui/core/styles';

export const styles = {
  textContainer: {
    height: '100%',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center'
  }
};

export const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    height: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectedCategory: {
    fontWeight: theme.typography.fontWeightBold
  }
}));
