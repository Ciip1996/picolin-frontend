import { makeStyles } from '@material-ui/core/styles';
import { mx32, mx24 } from 'UI/constants/dimensions';
import { colors } from 'UI/res';
import { flexAlignCenter, flexAlignCenterFlexEnd } from 'UI/utils/styles';

const modalHeight = 365;
const modalPadding = {
  padding: mx32
};

export const useStyles = makeStyles(theme => ({
  modal: {
    ...theme.modalSettings,
    top: `calc(100% / 2 - ${`${modalHeight / 2}px`})`,
    height: modalHeight,
    maxWidth: '1417px'
  },
  modalHeader: {
    height: 72,
    ...modalPadding,
    backgroundColor: colors.sideBar,
    ...flexAlignCenter
  },
  contentContainer: {
    ...modalPadding
  },
  textBoxContainer: {
    width: '100%',
    maxWidth: 533,
    margin: '20px 0'
  },
  actionsBar: {
    height: 110,
    position: 'absolute',
    ...flexAlignCenterFlexEnd,
    width: '100%',
    bottom: 0,
    ...modalPadding
  },
  actionsDivider: {
    padding: mx24
  }
}));
