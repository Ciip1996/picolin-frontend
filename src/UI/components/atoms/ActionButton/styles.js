import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res/colors/index';

export const styles = {
  emptyDiv: {
    width: 20,
    height: 20
  },
  noDiv: {
    display: 'none'
  },
  withIcon: {
    justifyContent: 'space-between',
    padding: '0 20px'
  },
  success: {
    backgroundColor: colors.success
  },
  outlineSuccess: {
    color: colors.success,
    border: ` 1px solid ${colors.success}`
  },
  error: {
    backgroundColor: colors.red
  },
  largeContent: {
    width: 'max-content'
  },
  buttonResponsive: {
    display: 'flex',
    justifyContent: 'center'
  }
};

export const useStyles = makeStyles(theme => ({
  root: {
    ...theme.button,
    color: colors.white,
    border: 0,
    backgroundColor: props => props.variant === 'contained' && colors.success,
    '&:hover': {
      backgroundColor: props => props.variant === 'contained' && colors.success
    },
    minWidth: props => (props.isResponsive ? 'unset' : 120),
    width: props => (props.isResponsive ? 174 : 238),
    '& > span': {
      width: props => props.isWithoutText && 'min-content',
      display: props => props.isWithoutText && 'flex',
      justifyContent: props => props.isWithoutText && 'center',
      alignItems: props => props.isWithoutText && 'center',
      flexDirection: props => props.isWithoutText && 'column',
      '& > span': {
        margin: props => props.isWithoutText && 0
      }
    }
  },
  button: {},
  outlined: {
    ...theme.button,
    '&:hover': {
      backgroundColor: props =>
        props.variant === 'outlined' &&
        `${
          props.status === 'success'
            ? `${colors.linkWater} !important`
            : `${colors.lightGrey} !important`
        } `
    },
    color: colors.black,
    border: ` 1px solid ${colors.black}`
  },
  disabled: {
    backgroundColor: `${colors.inactiveSideBarTab} !important`
  }
}));
