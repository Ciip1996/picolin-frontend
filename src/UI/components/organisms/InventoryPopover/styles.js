import { colors } from 'UI/res/index';

export const styles = {
  PopContainer: {
    backgroundColor: colors.white,
    width: 344,
    height: 208,
    boxShadow: '0px 1px 3px #00000033',
    padding: 20,
    boxSizing: 'border-box',
    margin: 5,
    position: 'relative',
    top: '-29px'
  },
  link: {
    color: colors.white,
    position: 'relative',
    right: 0,
    marginLeft: 'auto',
    padding: '0 20px',
    backgroundColor: colors.success,
    borderRadius: 16,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 500,
    width: 143
  },
  initial: {
    whiteSpace: 'nowrap',
    fontWeight: 700,
    textTransform: 'uppercase'
  },
  alpha: {
    color: colors.active
  },
  poejo: {
    color: colors.orange
  },
  cant: {
    color: colors.red,
    width: 'min-content'
  },
  search: {
    color: colors.active,
    width: 'min-content',
    whiteSpace: 'pre-line'
  }
};
