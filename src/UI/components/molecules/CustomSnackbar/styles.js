import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const styles = {
  truncateText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: 336
  },
  closeButton: {
    position: 'absolute',
    right: 24
  },
  buttonContainer: {
    padding: 0
  }
};

const ellipsis = {
  overflow: 'hidden',
  position: 'relative',
  lineHeight: '1.3em',
  // textAlign: 'justify',
  marginRight: '-1em',
  paddingRight: '1em',
  '&&:before': {
    content: '"…"',
    position: 'absolute',
    right: 0,
    bottom: 0
  }
};

export const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex'
  },
  textContainer: {
    marginLeft: 11
  },
  title: {
    fontWeight: theme.typography.fontWeightBold,
    textTransform: 'capitalize',
    maxHeight: '1.4em',
    ...ellipsis,
    '&&:after': {
      content: '""',
      position: 'absolute',
      right: 0,
      width: '1em',
      height: '1em',
      marginTop: '0.2em',
      background: props => (props.severity ? theme.palette[props.severity].main : colors.white)
    }
  },
  body: {
    fontWeight: theme.typography.fontWeightLight,
    maxHeight: '2.4em',
    ...ellipsis,
    '&&:after': {
      content: '""',
      position: 'absolute',
      right: 0,
      width: '1em',
      height: '1em',
      marginTop: '0.2em',
      background: props => (props.severity ? theme.palette[props.severity].main : colors.white)
    }
  },
  indicator: {
    width: 8,
    height: 85,
    borderRadius: '4px 0px 0px 4px',
    position: 'absolute'
  }
}));

const snackbarRoot = {
  width: 500,
  height: 72,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '4px',
  padding: 24,
  margin: 0,
  fontSize: '16px'
};

export const useAlertStyles = makeStyles(() => ({
  root: {
    ...snackbarRoot
  },
  message: {
    flex: 1
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export const useNotificationStyles = makeStyles(() => ({
  root: {
    ...snackbarRoot
  },
  filledWarning: {
    backgroundColor: colors.white,
    color: colors.black
  },
  filledSuccess: {
    backgroundColor: colors.white,
    color: colors.black
  },
  message: {
    flex: 1
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));
