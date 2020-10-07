import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const styles = {
  drawerContainer: {
    width: 580,
    height: '100vh',
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 11,
    boxShadow: '-32px 0px 32px #00000017',
    padding: `62px 0 0`,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.white
  },
  drawerTopToolbar: {
    position: 'absolute',
    right: 12,
    top: 12
  },
  drawerContent: {
    flexGrow: 1
  },
  totalNotificationBadge: { position: 'absolute', left: 260, top: 82 },
  truncateText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: 400
  },
  visibilityNotificationActive: { backgroundColor: '#C8CFFC', color: '#5A6DF5' },
  visibilityNotificationNoActive: { backgroundColor: '#ECEDF0', color: '#525764' }
};

const stylesCard = {
  width: '100%',
  maxHeight: 120,
  display: 'flex',
  position: 'relative',
  boxShadow:
    '0px 0px 0px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 0px 1px rgba(0,0,0,0.12)',
  borderRadius: 0
};

export const useStyles = makeStyles(theme => ({
  root: {
    ...stylesCard,
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: colors.notificationUnRead,
      width: '100%'
    }
  },
  read: {
    ...stylesCard,
    opacity: 0.5,
    '&:hover': {
      cursor: 'pointer',
      background: colors.notificationRead,
      width: '100%'
    }
  },
  leftIndicator: {
    width: 6,
    height: '100%',
    position: 'absolute',
    backgroundColor: props => props.indicatorColor
  },
  iconContainer: {
    padding: 0
  },
  icon: {
    position: 'absolute',
    left: 30
  },
  textContainer: {
    marginLeft: 60
  },
  title: {
    fontWeight: theme.typography.fontWeightBold,
    maxHeight: '2.4em',
    ...ellipsis,
    fontFamily: '"Roboto", Medium !important'
  },
  body: {
    fontWeight: theme.typography.fontWeightLight,
    maxHeight: '2.4em',
    ...ellipsis,
    fontFamily: '"Roboto", Light !important'
  },
  created: {
    fontWeight: theme.typography.fontWeightLight,
    maxHeight: '1.4em',
    color: props => props.createdColor,
    fontFamily: '"Roboto", Regular !important'
  },
  indicatorContainer: {
    padding: 0
  },
  indicator: {
    position: 'absolute',
    right: 20
  },
  visibilityNotifications: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5)
    }
  }
}));

const ellipsis = {
  overflow: 'hidden',
  position: 'relative',
  lineHeight: '1.3em',
  marginRight: '-1em',
  paddingRight: '1em'
};
