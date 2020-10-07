import { layout, navBarHeight } from 'UI/constants/dimensions';

export const styles = {
  TabContent: {
    padding: 0
  },
  UserContainer: {
    overflowY: 'auto'
  },
  filtersContainer: {
    width: layout.sideFiltersWidth,
    height: `calc(100% - ${navBarHeight}px)`,
    position: 'absolute',
    zIndex: 4,
    top: navBarHeight,
    bottom: 0,
    margin: 0,
    transition: 'left 0.5s cubic-bezier(.79,.14,.15,.86) 0s'
  },
  filtersClosed: {
    left: -layout.sideFiltersWidth
  },
  filtersOpen: {
    left: 0
  },
  ArrowPosition: {
    transition: '.5s cubic-bezier(.46,.03,.52,.96)',
    transitionDelay: '.10s',
    transform: 'rotate(0deg)'
  },
  ArrowTranslate: {
    transform: 'rotate(-180deg)'
  }
};
