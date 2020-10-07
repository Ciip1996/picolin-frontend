import { colors } from 'UI/res';
import { makeStyles } from '@material-ui/core/styles';

export const styles = {
  emptyImage: {
    margin: '6% 0'
  },
  NoContent: {
    opacity: '0.2',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export const useStyles = makeStyles({
  mainContainer: {
    display: 'flex',
    height: '100%'
  },
  itemsContainer: {
    maxWidth: 497,
    position: 'relative',
    width: '100%',
    backgroundColor: colors.white,
    borderRight: '1px solid rgb(234, 234, 234)',
    height: '100%',
    overflowY: 'auto'
  },
  templateBox: {
    height: '100%',
    width: '100%',
    display: 'flex',
    backgroundColor: colors.white,
    position: 'relative'
  },

  emptyStateBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },

  emptyStateButton: {
    margin: '10px auto 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
