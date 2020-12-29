import { sideBarWidth, navBarHeight } from 'UI/constants/dimensions';

export const styles = {
  wrapper: {
    marginLeft: sideBarWidth,
    paddingTop: navBarHeight,
    height: '100%',
    width: '100%',
    position: 'relative',
    overflowX: 'auto',
    display: 'flex',
    justifyContent: 'center'
  }
};
