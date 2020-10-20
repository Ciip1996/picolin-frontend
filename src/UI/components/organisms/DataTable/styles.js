import { createMuiTheme } from '@material-ui/core/styles';
import { THEME } from 'GlobalStyles';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

export const tableLayout = {
  flexGrow: 1,
  paddingLeft: 64,
  paddingTop: 36,
  paddingRight: 64,
  overflowY: 'auto',
  overflowX: 'hidden',
  height: '100%',
  width: '100%'
};

export const getMuiTheme = () =>
  createMuiTheme({
    ...THEME,
    overrides: {
      ...THEME.overrides,
      MuiToolbar: {
        root: {
          backgroundColor: colors.white
        }
      },
      MUIDataTableHeadRow: {
        root: {
          whiteSpace: 'nowrap'
        }
      },
      MUIDataTableToolbar: {
        root: {
          backgroundColor: colors.inactiveSideBarTab,
          marginBottom: -1
        },
        actions: {
          backgroundColor: colors.inactiveSideBarTab
        }
      },
      MUIDataTableToolbarSelect: {
        root: {
          backgroundColor: colors.linkWater,
          paddingRight: 24
        }
      },
      //   MUIDataTableBodyCell: {
      //     root: {
      //       backgroundColor: colors.white
      //     }
      //   },
      MUIDataTableHeadCell: {
        // data: {
        //   whiteSpace: 'pre'
        // },
        fixedHeaderCommon: {
          backgroundColor: colors.inactiveSideBarTab
        },
        sortAction: {
          alignItems: 'center'
        }
      },
      MUIDataTableSelectCell: {
        headerCell: {
          backgroundColor: colors.inactiveSideBarTab
        }
      },
      //   MuiTableHead: {
      //     root: {
      //       backgroundColor: colors.inactiveSideBarTab
      //     }
      //   },
      MuiGridList: {
        root: {
          margin: '-4px !important'
        }
      },
      MuiGridListTile: {
        root: {
          padding: '4px 12px !important'
        }
      }
    }
  });
