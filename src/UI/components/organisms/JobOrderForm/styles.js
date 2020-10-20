import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { my24 } from 'UI/constants/dimensions';
import { colors } from 'UI/res';

export const styles = {
  line: {
    border: `1px solid ${colors.lightgrey}`,
    width: '100%',
    display: 'block',
    margin: my24
  },
  checkBox: {
    width: 20,
    height: 20,
    color: colors.success,
    marginRight: 10,
    marginLeft: 10
  },
  boxCheck: {
    fontSize: 15,
    margin: 0
  }
};

export const StyledForm = withStyles({
  root: {
    fontSize: 15,
    '& span': {
      fontSize: '15px !important'
    }
  }
})(FormControlLabel);
