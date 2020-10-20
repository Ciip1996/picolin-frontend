import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  root: {
    borderRadius: '50%',
    border: 'none',
    padding: 0
  }
}));

export const StatusColor = {
  standby: colors.orange,
  inactive: colors.red,
  active: colors.active,
  placement: colors.navyBlue,
  sendout: colors.success,
  offline: colors.offlineGray
};
