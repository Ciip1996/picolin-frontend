import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/res';

export const useStyles = makeStyles({
  card: {
    width: '398px',
    minHeight: '568px',
    boxShadow: '0px 3px 6px #00000029',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    background: colors.white
  },
  title: {
    marginLeft: '24px',
    marginBottom: '0px',
    font: 'normal normal bold 24px/35px Poppins',
    color: '#515C6F',
    opacity: '0.5',
    letterSpacing: '1.68px'
  },
  Formulary: {
    marginTop: '9px',
    marginLeft: '28px',
    width: '343px',
    height: '40px'
  },
  Invoice: {
    marginBottom: '10px',
    marginLeft: '270px',
    color: colors.title
  },
  List: {
    marginTop: '4px',
    marginLeft: '24px',
    marginRight: '24px',
    float: 'center',
    maxHeight: '200px',
    width: '90%',
    overflowY: 'scroll',
    overflowX: 'hidden',
    overflow: 'hidden'
  },
  Resume: {
    marginLeft: '24px',
    marginRight: '24px',
    float: 'center',
    width: '90%'
  },
  Description: {
    font: 'normal normal 300 14px/21px Poppins',
    color: '#515C6F',
    height: '200px',
    marginLeft: '-16px',
    letterSpacing: '0.98px',
    textAlign: 'Left',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textTransform: 'uppercase',
    opacity: '0.5',
    width: '50%'
  },
  ScrollDescription: {
    marginLeft: '-15px',
    font: 'normal normal 300 14px/21px Poppins',
    color: '#515C6F',
    textAlign: 'Left',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '200px',
    height: '30px',
    marginTop: '10px',
    float: 'left',
    opacity: '0.5'
  },
  Item: {
    height: '50px'
  },
  Content: {
    height: '36px'
  },
  CostDescription: {
    font: 'normal normal 300 18px/27px Poppins',
    opacity: '1',
    color: '#515C6F',
    textAlign: 'Right',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginRight: '-15px',
    width: '200px',
    float: 'right'
  },
  ScrollCostDescription: {
    font: 'normal normal 300 18px/27px Poppins',
    opacity: '1',
    color: '#515C6F',
    textAlign: 'Right',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '110px',
    float: 'right'
  },
  Total: {
    font: 'normal normal bold 20px/30px Poppins',
    color: '#515C6F',
    height: '28px',
    letterSpacing: '1.4px',
    textTransform: 'uppercase',
    opacity: '0.5',
    marginLeft: '60px',
    marginTop: '120px',
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
  Finish: {
    width: '171px',
    height: '48px',
    marginLeft: '201px'
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    padding: 10
  },
  noMaxWidth: {
    maxWidth: 'none'
  }
});
