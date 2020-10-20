import { makeStyles } from '@material-ui/core/styles';
import { input } from 'UI/constants/dimensions';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

export const useStyles = makeStyles(theme => ({
  root: {
    ...theme.input,
    height: 'unset',
    '& input': {
      height: 3,
      borderRadius: input.borderRadius,
      backgroundColor: props =>
        props.outPutValue ? `${colors.appBackground} !important` : 'unset',
      color: props => props.outPutValue && `${colors.black} !important`
    },
    '& label': {
      color: props => props.outPutValue && `${colors.darkGrey} !important `,
      ...theme.input['& label']
    },
    '& fieldset': {
      ...theme.input['& fieldset'],
      borderColor: props => props.outPutValue && `${colors.darkGrey} !important`
    },
    '& > div': {
      '& > textarea': {
        width: props => props.rows === 1 && '90%'
      }
    }
  }
}));
