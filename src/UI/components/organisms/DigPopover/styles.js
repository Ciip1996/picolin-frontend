import { colors } from 'UI/res/index';

export const styles = {
  PopContainer: {
    backgroundColor: colors.white,
    width: 394,
    height: 222,
    boxShadow: '0px 1px 3px #00000033',
    padding: 20,
    boxSizing: 'border-box',
    margin: 5,
    position: 'relative',
    top: '-29px'
  },
  link: {
    color: colors.white,
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: '0 20px',
    backgroundColor: colors.success,
    borderRadius: 16,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 500,
    width: 143
  }
};
