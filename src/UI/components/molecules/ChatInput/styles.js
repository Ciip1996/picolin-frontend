import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  input: {
    display: 'none'
  },
  chatInput: {
    position: 'relative',
    margin: '0 auto'
  },
  uploadIcon: {
    position: 'absolute',
    right: 20,
    top: 'calc(100% / 2 - 24px)'
  }
}));
