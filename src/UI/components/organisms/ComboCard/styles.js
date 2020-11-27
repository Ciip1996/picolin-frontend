import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
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
    padding: 16,
    border: props => props.error && `1px solid ${theme.palette.error.main}`
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1
  },
  title: {
    height: 30,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: colors.title,
    opacity: 1,
    letterSpacing: '0px',
    whiteSpace: 'nowrap',
    minWidth: 180,
    maxWidth: 300,
    marginRight: 12
  },
  price: {
    display: 'flex',
    font: 'normal normal 900 20px/27px Avenir',
    color: '#AD4DFF',
    width: 'auto',
    opacity: '1',
    letterSpacing: '0px',
    justifyContent: 'flex-end',
    flex: 1,
    paddingRight: 10
  },
  chip: {
    width: '87%',
    height: '25px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    backgroundColor: '#ED8A9C',
    font: 'normal normal 900 14px/19px Avenir',
    boxShadow: '0px 3px 6px #00000029',
    color: '#FFFF'
  },
  List: {
    marginTop: '-20px'
  },
  Item: {
    height: '27px',
    marginTop: '17px'
  },
  deleteButton: {
    height: 32,
    width: 32,
    backgroundColor: theme.palette.error.main,
    color: colors.white
  }
}));
