import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const useStyles = makeStyles(() => ({
  button: {
    backgroundColor: colors.white
  },
  text: { fontSize: 24, textAlign: 'center' },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }
}));
