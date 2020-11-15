import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const useStyles = makeStyles({
  card: {
    width: '100%',
    height: '96px',
    boxShadow: '0px 3px 6px #00000029',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    marginTop: '26px',
    background: 'white'
  },
  title: {
    marginTop: '23px',
    marginLeft: '6px',
    marginBottom: '0px',
    width: '220px',
    height: '30px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    font: 'normal normal normal 22px/30px Avenir',
    color: colors.title,
    float: 'left',
    opacity: '1',
    letterSpacing: '0px'
  },
  subtitle: {
    marginTop: '23px',
    marginRight: '48%',
    marginBottom: '0px',
    font: 'normal normal 900 20px/27px Avenir',
    color: '#AD4DFF',
    textOverflow: 'ellipsis',
    textAlign: 'Right',
    overflow: 'hidden',
    width: '120px',
    opacity: '1',
    float: 'right',
    letterSpacing: '0px'
  },
  List: {
    marginTop: '-20px'
  },
  Item: {
    height: '27px',
    marginTop: '17px'
  },
  Gender: {
    width: '87%',
    height: '25px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    backgroundColor: '#ED8A9C',
    font: 'normal normal 900 14px/19px Avenir',
    boxShadow: '0px 3px 6px #00000029',
    marginLeft: '22px',
    color: '#FFFF',
    marginTop: '11px'
  },
  Size: {
    width: '87%',
    height: '25px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    backgroundColor: '#ED8A9C',
    font: 'normal normal 900 14px/19px Avenir',
    boxShadow: '0px 3px 6px #00000029',
    marginLeft: '38px',
    color: '#FFFF',
    marginTop: '11px'
  },
  Type: {
    width: '87%',
    height: '25px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    backgroundColor: '#ED8A9C',
    font: 'normal normal 900 14px/19px Avenir',
    boxShadow: '0px 3px 6px #00000029',
    marginLeft: '54px',
    color: '#FFFF',
    marginTop: '11px'
  },
  Color: {
    width: '87%',
    height: '25px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    backgroundColor: '#ED8A9C',
    font: 'normal normal 900 14px/19px Avenir',
    boxShadow: '0px 3px 6px #00000029',
    marginLeft: '74px',
    color: '#FFFF',
    marginTop: '11px'
  },
  Delete: {
    backgroundColor: '#F7FAFE',
    color: '#C7D2DB',
    marginLeft: '85%',
    marginTop: '-80px'
  }
});
