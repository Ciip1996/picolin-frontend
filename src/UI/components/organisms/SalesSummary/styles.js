import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  content: {
    width: '100%',
    height: 150,
    paddingTop: 15,
    borderRadius: '0',
    background: 'transparent',
    paddingLeft: 10,
    paddingRight: 10
  },
  cash: {
    width: 115,
    height: 25,
    font: 'normal normal 300 18px/27px Poppins',
    background: '#AD4DFF 0% 0% no-repeat padding-box',
    opacity: '1',
    color: '#FFFF',
    boxShadow: '0px 3px 6px #00000029',
    borderRadius: '24px',
    float: 'right'
  },
  card: {
    width: 115,
    height: 25,
    font: 'normal normal 300 18px/27px Poppins',
    background: '#E26A93 0% 0% no-repeat padding-box',
    opacity: '1',
    color: '#FFFF',
    borderRadius: 24,
    boxShadow: '0px 3px 6px #00000029',
    float: 'right'
  },
  Description: {
    textAlign: 'left',
    font: 'normal normal bold 18px/27px Poppins',
    color: '#2C2C2C',
    marginLeft: '-10px'
  }
});
