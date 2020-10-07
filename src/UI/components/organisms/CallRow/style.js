import { mx32 } from 'UI/constants/dimensions';
import { colors } from 'UI/res';
import { makeStyles } from '@material-ui/core/styles';

export const styles = {
  callTypeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 120
  },
  callType: {
    marginLeft: 10
  },
  missedCall: {
    color: colors.error
  },
  container: {
    padding: mx32,
    height: 72,
    position: 'relative',
    zIndex: 0,
    borderBottom: `1px solid ${colors.lightgrey} `
  },
  containerHover: {
    backgroundColor: colors.lightHover
  }
};

export const useStyles = makeStyles({
  Avatar: {
    fontSize: 16
  },

  userRow: {
    display: 'flex',
    alignItems: 'center'
  },

  itemGridMiddle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.darkGrey,
    fontSize: 15
  },
  itemGridEnd: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    paddingRight: 30
  },
  time: {
    color: colors.lightText,
    fontSize: 12,
    position: 'absolute',
    top: 5,
    right: 7
  },
  contactInfo: {
    marginLeft: 30
  },
  contactName: {
    fontSize: 16,
    color: colors.black
  },
  number: {
    fontSize: 14,
    color: colors.darkGrey
  }
});
