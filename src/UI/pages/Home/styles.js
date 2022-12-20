import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const styles = {
  button: {
    margin: ' 12px 12px'
  },
  iconSize: {
    size: 16,
    fill: colors.white
  },
  backgroundImg: {
    zIndex: 0,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    height: `100%`
  },
  mainTitle: {
    marginBottom: 18
  },
  gridContainer: {
    marginTop: 28
  },
  techStackIconsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: '3rem',
    filter: 'brightness(0) invert(0.3)',
    flexWrap: 'wrap'
  }
};
export const useStyles = makeStyles(theme => ({
  backgroundImg: {
    ...styles.backgroundImg
  },
  root: {
    zIndex: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    width: '100%'
  },
  pdfBox: { width: '100%', height: 400 }
}));
