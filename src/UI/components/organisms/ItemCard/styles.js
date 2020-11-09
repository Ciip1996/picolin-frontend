import { makeStyles } from '@material-ui/core/styles';

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
    marginLeft: '20px',
    marginBottom: '0px',
    font: 'normal normal normal 22px/30px Avenir',
    color: '#94A6B3',
    float: 'left',
    opacity: '1',
    letterSpacing: '0px'
  },
  title2: {
    marginTop: '23px',
    marginRight: '76px',
    marginBottom: '0px',
    font: 'normal normal 900 20px/27px Avenir',
    color: '#AD4DFF',
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
  Chip: {
    width: '120px',
    height: '25px',
    backgroundColor: '#ED8A9C',
    font: 'normal normal 900 14px/19px Avenir',
    boxShadow: '0px 3px 6px #00000029',
    marginLeft: '34px',
    color: '#FFFF',
    marginTop: '11px'
  },
  Chip2: {
    width: '120px',
    height: '25px',
    backgroundColor: '#ED8A9C',
    font: 'normal normal 900 14px/19px Avenir',
    boxShadow: '0px 3px 6px #00000029',
    marginLeft: '34px',
    color: '#FFFF',
    marginTop: '11px'
  },
  Circle: {
    backgroundColor: '#F7FAFE',
    color: '#C7D2DB',
    marginLeft: '20px',
    marginTop: '-16px'
  }
});
