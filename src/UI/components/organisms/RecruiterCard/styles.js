import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

export const styles = {
  container: {
    position: 'relative',
    zIndex: 2
  },
  divider: {
    height: 1,
    margin: 0,
    padding: 0
  },
  overlay: {
    position: 'absolute'
  },
  stacked: {
    position: 'static'
  },
  avatarContainer: {
    selfAlign: 'flex-start'
  },
  cardContent: {
    paddingBottom: 16,
    paddingTop: 0
  },
  skeleton: {
    backgroundColor: colors.inactiveSideBarTab,
    boxShadow: 'none',
    borderRadius: 0
  }
};

export const useCardHeaderStyles = makeStyles(() => ({
  avatar: {
    alignSelf: 'flex-start'
  }
}));
