// @flow
import React from 'react';
import Box from '@material-ui/core/Box';
import { CloseIcon, colors } from 'UI/res';
import { CancelSaveButton } from 'UI/constants/dimensions';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import ActionButton from 'UI/components/atoms/ActionButton';
import SaveButton from 'UI/components/atoms/SaveButton';
import { fuseStyles } from 'UI/utils';
import { isNull } from 'lodash';
import { styles } from './styles';

type DrawerUiState = {
  isSaving: boolean,
  isSuccess: boolean,
  isReadOnly: boolean,
  isFormDisabled: boolean
};

type DrawerFormLayoutProps = {
  children: any,
  additionalHeaderButtons: any,
  title: string,
  variant: 'blue' | 'white' | 'borderless',
  uiState: DrawerUiState,
  onSubmit: any => any,
  onClose: () => any,
  onSecondaryButtonClick: typeof isNull | (() => any),
  initialText: string,
  onProgressText: string,
  onSuccessText: string,
  cancelText: string,
  isCancelButtonNeeded: boolean,
  isBottomToolbarNeeded: boolean,
  isTopToolbarNeeded: boolean,
  onPrimaryButtonClick: () => any,
  isSaveButtonMode: boolean,
  triggerActionText: string,
  contentStyle: any
};

const DrawerFormLayout = (props: DrawerFormLayoutProps) => {
  const {
    children,
    additionalHeaderButtons,
    uiState,
    title,
    variant,
    onSubmit,
    initialText,
    onProgressText,
    onSuccessText,
    onClose,
    onSecondaryButtonClick,
    cancelText,
    isCancelButtonNeeded,
    isBottomToolbarNeeded,
    isTopToolbarNeeded,
    contentStyle,
    onPrimaryButtonClick,
    isSaveButtonMode,
    triggerActionText
  } = props;
  const drawerStyle = fuseStyles([
    styles.drawerContainer,
    variant === '#E26A93' && styles.blueDrawer,
    variant === 'red' && styles.customDrawer,
    variant === 'borderless' && styles.drawerContainer
  ]);
  return (
    <Box id="drawer-form" component="form" onSubmit={onSubmit} style={drawerStyle}>
      {isTopToolbarNeeded && (
        <Box style={styles.drawerTopToolbar}>
          {additionalHeaderButtons}
        </Box>
      )}
      <Box style={styles.drawerTitle}>
        <TitleLabel fontSize={28} text={title} textTransform="uppercase" />
      </Box>
      <Box style={{ ...styles.drawerContent, ...contentStyle }}>{children}</Box>
      {isBottomToolbarNeeded && (
        <Box
          style={styles.drawerToolbar}
          justifyContent={isCancelButtonNeeded ? 'space-between' : 'flex-end'}
        >
          {isCancelButtonNeeded && (
            <ActionButton
              text={cancelText}
              onClick={() => {
                if (onSecondaryButtonClick) {
                  onSecondaryButtonClick();
                } else if (onClose) {
                  onClose();
                }
              }}
              variant="outlined"
              style={{ width: CancelSaveButton }}
            />
          )}

          {isSaveButtonMode ? (
            <SaveButton
              isSaving={uiState.isSaving}
              isSuccess={uiState.isSuccess}
              disabled={uiState.isFormDisabled || uiState.isSaving}
              initialText= "TRANSEFERIR"
              onProgressText={onProgressText}
              onSuccessText={onSuccessText}
            />
          ) : (
            <ActionButton
              text={triggerActionText}
              onClick={onPrimaryButtonClick}
              style={{ width: CancelSaveButton }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

DrawerFormLayout.defaultProps = {
  additionalHeaderButtons: undefined,
  variant: 'white',
  initialText: 'Save',
  onProgressText: 'Saving',
  onSuccessText: 'Saved',
  cancelText: 'Cancelar',
  isCancelButtonNeeded: true,
  onSecondaryButtonClick: null,
  isSaveButtonMode: true,
  onPrimaryButtonClick: () => {},
  triggerActionText: '',
  contentStyle: null,
  isBottomToolbarNeeded: true,
  isTopToolbarNeeded: true
};

export default DrawerFormLayout;
