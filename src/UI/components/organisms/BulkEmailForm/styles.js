import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

const flex = {
  display: 'flex',
  alignItems: 'center'
};

const sharedInputValues = {
  width: '100%',
  maxWidth: 135
};

export const useStyles = makeStyles({
  main: {
    width: '100%',
    height: 'calc(100% - 100px)'
  },
  container: {
    padding: '5px 20px',
    height: '100%',
    overflow: 'auto'
  },
  flexCenter: {
    ...flex
  },
  inputContainer: {
    ...sharedInputValues
  }
});

const sharedValueLabel = {
  fontSize: 14,
  marginLeft: 10
};

export const resendStyles = makeStyles({
  flexCenter: {
    ...flex
  },
  resendTitle: {
    fontSize: 16,
    marginRight: 25
  },
  formLabel: {
    ...sharedValueLabel
  },
  formLabelError: {
    ...sharedValueLabel,
    color: colors.error
  },
  formContainer: {
    height: '100%',
    ...flex,
    paddingTop: 5
  },
  radioDivider: {
    marginRight: 18
  },
  inputContainer: {
    ...sharedInputValues
  }
});
