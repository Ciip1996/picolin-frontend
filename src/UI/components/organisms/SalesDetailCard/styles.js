import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  card: {
    width: '398px',
    maxheight: '568px',
    boxShadow: '0px 3px 6px #00000029',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    background: 'white'
  },
  title: {
    marginTop: '23px',
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
    color: '#94A6B3'
  },
  List: {
    marginTop: '-20px',
    marginLeft: '24px',
    marginRight: '24px',
    float: 'center',
    maxHeight: '40px',
    width: '80%',
    overflowY: 'scroll',
    overflowX: 'hidden'
  },
  Description: {
    font: 'normal normal 300 14px/21px Poppins',
    color: '#515C6F',
    height: '20px',
    letterSpacing: '0.98px',
    textAlign: 'Left',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textTransform: 'uppercase',
    float: 'left',
    opacity: '0.5',
    marginLeft: '-16px',
    marginRight: '300px',
    width: '50%'
  },
  Item: {
    height: '38px'
  },
  CostDescription: {
    font: 'normal normal 300 18px/27px Poppins',
    opacity: '1',
    color: '#515C6F',
    textAlign: 'Right',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '30%',
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
    marginTop: '-100px',
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
  }
});
