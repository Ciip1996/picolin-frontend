import { makeStyles } from '@material-ui/core/styles';
import { flexAlignCenter } from 'UI/utils/styles';

export const useStyles = makeStyles({
  optionsTitle: {},
  flexCenter: {
    ...flexAlignCenter
  },
  optionsContainer: {
    ...flexAlignCenter,
    marginTop: 6
  },
  radioDivider: {
    marginRight: 5
  }
});
