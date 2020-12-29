import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    flex: 1,
    height: 'fit-content',
    backgroundColor: colors.trasnparent,
    padding: 16
  },
  title: {
    [theme.breakpoints.up('lg')]: {
      fontSize: 32
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 28
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 24
    }
  },
  subtitle: {
    [theme.breakpoints.up('lg')]: {
      fontSize: 28
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 20
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 14
    }
  },
  textContainer: {
    height: '100%',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center'
  },
  children: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center'
  }
}));
