import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';
import { sidebarItem } from 'UI/constants/dimensions';

const sidebarActionButtonWrapperHeight = 108;

export const styles = {
  sideBarWrapper: {
    margin: 0,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    backgroundColor: colors.sideBar,
    color: colors.textColor,
    justifyContent: 'flex-start'
  },
  itemWrapper: {
    display: 'flex',
    backgroundColor: colors.transparent,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: sidebarActionButtonWrapperHeight
  }
};

export const useSidebarStyles = makeStyles(theme => ({
  item: {
    ...theme.sidebarItem
  },
  itemSelected: {
    color: colors.black,
    fontWeight: 700,
    height: sidebarItem.height
  },
  collapsibleMenu: {
    fontWeight: 700,
    backgroundColor: colors.inactiveSideBarTab,
    ...theme.sidebarItem,
    '&:hover': {
      backgroundColor: colors.appBackgroundContrast
    }
  },
  subitems: {
    backgroundColor: colors.appBackground,
    height: sidebarItem.height,
    paddingLeft: 40
  },
  subitemSelected: {
    backgroundColor: colors.appBackground,
    height: sidebarItem.height,
    paddingLeft: 40,
    color: colors.black,
    fontWeight: 500
  },
  iconWrapper: {
    marginLeft: 0
  },
  label: {
    marginLeft: -20
  }
}));

export const useStyles = makeStyles(theme => ({
  root: {
    overflow: 'auto',
    width: '100%',
    height: `calc(100% - ${sidebarActionButtonWrapperHeight}px)`,
    fontWeight: theme.typography.fontWeightLight,
    fontFamily: theme.typography.fontFamilyContent
  },
  nested: {
    padding: theme.spacing(4)
  }
}));
