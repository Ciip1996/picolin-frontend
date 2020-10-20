import { makeStyles } from '@material-ui/core/styles';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { container } from 'UI/constants/dimensions';

export const styles = {
  headerIcon: {
    right: '-5px'
  },
  bottomHeader: {
    backgroundColor: colors.transparent
  },
  relocationNoLabel: {
    marginLeft: 12
  },
  relocationYesLabel: {
    color: colors.active,
    marginLeft: 12
  },
  profileScroll: {
    display: 'flex',
    maxHeight: 'fit-content'
  }
};

export const useStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
    boxShadow: container.boxShadow,
    borderRadius: 4
  },
  wrapper: {
    padding: '0px !important',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    backgroundColor: colors.sideBar,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 72,
    padding: 24,
    position: 'relative'
  },
  body: {
    padding: '20px 32px 9px 32px',
    flex: 1,
    borderBottom: `1px solid ${colors.middleGrey}`
    // height: '30vh', // This line will make the container to fit the viewport
    // overflowY: 'auto'
  },
  formWrapper: {
    alignItems: 'stretch',
    justifyContent: 'space-around',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
    margin: '6px 24px 24px'
  },
  labelContainer: {
    marginTop: 18,
    display: 'flex',
    flexDirection: 'row'
  },
  footer: {
    display: 'flex',
    flexDirection: 'column'
  },
  alignIndicator: {
    marginTop: 6
  }
});
