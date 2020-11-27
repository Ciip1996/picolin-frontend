import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const useStyles = makeStyles(() => ({
  chip: {
    width: '100%',
    height: 25,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    backgroundColor: colors.appBackgroundContrast,
    font: 'normal normal 900 14px/19px Avenir',
    boxShadow: '0px 3px 6px #00000029'
    // color: '#FFFF'
  }
}));
