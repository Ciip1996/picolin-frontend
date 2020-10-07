import { makeStyles } from '@material-ui/core/styles';
import { layout, container, mx32 } from 'UI/constants/dimensions';
import { colors } from 'UI/res';
import { flexAlignCenter, flexAlignCenterSpaceBetween } from 'UI/utils/styles';

const topBarHeight = 94;

const gridColumnValue = 'minmax(280px, 489px) minmax(350px, 1fr)';

const firstContentColumn = {
  maxWidth: 489,
  width: '100%',
  gridColumn: '1 /2',
  gridRow: '1 /2'
};

const secondContentColumn = {
  maxWidth: 1059,
  width: '100%'
};

const modalTitle = 72;
const modalActions = 101;
const modalContentHeight = `calc(100% - ${`${modalTitle + modalActions}px`})`;

const modalHeight = 398;
const modalPosition = modalHeight / 2;

const chatInputContainer = 142;

export const useStyles = makeStyles(() => ({
  mainContainer: {
    ...container,
    maxWidth: layout.mainPageContentWidth.maxWidth,
    marginTop: 57,
    backgroundColor: colors.white,
    height: 'calc(100% - 148px)',
    minHeight: props => props.minHeight,
    marginBottom: props => props.marginBottom
  },
  topBar: {
    height: topBarHeight,
    display: 'grid',
    boxShadow: '0px 3px 2px 0px #b9b9b924',
    position: 'relative',
    zIndex: 1,
    gridTemplateRows: '1fr',
    gridTemplateColumns: gridColumnValue
  },
  smsTitle: {
    fontSize: 18,
    fontWeight: 700
  },
  autoCompleteContainer: {
    ...firstContentColumn,
    position: 'relative',
    ...flexAlignCenter
  },
  autoCompleteDivider: {
    right: 0,
    left: 'unset',
    backgroundColor: '#CDD8E6',
    height: 64,
    alignSelf: 'center',
    margin: 0
  },
  autoComplete: {
    width: '86%',
    margin: '0 auto'
  },
  tobBarContent: {
    ...flexAlignCenterSpaceBetween,
    maxWidth: 1059,
    width: '100%',
    padding: '0 53px 0 35px'
  },
  smsContentContainer: {
    height: `calc(100% - ${`${topBarHeight}px`})`,
    position: 'relative',
    zIndex: 0,
    overflow: 'auto',
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: gridColumnValue
  },
  userSms: {
    ...firstContentColumn,
    height: '100%',
    overflow: 'auto',
    position: 'relative'
  },

  FAB: {
    position: 'sticky',
    bottom: 20,
    right: 20,
    marginLeft: 'auto',
    width: 'max-content'
  }, // Modal
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
  smsContent: {
    ...secondContentColumn,
    height: '100%',
    position: 'absolute',
    gridColumn: '2/3',
    gridRow: '1'
  },
  emptyStateContainer: {
    width: 'max-content',
    margin: '60px auto 0'
  },
  titleContainer: {
    margin: '0 auto',
    width: 'max-content',
    textAlign: 'center',
    marginBottom: 80
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 700,
    margin: 0
  },
  emptyStateSubtitle: {
    fontSize: 18,
    fontWeight: 300,
    margin: 0
  },
  chatContent: {
    width: '100%',
    height: `calc(100% - ${`${chatInputContainer}px`})`,
    overflow: 'auto',
    padding: '0 27px'
  },
  input: {
    display: 'none'
  },
  chatInputContainer: {
    height: chatInputContainer,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: colors.sideBar,
    flexDirection: 'column'
  },
  chatInput: {
    position: 'relative',
    margin: '0 auto',
    width: '87%'
  },
  userWriting: {
    fontSize: 14,
    fontWeight: 300,
    color: colors.darkGrey,
    padding: '0 58px'
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
