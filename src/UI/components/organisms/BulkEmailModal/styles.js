import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

export const useStyles = makeStyles(theme => ({
  bulkEmailModalContainer: {
    position: 'absolute',
    margin: 'auto',
    left: 0,
    right: 0,
    top: 'calc(100% / 2 - 40%)',
    width: '95%',
    height: '80%',
    maxWidth: '1167px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: 4
  }
}));

const schedulePopTitle = 50;

const sharedOptionsStyle = {
  fontSize: 14,
  fontWeight: 300,
  cursor: 'pointer',
  border: 'unset'
};

const popOverContentUnits = {
  width: 320,
  height: 260
};

export const usePaperStyles = makeStyles({
  root: {
    width: 'max-content',
    position: 'absolute',
    margin: '0 auto',
    left: `calc(100% / 2 - ${`${popOverContentUnits.width / 2}px`})`,
    top: `calc(0% - ${`${popOverContentUnits.height + 20}px`})`
  },
  arrowPosition: {
    position: 'absolute',
    margin: '0 auto',
    left: `calc(100% / 2 - 12px)`,
    bottom: -17
  },
  popOverContent: {
    position: 'relative',
    height: popOverContentUnits.height,
    backgroundColor: colors.lightgrey,
    boxShadow: 'unset',
    width: popOverContentUnits.width
  },
  svgContainer: {
    margin: '0 auto',
    width: 'min-content',
    position: 'relative',
    top: -10,
    left: 'unset !important'
  },
  svgBox: {
    margin: '0 auto',
    width: 'min-content',
    height: 20
  },
  scheduleInputs: {
    width: '100%',
    margin: '0 auto',
    padding: '20px 0 ',
    height: `calc(100% - ${`${schedulePopTitle}px`})`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxWidth: 238
  },
  datePickerContainer: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  dateTitle: {
    marginBottom: 15
  },
  labels: {
    fontSize: 14,
    backgroundColor: '#ececec',
    height: schedulePopTitle,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 700,
    margin: 0
  },
  arrowBack: {
    paddingRight: 2
  },
  scheduleOptions: {
    ...sharedOptionsStyle
  },
  pickDateOption: {
    ...sharedOptionsStyle,
    display: 'flex',
    alignItems: 'center'
  },
  scheduleDivider: {
    margin: 0,
    width: '100%'
  },
  overrides: {
    MuiPopover: {
      root: {
        zIndex: 5000
      }
    }
  }
});

export const styles = {
  header: {
    display: 'flex',
    padding: '0 20px',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 72,
    backgroundColor: colors.sideBar
  },
  content: {
    height: 'calc(100% - 72px)',
    display: 'flex'
  },
  controls: {
    width: 197,
    height: '100%',
    minWidth: 197,
    boxShadow: '0px 3px 6px #00000019',
    borderRight: '1px solid #eaeaea'
  },
  controlMenu: {
    display: 'flex',
    height: 48,
    alignItems: 'center',
    padding: '0 20px',
    cursor: 'pointer'
  },
  controlMenuActive: {
    backgroundColor: colors.linkWater
  },
  controlMenuHover: {
    backgroundColor: '#e5eafa9e'
  },
  footer: {
    position: 'absolute',
    height: 100,
    bottom: 0,
    backgroundColor: colors.sideBar,
    display: 'flex',
    padding: '0 20px',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%'
  },
  scheduleActionButton: {
    margin: '0 auto',
    width: '100%'
  },
  popOverContainer: {
    position: 'relative'
  }
};
