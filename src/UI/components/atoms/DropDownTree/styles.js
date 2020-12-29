import { makeStyles } from '@material-ui/core/styles';
import { input } from 'UI/constants/dimensions';

export const useStylesTreeView = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    padding: '0 20px'
  }
});

export const useStyles = makeStyles({
  root: {
    width: '100%',
    '& fieldset': {
      borderRadius: input.borderRadius,
      backgroundColor: 'unset !important'
    }
  },
  select: {
    height: '100%',
    '& > div': {
      borderRadius: `${`${input.borderRadius}px`} !important`,
      height: '100%',
      padding: '0 20px',
      backgroundColor: 'unset !important',
      display: 'flex',
      alignItems: 'center'
    }
  },
  formControl: {
    minWidth: 120,
    width: '100%',
    height: 40,
    margin: 0,
    '& label': {
      transform: 'translate(0, 14px) scale(1)'
    }
  },
  button: {
    fontSize: 14,
    textTransform: 'capitalize'
  },
  firstMenu: {
    backgroundColor: 'unset !important  '
  }
});
