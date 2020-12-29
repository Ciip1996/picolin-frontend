import { makeStyles } from '@material-ui/core/styles';
import { layout } from 'UI/constants/dimensions';

export const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    padding: '36px 64px',
    height: '100%',
    width: '100%',
    maxWidth: layout.maxWidth
  }
}));
