import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const useStyles = makeStyles({
  wrapper: {
    backgroundColor: colors.picolinBackground,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  },
  containerBox: {
    display: 'flex',
    width: 398,
    height: 'auto',
    boxShadow: '0px 3px 6px #00000029',
    borderRadius: 26,
    background: colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  RegisterButton: {
    marginTop: 24,
    width: 171
  },
  header: {
    marginBottom: 20,
    font: 'normal normal bold 32px/48px Poppins',
    color: colors.title,
    height: 45,
    letterspacing: 0
  },
  formLayout: {
    textAlign: 'center',
    width: '100%',
    margin: 32
  }
});
