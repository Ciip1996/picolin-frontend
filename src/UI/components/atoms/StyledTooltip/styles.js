import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

export default withStyles(theme => ({
  tooltip: {
    ...theme.tooltip,
    boxShadow: theme.shadows[1]
  }
}))(Tooltip);
