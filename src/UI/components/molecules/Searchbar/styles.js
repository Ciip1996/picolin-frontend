import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { input } from 'UI/constants/dimensions';

export const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 389,
    height: input.height,
    borderRadius: input.borderRadius,
    borderColor: '#CDD8E6',
    borderWidth: 1
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    color: colors.black
  },
  iconButton: {
    color: colors.middleGrey,
    '&:hover': {
      '& path': {
        fill: colors.middleGrey
      }
    }
  }
}));
