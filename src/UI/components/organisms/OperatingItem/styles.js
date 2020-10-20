import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

const listSelectedBackground = colors.softBack;

export const useItemStyles = makeStyles({
  root: {
    padding: '10px 16px'
  },
  selected: {
    backgroundColor: `${listSelectedBackground} !important;`
  }
});

export const styles = {
  iconsContainer: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    margin: '6px 18px 16px 0'
  },
  collapserContainer: {
    display: 'inline-flex',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginLeft: 12
  },
  contextInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    marginBottom: 8
  },
  dateLabel: { flexWrap: 'nowrap', whiteSpace: 'nowrap', color: colors.darkGrey }
};

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
