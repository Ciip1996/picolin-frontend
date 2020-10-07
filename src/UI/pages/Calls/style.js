import { makeStyles } from '@material-ui/core/styles';
import { layout, container, mx32, inventorySectionHeader } from 'UI/constants/dimensions';
import { colors } from 'UI/res';
import { flexAlignCenter } from 'UI/utils/styles';

export const useStyles = makeStyles(() => ({
  mainContainer: {
    ...container,
    maxWidth: layout.mainPageContentWidth.maxWidth,
    marginTop: 57,
    backgroundColor: colors.white,
    height: 'calc(100% - 148px)'
  },
  topBar: {
    padding: mx32,
    height: inventorySectionHeader,
    ...flexAlignCenter,
    justifyContent: 'space-between',
    boxShadow: '0px 3px 2px 0px #b9b9b924',
    position: 'relative',
    zIndex: 1
  },
  autoComplete: {
    maxWidth: 368,
    width: '100%'
  },
  callsContent: {
    height: `calc(100% - ${`${inventorySectionHeader}px`})`,
    position: 'relative',
    zIndex: 0,
    overflow: 'auto'
  }
}));
