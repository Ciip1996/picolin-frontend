import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { makeStyles } from '@material-ui/core/styles';

const feeModalContainerHeight = 600;
const topBarHeight = 54;

export const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      width: 'calc(100% - 20px)'
    },
    maxWidth: 1250,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    right: 0,
    left: 0,
    top: `calc(100% / 2 - (${`${feeModalContainerHeight}px`} / 2))`,
    height: feeModalContainerHeight,
    margin: 'auto'
  },
  topBar: {
    backgroundColor: colors.appBackground,
    padding: theme.spacing(0, 2),
    height: topBarHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pdfBox: {
    width: '100%',
    height: `calc(100% - ${`${topBarHeight}px`})`,
    margin: '0 auto'
  },
  iframeStyle: {
    border: 'unset'
  }
}));
