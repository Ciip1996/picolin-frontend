import { colors } from 'UI/res';
import { makeStyles } from '@material-ui/core/styles';

const resposiveActionsHeight = 65;
const sharedStyle = {
  overflowY: 'auto',
  padding: 16
};

export const useStyles = makeStyles({
  main: {
    height: '100%',
    ...sharedStyle
  },
  mainResponsive: {
    height: `calc(100% - ${`${resposiveActionsHeight}px`})`,
    ...sharedStyle
  },
  infoContainer: {
    marginBottom: 30
  },
  initialData: {
    display: 'flex',
    fontSize: 14
  },
  subtitle: {
    width: 80,
    fontWeight: 700
  },
  dateColor: {
    color: colors.success
  },
  content: {
    fontSize: 14,
    fontWeight: 300
  },
  actionsResponsive: {
    height: resposiveActionsHeight,
    backgroundColor: colors.sideBar,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 20px 0 0',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%'
  }
});
