import { layout, navBarHeight } from 'UI/constants/dimensions';

export const styles = {
  mapContainer: {
    position: 'absolute',
    top: navBarHeight,
    bottom: 0,
    right: 0,
    transition: 'left 0.5s cubic-bezier(.79,.14,.15,.86) 0s'
  },
  filtersClosed: {
    left: 0
  },
  filtersOpen: {
    left: layout.sideFiltersWidth
  },
  navigationControl: {
    right: 24,
    bottom: 36,
    position: 'fixed'
  }
};
