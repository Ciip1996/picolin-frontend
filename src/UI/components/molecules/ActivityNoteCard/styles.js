import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

export const styles = {
  regularLabel: {
    color: colors.inactiveInputText
  },
  htmlContent: {
    color: colors.inactiveInputText,
    fontSize: 14,
    height: 40,
    overflow: 'hidden'
  }
};

export const useStyles = makeStyles({
  root: {
    position: 'relative',
    margin: 12
  },
  buttonsContainer: {
    zIndex: 1,
    position: 'absolute',
    right: 10,
    top: 5
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%'
  },
  avatarWrapper: {
    marginLeft: 11,
    marginRight: 11,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  content: {
    marginLeft: 13,
    marginRight: 13,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%'
  }
});
