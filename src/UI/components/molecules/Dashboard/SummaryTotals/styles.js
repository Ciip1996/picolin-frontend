import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  summaryItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& > *': {
      marginRight: 20
    }
  }
}));
