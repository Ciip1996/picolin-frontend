import { makeStyles } from '@material-ui/core/styles';
import { container, letterSpacing } from 'UI/constants/dimensions';
import { colors } from 'UI/res';

export const styles = {
  wrapper: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.sideBar,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    boxShadow: container.boxShadow
  },
  TabContentWrapper: {
    height: '100vh',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }
};
export const useTabStyles = makeStyles(() => ({
  tab: {
    textTransform: 'uppercase',
    letterSpacing,
    color: colors.iconInactive,
    fontSize: 14,
    fontWeight: 500,
    flex: 1,
    maxWidth: 'none'
  }
}));

export const useTabPanelStyles = makeStyles(() => ({
  root: {
    padding: 0,
    position: 'relative',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: props => props.panelHeight || 100
  }
}));

export const useWrapperStyles = makeStyles(theme => ({
  wrapper: props => ({
    width: '100%',
    backgroundColor: colors.sideBar,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      minHeight: '80vh'
    },
    ...props
  })
}));

export const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    backgroundColor: colors.sideBar,
    width: '100%',
    padding: 0,
    '& header': {
      boxShadow: '0px 1px 1px #0000006b'
    },
    boxShadow: 'none',
    borderBottom: `2px solid ${colors.inactiveSideBarTab}`,
    zIndex: 1
  }
}));
