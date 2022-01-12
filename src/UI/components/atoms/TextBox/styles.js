import { makeStyles } from '@material-ui/core/styles';
import { input } from 'UI/constants/dimensions';
import { colors } from 'UI/res';
import styled from 'styled-components';
import { FormControl, FormHelperText, TextField } from '@material-ui/core';

export const StyledFormControl = styled(FormControl)`
  flex-direction: column;
  width: inherit;
  height: max-content;
`;

export const StyledFormHelperText = styled(FormHelperText)`
  display: flex;
  flex: 1;
`;
export const StyledTextField = styled(TextField)`
  display: flex;
  flex: 1;
`;

export const useStyles = makeStyles(theme => ({
  root: {
    ...theme.input,
    height: 'unset',
    '& input': {
      height: 3,
      borderRadius: input.borderRadius,
      backgroundColor: props =>
        props.outPutValue ? `${colors.appBackground} !important` : 'unset',
      color: props => props.outPutValue && `${colors.black} !important`,
      zIndex: 1
    },
    '& label': {
      color: props => props.outPutValue && `${colors.darkGrey} !important `,
      ...theme.input['& label']
    },
    '& fieldset': {
      ...theme.input['& fieldset']
      // borderColor: props => props.outPutValue && `${colors.darkGrey} !important`
    },
    '& > div': {
      '& > textarea': {
        width: props => props.rows === 1 && '90%',
        zIndex: 10
      }
    }
  }
}));
