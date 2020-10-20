import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { inventorySectionHeader } from 'UI/constants/dimensions';
import { makeStyles } from '@material-ui/core/styles';

export const styles = {
  emptyImage: {
    margin: '6% 0'
  }
};

const sharedStylesButtons = {
  width: 'calc(100% / 2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.lightBackground,
  borderBottom: '1px solid #d2d2d273',
  fontSize: 14,
  cursor: 'pointer'
};

export const useStyles = makeStyles({
  main: {
    height: '100%'
  },
  templatesContainer: {
    display: 'flex',
    height: `calc(100% - ${`${inventorySectionHeader}px`})`
  },
  treeViewContainer: {
    maxWidth: 392,
    position: 'relative',
    width: '100%',
    backgroundColor: colors.lightgrey,
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: 5
  },
  treeViewBox: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    borderRight: '1px solid #eaeaea',
    overflow: 'auto'
  },
  templateActions: {
    width: '100%',
    display: 'flex',
    height: 41
  },
  templateActionContainer: {
    ...sharedStylesButtons
  },
  templateActionContainerRight: {
    ...sharedStylesButtons,
    borderLeft: `1px solid ${colors.middleGrey}`
  },
  titles: {
    display: 'flex',
    height: 48,
    boxShadow: 'rgba(0, 0, 0, 0.06) -1px 4px 6px'
  },
  filesContainer: {
    maxWidth: 392,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px 0 20px',
    justifyContent: 'space-between',
    fontWeight: 700,
    position: 'relative'
  },
  previewContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    fontWeight: 700
  },
  divider: {
    height: '80%',
    border: '1px solid #d2d2d273',
    position: 'absolute',
    right: 0
  },
  templatePreviewContainer: {
    display: 'flex',
    backgroundColor: colors.lightgrey,
    paddingTop: 5
  },
  templateBox: {
    height: '100%',
    width: '100%',
    display: 'flex',
    backgroundColor: colors.white
  },

  emptyStateButton: {
    margin: '10px auto 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  NoContent: {
    opacity: '0.2',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
