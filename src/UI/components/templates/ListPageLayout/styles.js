import { layout } from 'UI/constants/dimensions';

export const styles = {
  tableContainer: {
    minWidth: 'min-content',
    minHeight: '100%'
  },
  selectorContainer: {
    maxWidth: 238
  },
  dataTableLayout: {
    flexGrow: 1,
    width: '100%',
    maxWidth: layout.maxWidth
  },
  paddingTemplate: {
    padding: '36px 64px',
    height: '100%'
  },
  paddingContained: {
    padding: '36px 18px',
    height: 'calc(100% - 172px)',
    zIndex: 0,
    position: 'relative'
  },
  paddingOnPage: {
    padding: 0,
    height: 'calc(100% - 100px)',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  containerOnPage: {
    width: '100%',
    margin: 0
  },
  paddingGrid: {
    padding: 0,
    maxHeight: '48vh',
    overflowY: 'auto'
  },
  gridOnPage: {
    height: '100%',
    padding: 0,
    position: 'relative',
    top: 0
  }
};
