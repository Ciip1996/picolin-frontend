import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => {
  return {
    regular: {
      margin: theme.spacing(0)
    },
    cropped: {
      margin: theme.spacing(0),
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      display: 'flow-root'
    }
  };
});
