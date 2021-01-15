import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const useStyles = makeStyles(() => ({
  row: {
    height: 50
  },
  value: {
    font: 'normal normal bold 26px/39px Poppins',
    opacity: '1',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textAlign: 'right',
    flex: 1,
    color: props => (Number(props.value) === 0 ? colors.rowTotal : 'red')
  },
  title: {
    font: 'normal normal bold 20px/30px Poppins',
    letterSpacing: '1.4px',
    textTransform: 'uppercase',
    opacity: '0.5',
    textAlign: 'right',
    flex: 3,
    color: colors.rowTotal
  }
}));
