import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1)
    }
  },
  List: {
    marginLeft: '24px',
    marginRight: '24px'
  },
  Item: {
    height: 50
  },
  Description: {
    font: 'normal normal 300 14px/21px Poppins',
    color: '#515C6F',
    letterSpacing: '0.98px',
    textTransform: 'uppercase',
    opacity: '0.5'
  }
}));
