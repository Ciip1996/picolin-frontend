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
    ...theme.sidebarItem,
    color: colors.oxford
  },
  itemSelected: {
    backgroundColor: colors.primary,
    color: colors.white,
    fontWeight: 700,
    height: sidebarItem.height,
    '&:hover': {
      backgroundColor: colors.primaryLight
    }
  },
  collapsibleMenu: {
    color: colors.oxford,
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
    backgroundColor: colors.primaryLight,
    height: sidebarItem.height,
    paddingLeft: 40,
    color: colors.white,
    fontWeight: 500,
    '&:hover': {
      backgroundColor: colors.primaryLight
    }
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
