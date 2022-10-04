import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const useStyles = makeStyles({
  wrapper: {
    backgroundColor: colors.picolinBackground,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  containerBox: {
    width: '398px',
    height: '438px',
    boxShadow: '0px 3px 6px #00000029',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    background: 'white'
  },
  loginButton: {
    marginTop: '42px',
    width: '210px'
  },
  header: {
    marginTop: '54px',
    marginBottom: '55px',
    font: 'normal normal bold 32px/48px Poppins',
    color: colors.title,
    height: '45px',
    letterspacing: '0px'
  },
  txtUser: {
    width: '315px',
    height: '40px'
  },
  txtPwd: {
    marginTop: '34px',
    width: '315px',
    height: '40px'
  },
  txtloginButton: {
    width: '61px',
    font: '16px/19px Roboto',
    marginTop: '15px',
    marginBottom: '14px',
    opacity: '1',
    height: '19px',
    color: '#FCFCFC',
    letterspacing: '0px'
  }
});
