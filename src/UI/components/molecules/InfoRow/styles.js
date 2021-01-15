import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  row: {
    height: 50
  },
  value: {
    font: 'normal normal 300 18px/27px Poppins',
    opacity: '1',
    color: '#515C6F',
    textAlign: 'right',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  title: {
    font: 'normal normal 300 14px/21px Poppins',
    color: '#515C6F',
    letterSpacing: '0.98px',
    textTransform: 'uppercase',
    opacity: '0.5'
  },
  divider: {
    margin: 0,
    padding: 0,
    height: 1
  }
}));
