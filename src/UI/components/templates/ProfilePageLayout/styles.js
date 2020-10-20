import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';
import { layout, container } from 'UI/constants/dimensions';

const commonContainer = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%'
};

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    margin: '36px 64px',
    maxWidth: layout.maxWidth,
    padding: '0 16px'
  },
  wrapper: {
    flex: 1,
    marginTop: 24
  },
  columnRight: {
    display: 'flex',
    flex: 1
  },
  leftContainer: {
    ...commonContainer,
    flex: 1,
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      height: 'auto'
    }
  },
  rightContainer: {
    ...commonContainer
  },
  layoutTop: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 24
  },
  layoutTopOnLoading: {
    width: '100%',
    display: 'flex',
    height: 72,
    justifyContent: 'center',
    marginBottom: 24
  },
  layoutBottom: {
    display: 'flex',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: colors.white,
    boxShadow: container.boxShadow
  }
}));

export const styles = {
  skeletonTitle: {
    height: 72,
    width: '100%'
  },
  skeletonBar: {
    borderRadius: 30,
    height: 54,
    width: '100%'
  },
  skeletonTabsBackground: {
    width: '100%',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.appBackgroundContrast
    // padding: '0 12px'
  },
  marginBottom: 25
};
