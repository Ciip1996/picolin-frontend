import { makeStyles } from '@material-ui/core/styles';
import { input } from 'UI/constants/dimensions';

export const useStyles = makeStyles(theme => ({
  root: {
    ...theme.input,
    height: 'unset',
    '& div': {
      height: input.height
    }
  }
}));
