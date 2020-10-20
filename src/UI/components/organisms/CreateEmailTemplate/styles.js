import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { makeStyles } from '@material-ui/core/styles';
import { mx32, mx24, m32, inventorySectionHeader } from 'UI/constants/dimensions';
import { flexAlignCenter, flexAlignCenterFlexEnd } from 'UI/utils/styles';

const modalHeight = 453;
const modalPadding = {
  padding: mx32
};

export const useStyles = makeStyles(theme => ({
  main: {
    position: 'relative',
    height: '100%',
    width: '100%'
  },
  footer: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    bottom: 0,
    width: '100%',
    height: 100,
    padding: '0 20px',
    backgroundColor: colors.sideBar
  },
  modal: {
    ...theme.modalSettings,
    top: `calc(100% / 2 - ${`${modalHeight / 2}px`})`,
    height: modalHeight,
    maxWidth: props => (props.isBulkEmailModal ? '920px' : ' 1417px')
  },
  modalHeader: {
    height: inventorySectionHeader,
    ...modalPadding,
    ...flexAlignCenter,
    borderBottom: `1px solid ${colors.lightgrey}`
  },
  contentContainer: {
    ...modalPadding
  },
  textBoxContainer: {
    width: '100%',
    margin: '17px 0',
    ...flexAlignCenter,
    fontSize: 16
  },
  textBoxContainerLabel: {
    width: 181,
    padding: '0 20px',
    whiteSpace: 'nowrap'
  },
  textBoxContainerInput: {
    maxWidth: 947,
    width: 'min(100%, 72%)',
    paddingRight: m32
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
  },
  ckEditorContainer: {
    height: 'calc(100% - 421px)',
    overflow: 'auto'
  }
}));
