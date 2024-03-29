import { colors } from 'UI/res';

const containerXPadding = 24;

export const styles = {
  drawerContainer: {
    width: 565,
    height: '100vh',
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 11,
    boxShadow: '-32px 0px 32px #00000017',
    padding: `62px 0 0`,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.picolinBackground
  },
  blueDrawer: {
    background: '#E26A93',
    borderLeft: `8px solid ${colors.success}`
  },
  customDrawer: {
    borderLeft: `8px solid red`
  },
  drawerToolbar: {
    position: 'sticky',
    width: '100%',
    bottom: 0,
    backgroundColor: colors.sideBar,
    display: 'flex',
    height: 88,
    zIndex: 11,
    padding: `20px ${containerXPadding}px`,
    boxShadow: '0px -8px 16px #0000000A'
  },
  drawerTopToolbar: {
    position: 'absolute',
    right: 12,
    top: 12
  },
  drawerContent: {
    flexGrow: 1,
    padding: `0 ${containerXPadding}px 16px`
  },
  drawerTitle: {
    padding: `0 ${containerXPadding}px`,
    marginBottom: 16,
    marginLeft: 0,
    font: 'normal normal bold 32px/48px Poppins'
  }
};
