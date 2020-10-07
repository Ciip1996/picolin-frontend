import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

export const styles = {
  divider: {
    height: 1,
    margin: '32px 0'
  },
  tightDivider: {
    height: 1,
    margin: 0
  },
  historyContainer: {
    marginTop: 32
  }
};

export const FieldContainer = withStyles(() => ({
  root: {
    marginBottom: 24,
    '& > *:first-child': {
      marginBottom: 12
    }
  }
}))(Box);
