import { makeStyles } from '@material-ui/core/styles';
import { mx32 } from 'UI/constants/dimensions';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { flexAlignCenter } from 'UI/utils/styles';

const modalTitle = 72;
const modalActions = 101;
const modalContentHeight = `calc(100% - ${`${modalTitle + modalActions}px`})`;

const modalHeight = 398;
const modalPosition = modalHeight / 2;

export const useStyles = makeStyles(() => ({
  // Modal
  paper: {
    position: 'absolute',
    backgroundColor: colors.white,
    left: 0,
    right: 0,
    margin: 'auto',
    width: '92%',
    maxWidth: 1417,
    height: modalHeight,
    top: `calc(100% / 2 - ${`${modalPosition}px`})`,
    border: 'unset'
  },
  modalTitle: {
    height: 72,
    backgroundColor: colors.notificationRead,
    fontSize: 26,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    margin: mx32
  },
  modalContent: {
    height: modalContentHeight,
    margin: mx32
  },
  modalActions: {
    height: modalActions,
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: colors.notificationRead,
    alignItems: 'center',
    margin: mx32
  },
  modalInputsContainer: {
    padding: '0 48px 0 0',
    width: '100%',
    maxWidth: 543
  },
  infoIcon: {
    marginLeft: 15
  },
  checkBoxContainer: {
    ...flexAlignCenter
  },
  checkBoxtitle: {
    color: colors.offlineGray
  }
}));
