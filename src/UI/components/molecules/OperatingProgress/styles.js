import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

export const BorderLinearProgress = withStyles(() => ({
  root: {
    height: 10,
    borderRadius: 5
  },
  colorPrimary: {
    backgroundColor: colors.borderColor
  },
  bar: {
    borderRadius: 5,
    backgroundColor: props => (props.completed ? colors.active : colors.primary)
  }
}))(LinearProgress);
