import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { container, inventorySectionHeader } from 'UI/constants/dimensions';
import { makeStyles } from '@material-ui/core/styles';

const sharedChipStyles = {
  position: 'absolute',
  right: 20,
  top: 'calc(100% / 2 - 12px)',
  width: 30,
  display: 'flex',
  justifyContent: 'center',
  borderRadius: 10,
  pointerEvents: 'none',
  fontSize: 12
};

export const toolTipStyles = makeStyles({
  tooltip: {
    backgroundColor: '#e8e8e8',
    color: colors.black,
    transform: 'scale(1.3) !important'
  },
  arrow: {
    top: 'calc(100% / 2 - 1em)',
    '&::before': {
      backgroundColor: '#e8e8e8'
    }
  }
});

export const chipStyles = makeStyles({
  container: {
    position: 'relative',
    sizeSmall: {
      ...sharedChipStyles,
      backgroundColor: colors.linkWater
    }
  },
  chip: {
    ...sharedChipStyles,
    backgroundColor: colors.linkWater
  },
  chipHover: {
    ...sharedChipStyles,
    backgroundColor: colors.white
  }
});

export const menuStyles = makeStyles({
  controlMenu: {
    display: 'flex',
    height: 48,
    alignItems: 'center',
    padding: '0 20px',
    cursor: 'pointer',
    justifyContent: props => (props.isResponsiveItem ? 'center' : null),
    '&:hover': {
      backgroundColor: '#e5eafa9e'
    }
  },
  controlMenuActive: {
    backgroundColor: colors.linkWater
  }
});

export const useStyles = makeStyles({
  mainContainer: {
    width: '100%',
    margin: '40px 36px'
  },
  head: {
    marginBottom: 32
  },
  areaContent: {
    width: '100%',
    backgroundColor: colors.white,
    display: 'grid',
    marginBottom: 40,
    ...container,
    gridTemplateRows: 'minmax(200px, 700px)'
  },
  infoContainer: {
    gridColumn: '2/3',
    gridRow: 1
  },
  sideControls: {
    width: '100%',
    backgroundColor: colors.sideBar,
    borderRight: '1px solid #eaeaea',
    gridColumn: '1/2',
    gridRow: 1
  },
  containerButton: {
    display: 'flex',
    alignItems: 'center',
    height: inventorySectionHeader,
    justifyContent: 'center'
  },
  actionButtonResponsive: {
    width: 80,
    margin: '0 auto'
  },
  actionButton: {
    width: 201,
    margin: '0 auto'
  }
});
