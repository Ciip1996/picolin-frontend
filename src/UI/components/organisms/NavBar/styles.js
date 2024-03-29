import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';
import { navBarHeight, sideBarWidth } from 'UI/constants/dimensions';

export const styles = {
  leftContainer: {
    minWidth: sideBarWidth
  },
  middleContainer: {
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: 68,
    paddingRight: 68
  },
  searchbarWrapper: {
    maxWidth: 581,
    width: '100%'
  },
  rightContainer: {
    justifyContent: 'flex-end'
  }
};

export const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  wrapper: {
    flexGrow: 1,
    position: 'fixed',
    display: 'flex',
    top: 0,
    left: 0,
    right: 0,
    height: navBarHeight,
    backgroundColor: colors.white,
    alignItems: 'center',
    fontSize: 18,
    justifyContent: 'space-between',
    zIndex: 1001,
    width: '100%',
    margin: 'auto',
    boxShadow: '-1px -4px 16px #0000005e'
  },
  divItem: {
    display: 'flex',
    height: navBarHeight,
    backgroundColor: colors.white,
    alignItems: 'center'
  },
  userCardWrapper: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'flex-end',
    minHeight: 68
  },
  name: {
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: theme.typography.fontFamilyContent,
    marginRight: 10
  },
  languageContainer: {
    marginRight: 24
  },
  language: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: theme.typography.fontFamilyContent
  },
  userCard: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  menu: {
    width: 148,
    height: 48,
    position: 'absolute',
    color: colors.error,
    borderRadius: '4px',
    backgroundColor: colors.white,
    bottom: -67,
    padding: '5px 20px',
    display: 'flex',
    alignItems: 'center',
    '&::before': {
      content: '""',
      backgroundColor: colors.white,
      width: 20,
      height: 20,
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      position: 'absolute',
      top: -11,
      right: 27
    }
  },
  menuLink: {
    color: colors.success,
    textDecoration: 'none',
    '&:hover': {
      fontWeight: theme.typography.fontWeightBold,
      cursor: 'pointer'
    }
  },
  loginLink: {
    color: colors.error,
    textDecoration: 'none',
    '&:hover': {
      fontWeight: theme.typography.fontWeightBold,
      cursor: 'pointer'
    }
  }
}));
