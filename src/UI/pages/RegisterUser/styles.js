import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const useStyles = makeStyles({
  wrapper: {
    backgroundColor: colors.loginBackground,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  containerBox: {
    width: '398px',
    height: '638px',
    boxShadow: '0px 3px 6px #00000029',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    background: 'white'
  },
  RegisterButton: {
    marginTop: '30px',
    width: '171px'
  },
  header: {
    marginTop: '40px',
    marginBottom: '20px',
    font: 'normal normal bold 32px/48px Poppins',
    color: '#94A6B3',
    height: '45px',
    letterspacing: '0px'
  },
  Formulary: {
    width: '315px',
    height: '40px'
  },
  Content: {
    width: '315px',
    height: '40px'
  }
});
