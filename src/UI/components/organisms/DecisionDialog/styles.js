import { makeStyles } from '@material-ui/core/styles';
import { mx24 } from 'UI/constants/dimensions';

export const styles = {
  bodyContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24
  },
  textContainer: {
    marginLeft: 18,
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    height: 10
  }
};

export const useStyles = makeStyles(theme => ({
  focusVisible: {},
  actions: {
    marginTop: 10
  },
  button: {
    width: 174,
    fontSize: 18,
    fontWeight: theme.typography.fontWeightMedium
  },
  buttonMargin: {
    margin: mx24
  },
  text: { fontSize: 24, textAlign: 'center' }
}));
