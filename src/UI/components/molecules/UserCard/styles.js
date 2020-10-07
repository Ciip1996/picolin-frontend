import { colors } from 'UI/res';
import { whiteSpace } from 'UI/utils/styles';
import { makeStyles } from '@material-ui/core/styles';

const userDescription = {
  fontSize: 14,
  color: colors.darkGrey
};

export const styles = {
  root: {
    cursor: 'pointer',
    width: '100%',
    margin: '20px auto',
    elevation: 0.5,
    height: '60px',
    boxShadow: 'rgba(0, 0, 0, 0.11) 0px 3px 6px'
  },
  box: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    display: 'flex'
  }
};

export const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    height: 70,
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    position: 'relative',
    borderBottom: `1px solid ${colors.appBackground}`,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: colors.linkWater
    }
  },
  smsDetail: {
    maxWidth: 350,
    width: '100%',
    marginLeft: 34,
    display: 'grid'
  },
  contactName: {
    fontSize: 16,
    color: colors.black
  },
  time: {
    color: colors.lightText,
    fontSize: 12,
    position: 'absolute',
    top: 5,
    right: 7
  },
  mesage: {
    ...userDescription,
    ...whiteSpace
  }
}));
