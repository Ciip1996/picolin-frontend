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
    height: '438px',
    boxShadow: '0px 3px 6px #00000029',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    background: 'white'
  },
  loginButton: {
    background: 'linear-gradient(270deg, #ED8A9C 0%, #F5C4A1 100%)',
    boxShadow: '0px 3px 6px #00000029',
    marginTop: '42px',
    width: '171px',
    minHeight: '48px !important'
    // marginBottom: '58px',
    // borderTopLeftRadius: 24,
    // borderTopRightRadius: 24,
    // borderBottomLeftRadius: 24,
    // borderBottomRightRadius: 24
  },
  header: {
    marginTop: '54px',
    marginBottom: '55px',
    font: 'normal normal bold 32px/48px Poppins',
    color: '#94A6B3',
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
