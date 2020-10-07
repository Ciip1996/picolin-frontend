import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: '0 10px 20px 0'
    }
  },
  chip: {
    fontSize: '13px',
    textTransform: 'uppercase'
  }
}));
