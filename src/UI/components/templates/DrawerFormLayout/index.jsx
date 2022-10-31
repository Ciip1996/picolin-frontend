// @flow
import React from 'react';
import Box from '@material-ui/core/Box';
import { CancelSaveButton } from 'UI/constants/dimensions';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import ActionButton from 'UI/components/atoms/ActionButton';
import SaveButton from 'UI/components/atoms/SaveButton';
import { fuseStyles, useLanguage } from 'UI/utils';
import { isNull } from 'lodash';
import { styles } from './styles';
import Contents from './strings';

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
  initialText?: string | null,
  onProgressText?: string | null,
  onSuccessText?: string | null,
  cancelText?: string | null,
  isCancelButtonNeeded: boolean,
  isBottomToolbarNeeded: boolean,
  isTopToolbarNeeded: boolean,
  onPrimaryButtonClick: () => any,
  isSaveButtonMode: boolean,
  triggerActionText?: string | null,
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

  const language = useLanguage();

  const drawerStyle = fuseStyles([
    styles.drawerContainer,
    variant === '#E26A93' && styles.blueDrawer,
    variant === 'red' && styles.customDrawer,
    variant === 'borderless' && styles.drawerContainer
  ]);
  return (
    <Box
      id="drawer-form"
      component="form"
      onSubmit={onSubmit}
      style={drawerStyle}
    >
      {isTopToolbarNeeded && (
        <Box style={styles.drawerTopToolbar}>{additionalHeaderButtons}</Box>
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
              text={cancelText || Contents[language]?.cancel}
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
          <span style={{ width: 20 }} />
          {isSaveButtonMode ? (
            <SaveButton
              isSaving={uiState?.isSaving}
              isSuccess={uiState?.isSuccess}
              disabled={uiState?.isFormDisabled || uiState?.isSaving}
              initialText={initialText || Contents[language]?.initialText}
              onProgressText={
                onProgressText || Contents[language]?.onProgressText
              }
              onSuccessText={onSuccessText || Contents[language]?.onSuccessText}
            />
          ) : (
            <ActionButton
              text={triggerActionText || Contents[language]?.initialText}
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
  initialText: null,
  onProgressText: null,
  onSuccessText: null,
  cancelText: null,
  isCancelButtonNeeded: true,
  onSecondaryButtonClick: null,
  isSaveButtonMode: true,
  onPrimaryButtonClick: () => {},
  triggerActionText: null,
  contentStyle: null,
  isBottomToolbarNeeded: true,
  isTopToolbarNeeded: true,
  uiState: {}
};

export default DrawerFormLayout;
