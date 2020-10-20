import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  date: {
    backgroundColor: colors.lightBackground,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.offlineGray,
    fontSize: 14,
    height: 35
  }
}));
