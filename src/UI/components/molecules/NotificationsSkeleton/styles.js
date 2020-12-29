import { makeStyles } from '@material-ui/core/styles';

export const styles = {
  iconContainer: {
    padding: 0
  },
  icon: {
    position: 'absolute',
    left: 30
  },
  indicatorContainer: {
    padding: 0
  },
  indicator: {
    position: 'absolute',
    right: 20
  },
  title: {
    padding: 5
  }
};

export const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    width: '100%',
    height: 90,
    backgroundColor: 'rgb(236, 239, 245)',
    boxShadow:
      '0px 0px 0px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 0px 1px rgba(0,0,0,0.12)',
    borderRadius: 0
  },
  textContainer: {
    marginLeft: 60,
    width: 435
  }
}));
