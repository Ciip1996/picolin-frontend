import { layout, navBarHeight } from 'UI/constants/dimensions';
import { colors } from 'UI/res/colors';

export const styles = {
  inlineContainer: {
    width: layout.sideFiltersWidth,
    height: `calc(100% - ${navBarHeight}px)`,
    position: 'absolute',
    zIndex: 4,
    top: navBarHeight,
    bottom: 0,
    margin: 0,
    transition: 'left 0.5s cubic-bezier(.79,.14,.15,.86) 0s'
  },
  inlineContainerClosed: {
    left: -layout.sideFiltersWidth
  },
  inlineContainerOpened: {
    left: 0
  },
  overlayContainer: {
    width: layout.sideFiltersWidth,
    height: '100%',
    position: 'fixed',
    zIndex: 4,
    display: 'block',
    backgroundColor: colors.sideBar,
    padding: '50px 24px',
    transition: ' all 0.5s cubic-bezier(.79,.14,.15,.86) 0s'
  },
  overlayContainerClosed: {
    left: layout.sideBarWidth - layout.sideFiltersWidth
  },
  overlayContainerOpened: {
    left: layout.sideBarWidth
  },
  togglerButton: {
    position: 'absolute',
    right: -48,
    top: 72,
    background: colors.success,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    cursor: 'pointer'
  }
};
