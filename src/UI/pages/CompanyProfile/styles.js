import { makeStyles } from '@material-ui/core/styles';
import { layout, container } from 'UI/constants/dimensions';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

export const styles = {};
export const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 'calc(100vh - 68px)',
    padding: '36px 68px'
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    maxWidth: layout.maxWidth
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
    padding: '12px 12px'
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
    padding: '12px 12px'
  },
  layoutTop: {
    display: 'flex',
    minHeight: 72,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: colors.white,
    margin: 12,
    padding: 10,
    boxShadow: container.boxShadow,
    borderRadius: 4
  },
  layoutBottom: {
    display: 'flex',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: colors.white,
    margin: '12px 12px',
    borderRadius: 4
  }
}));
