// @flow
import { withStyles } from '@material-ui/core/styles';
import MuiCard from '@material-ui/core/Card';
import MuiCardHeader from '@material-ui/core/CardHeader';
import MuiCardContent from '@material-ui/core/CardContent';

import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

export const Card = withStyles({
  root: {
    boxShadow: '0px 3px 6px #0000000D',
    position: 'relative',
    zIndex: '0'
  }
})(MuiCard);

export const CardHeader = withStyles({
  root: {
    padding: '18px 32px',
    backgroundColor: colors.sideBar
  },
  content: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontWeight: '700 !important',
    fontSize: 26,
    textTransform: 'uppercase',
    fontFamily: '"Poppins", sans-serif',
    marginRight: '5px'
  },
  subheader: {
    color: colors.offlineGray,
    fontWeight: '100 !important',
    fontSize: '24px !important'
  }
})(MuiCardHeader);

export const CardContent = withStyles({
  root: {
    padding: 24,
    '&:last-child': {
      paddingBottom: 24
    }
  }
})(MuiCardContent);
