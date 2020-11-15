import { createMuiTheme } from '@material-ui/core/styles';
import {
  input,
  middlePadding,
  mapAutocompletePadding,
  container,
  skeletonRadius,
  layout
} from 'UI/constants/dimensions';
import { colors } from './UI/res';

export const globalStyles = {
  contentLayout: {
    maxWidth: layout.mainPageContentWidth.maxWidth,
    width: '100%',
    margin: '40px 36px'
  },
  flexContentWrapper: {
    height: '100%',
    flex: 1,
    display: 'flex'
  },
  sheetQuestionItem: {
    margin: '23px 0 0'
  },
  sheetInputMargin: {
    marginTop: 5
  },
  newItemBoxContent: {
    display: 'flex',
    padding: '18px 32px',
    borderRadius: '0 0 4px 4px',
    backgroundColor: colors.white,
    alignItems: 'center'
  },

  floatingButtonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 10
  },
  resetButton: {
    margin: 0,
    padding: 0,
    color: colors.middlegrey,
    textTransform: 'capitalize',
    textDecoration: 'underline'
  },
  inputSpacing: {
    padding: middlePadding
  },
  inputMinSpacing: {
    padding: mapAutocompletePadding
  },
  containerBoxShadow: {
    boxShadow: container.boxShadow
  },
  mapActionButton: {
    letterSpacing: '1.43px',
    width: '100%'
  },
  profileSkeletonItem: {
    width: '70%',
    height: 8,
    borderRadius: skeletonRadius,
    display: 'flex',
    flex: 1,
    margin: '0px 39px'
  },
  skeletonSeparator: {
    borderRadius: skeletonRadius,
    width: '100%',
    height: 3,
    margin: '24px 0px'
  },
  skeletonItem: {
    borderRadius: skeletonRadius,
    width: '100%',
    height: 48
  },
  skeletonCol: {
    width: '45%',
    height: 18,
    borderRadius: skeletonRadius
  },
  skeletonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    margin: '24px 0',
    width: '100%',
    alignItems: 'center'
  },
  skeletonTitleBar: {
    height: 72,
    width: '100%',
    backgroundColor: colors.inactiveSideBarTab,
    marginTop: 0,
    marginBottom: 24
  },
  skeletonItemOnTitleBar: {
    display: 'flex',
    flex: '1 1 auto',
    height: 18,
    borderRadius: skeletonRadius
  },
  feeDrawerslabel: {
    marginBottom: 8
  },
  cardContainer: {
    width: '100%',
    boxShadow: container.boxShadow,
    borderRadius: 4
  }
};

const theme = createMuiTheme({
  sidebarItem: {
    width: '100%',
    height: 63,
    padding: 16
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 1023,
      md: 1366,
      lg: 1600
    }
  },
  selectBox: {
    select: {
      height: input.height,
      padding: 0,
      justifyContent: 'flex-start',
      alignItems: 'center',
      flex: 1,
      display: 'flex',
      paddingLeft: 15
    }
  },
  button: {
    height: input.height,
    maxHeight: input.height,
    borderRadius: input.borderRadius,
    // width: 238,
    minWidth: 120,
    maxWidth: 400,
    alignItems: 'center',
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 500,
    boxShadow: '0px 3px 6px #00000029',
    width: 200,
    minHeight: '48px !important'
  },
  input: {
    minHeight: input.height,
    borderRadius: input.borderRadius,
    margin: '10px 0',
    width: '100%',
    '& fieldset': {
      borderRadius: input.borderRadius
    },
    '& input': {
      padding: '0px 8px !important'
    },
    '& label': {
      transform: 'translate(14px, 12px) scale(1)'
    }
  },
  modalSettings: {
    position: 'absolute',
    margin: 'auto',
    left: 0,
    right: 0,
    width: '95%',
    backgroundColor: colors.white,
    borderRadius: 4
  },
  typography: {
    fontSize: 14,
    fontFamilyHeader: '"Poppins", sans-serif !important',
    fontFamilyContent: '"Roboto", sans-serif !important',
    fontSizeLarge: 16,
    fontWeightLight: '300 !important',
    fontWeightRegular: '400 !important',
    fontWeightMedium: '500 !important',
    fontWeightBold: '700 !important',
    fontWeightBlack: '900 !important'
  },
  textShadow: {
    textShadow: '0px 3px 6px #7c7a7ac7',
    opacity: 1
  },
  palette: {
    primary: {
      light: colors.success,
      // dark: colors.success,
      main: colors.success,
      contrastText: colors.white
    },
    secondary: {
      light: colors.black,
      // dark: colors.black,
      main: colors.black,
      contrastText: colors.success
    }
  },
  tooltip: {
    backgroundColor: colors.inactiveSideBarTab,
    color: colors.darkGrey,
    fontSize: '12px !important'
    // marginTop: 24 // TODO: check where this out is affecting the tooltip
  },
  overrides: {
    MuiAutocomplete: {
      endAdornment: {
        top: 'unset'
      }
    },
    MuiSvgIcon: {
      root: {
        width: 24,
        height: 24
      }
    },
    MuiFormHelperText: {
      root: {
        '&$error': {
          fontSize: 12
        }
      }
    },
    MuiPickersToolbar: {
      toolbar: {
        overflow: 'hidden',
        height: 'auto',
        margin: '-1px'
      }
    },
    MuiDialog: {
      root: {
        container: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }
      },
      paper: {
        position: 'absolute',
        backgroundColor: colors.sideBar,
        top: 111,
        padding: 24,
        maxWidth: '650px !important'
      }
    },
    MuiTableRow: {
      root: {
        height: 56,
        cursor: 'pointer'
      }
    },
    MUIDataTableFilter: {
      root: {
        maxWidth: 600,
        minWidth: 450
      },
      reset: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between'
      },
      gridListTile: {
        marginTop: 0
      }
    },
    MuiDivider: {
      root: {
        height: 2,
        borderRadius: skeletonRadius,
        width: '100%',
        margin: '24px 0px'
      }
    }
  }
});

// Global Font Responsive Rules and formats
theme.typography.h1 = {
  fontSize: 32,
  fontWeight: theme.typography.fontWeightBlack,
  fontFamily: theme.typography.fontFamilyHeader
};
theme.typography.h2 = {
  fontSize: 20,
  fontWeight: theme.typography.fontWeightMedium
};
theme.typography.subtitle1 = {
  fontSize: theme.typography.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  [theme.breakpoints.up('lg')]: {
    fontSize: theme.typography.fontSizeLarge
  }
};
theme.typography.body1 = {
  fontSize: theme.typography.fontSize,
  fontWeight: theme.typography.fontWeightRegular,
  [theme.breakpoints.up('lg')]: {
    fontSize: theme.typography.fontSizeLarge
  }
};
theme.typography.body2 = {
  fontSize: theme.typography.fontSize,
  fontWeight: theme.typography.fontWeightLight,
  [theme.breakpoints.up('lg')]: {
    fontSize: theme.typography.fontSizeLarge
  }
};

export const THEME = theme;
