import { layout } from 'UI/constants/dimensions';

export const styles = {
  dashboardContainer: {
    padding: '36px 64px',
    width: '100%',
    maxWidth: layout.maxWidth
  },
  dateRangeContainer: {
    position: 'absolute',
    right: 0,
    top: -20,
    zIndex: 10,
    boxShadow: '1px 1px 81px rgba(41,60,74,.18)',
    backgroundColor: 'white',
    borderRadius: 5
  },
  dateRangeToolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: '1px solid #eff2f7',
    padding: 15
  },
  activeFiltersContainer: {
    marginBottom: 20
  }
};
