import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  FileView: {
    width: '100%',
    height: 93,
    borderBottom: `1px solid ${colors.lightgrey} `,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    padding: '0 20px',
    backgroundColor: props => props.isActiveCard && colors.lightgrey,
    '&:hover': {
      backgroundColor: colors.componentFill,
      cursor: 'pointer'
    }
  },
  textContainer: {
    display: 'grid',
    flexDirection: 'column',
    width: '100%'
  },
  fileName: {
    fontSize: 16,
    textTransform: 'uppercase',
    color: colors.black
  },
  fileSubject: {
    fontSize: 14,
    color: colors.black
  },
  fileText: {
    color: colors.darkGrey
  },
  fileDate: {
    position: 'absolute',
    top: 7,
    right: 9,
    fontSize: 12,
    color: colors.lightText
  }
});
