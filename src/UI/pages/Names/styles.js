import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 'calc(100% - 50px)',
    maxWidth: 1417,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    left: 0,
    right: 0
  }
}));
