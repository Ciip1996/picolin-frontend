import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

export const useStyles = makeStyles(() => ({
  mainBox: {
    display: 'flex',
    alignItems: 'flex-start',
    margin: '20px 0'
  },
  textContainer: {
    margin: '0 27px'
  },
  user: {
    color: colors.darkgrey,
    fontSize: 14,
    fontWeight: 300
  },
  message: {
    fontWeight: 400,
    fontSize: 14,
    color: colors.darkgrey
  },
  time: {
    fontSize: 12,
    color: colors.lightText
  }
}));
