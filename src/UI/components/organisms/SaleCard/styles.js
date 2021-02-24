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
    background: colors.white,
    padding: 16,
    border: props => props.error && `1px solid ${theme.palette.error.main}`
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
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
    paddingRight: 32,
    display: 'flex',
    flex: 4
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
  errorMessage: {
    position: 'absolute',
    top: 8
  },
  amountOfProducts: {
    flex: 0,
    display: 'flex'
  },
  cost: {
    flex: 2,
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: 10,
    color: '#AD4DFF',
    textAlign: 'right'
  },
  name: {
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    width: '100%',
    marginTop: 10,
    marginBottom: 10
  }
}));
