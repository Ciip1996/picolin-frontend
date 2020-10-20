import { inventorySectionHeader } from 'UI/constants/dimensions';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { makeStyles } from '@material-ui/core/styles';

const actionsHeight = 100;
const containerWithActionsHeight = inventorySectionHeader + actionsHeight;

export const useStyles = makeStyles({
  main: {
    height: '100%',
    position: 'relative'
  },
  templatesContainer: {
    height: `calc(100% - ${`${inventorySectionHeader}px`})`,
    borderTop: '5px solid #f0f3f7'
  },
  containerWithActions: {
    height: `calc(100% - ${`${containerWithActionsHeight}px`})`
  },
  actions: {
    height: actionsHeight,
    backgroundColor: colors.sideBar,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 20px 0 0'
  },
  floatingActionButton: {
    position: 'sticky',
    bottom: 20,
    right: 20,
    width: 'max-content',
    marginLeft: 'auto'
  }
});
