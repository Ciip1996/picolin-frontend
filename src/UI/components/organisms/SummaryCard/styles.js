import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const useStyles = makeStyles({
  card: {
    width: '398px',
    height: 'fit-content',
    paddingBottom: 24,
    boxShadow: '0px 3px 6px #00000029',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    background: 'white'
  },
  title: {
    marginTop: 23,
    marginLeft: 35,
    marginBottom: 9,
    font: 'normal normal bold 24px/35px Poppins',
    color: '#515C6F',
    opacity: '0.5',
    letterSpacing: '1.68px'
  },
  formulary: {
    marginTop: '16px',
    marginLeft: '28px',
    width: '343px',
    height: '40px'
  },
  invoice: {
    marginBottom: '10px',
    marginLeft: '270px',
    color: colors.title
  },
  List: {
    marginLeft: '24px',
    marginRight: '24px'
  },
  Description: {
    font: 'normal normal 300 14px/21px Poppins',
    color: '#515C6F',
    height: '20px',
    letterSpacing: '0.98px',
    textTransform: 'uppercase',
    opacity: '0.5',
    marginLeft: '-16px',
    marginRight: '300px',
    width: '87px'
  },
  Item: {
    height: 50
  },
  currencyValue: {
    font: 'normal normal 300 18px/27px Poppins',
    opacity: '1',
    color: '#515C6F',
    textAlign: 'Right',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '200px',
    float: 'right',
    marginRight: '-16px'
  },
  Total: {
    font: 'normal normal bold 20px/30px Poppins',
    color: '#515C6F',
    height: '28px',
    letterSpacing: '1.4px',
    textTransform: 'uppercase',
    opacity: '0.5',
    marginLeft: '-16px',
    marginRight: '300px',
    width: '69px'
  },
  TotalCost: {
    font: 'normal normal bold 26px/39px Poppins',
    opacity: '1',
    color: '#515C6F',
    height: '36px',
    width: '200px',
    float: 'right',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textAlign: 'Right',
    marginRight: '-16px'
  },
  submitButton: {
    width: '171px',
    height: '48px'
    // marginLeft: '201px'
  }
});
