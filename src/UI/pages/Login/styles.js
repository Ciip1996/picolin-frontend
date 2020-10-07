import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const styles = {
  backgroundImg: {
    zIndex: 0,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    height: `100%`
  },

  pattern1: {
    top: 0,
    left: 0
  },
  pattern2: {
    bottom: 0,
    right: 0
  }
};
export const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: colors.appBackground,
    height: '100%',
    width: '100%'
  },
  pattern: {
    position: 'absolute',
    margin: 8
  },
  wrapper: {
    zIndex: 10,
    backgroundColor: colors.transparent,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'relative'
  },
  backgroundImg: {
    ...styles.backgroundImg
  },
  label: {
    maxWidth: '45vw',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '75vw'
    },
    textAlign: 'center'
  }
}));
