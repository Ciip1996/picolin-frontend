import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1)
    }
  },
  Container: {
    height: 50
  },
  Description: {
    font: 'normal normal 300 14px/21px Poppins',
    color: '#515C6F',
    letterSpacing: '0.98px',
    textTransform: 'uppercase',
    opacity: '0.5'
  },
  Divider: {
    margin: 0,
    padding: 0,
    height: 1
  }
}));
