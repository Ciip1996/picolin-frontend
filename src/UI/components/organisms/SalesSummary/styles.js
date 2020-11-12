import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  content: {
    width: '240px',
    height: '104px',
    opacity: '1',
    borderRadius: '0',
    background: '#EFF1F5EF',
    float: 'left'
  },
  cash: {
    width: '115px',
    height: '25px',
    font: 'normal normal 300 18px/27px Poppins',
    background: '#AD4DFF 0% 0% no-repeat padding-box',
    opacity: '1',
    color: '#FFFF',
    borderRadius: '24px',
    float: 'right'
  },
  card: {
    width: '115px',
    height: '25px',
    font: 'normal normal 300 18px/27px Poppins',
    background: '#E26A93 0% 0% no-repeat padding-box',
    opacity: '1',
    color: '#FFFF',
    borderRadius: '24px',
    float: 'right'
  },
  Description: {
    textAlign: 'left',
    font: 'normal normal bold 18px/27px Poppins',
    color: '#2C2C2C',
    marginLeft: '-10px'
  }
});
