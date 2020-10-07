import { colors } from 'UI/res/colors';

export const styles = {
  sheetContainer: {
    width: 580,
    height: '100vh',
    backgroundColor: colors.softBack,
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 11,
    boxShadow: '-32px 0px 32px #00000017',
    borderLeft: `8px solid ${colors.success}`,
    padding: '76px 0 0',
    overflowY: 'auto'
  }
};
