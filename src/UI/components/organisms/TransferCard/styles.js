import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const useStyles = makeStyles(theme => ({
  card: {
    position: 'relative',
    width: '100%',
    height: 'auto',
    boxShadow: '0px 3px 6px #00000029',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    marginTop: '26px',
    background: 'white',
    padding: 24,
    border: props => props.error && `1px solid ${theme.palette.error.main}`
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  title: {
    height: '30px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: colors.title,
    opacity: '1',
    letterSpacing: '0px',
    whiteSpace: 'nowrap',
    width: '100%',
    paddingRight: 32
  },
  Chip: {
    flex: 1,
    display: 'flex',
    height: '30px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    backgroundColor: '#FAFBFD',
    font: 'normal normal 900 14px/19px Avenir',
    boxShadow: '0px 3px 6px #00000029',
    color: colors.black
  },
  deleteButton: {
    height: 32,
    width: 32,
    backgroundColor: theme.palette.error.main,
    color: colors.white
  },
  deleteButtonWrapper: { position: 'absolute', right: 15, top: 15 },
  errorMessage: {
    position: 'absolute',
    top: 8
  }
}));
