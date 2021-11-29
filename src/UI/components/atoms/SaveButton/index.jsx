// @flow
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import { CancelSaveButton } from 'UI/constants/dimensions';
import { nestTernary } from 'UI/utils';
import ActionButton from 'UI/components/atoms/ActionButton';

type SaveButtonProps = {
  isSaving: boolean,
  isSuccess: boolean,
  initialText?: string,
  onProgressText: string,
  onSuccessText?: string,
  children: any
};

const SaveButton = (props: SaveButtonProps) => {
  const {
    isSaving,
    isSuccess,
    initialText,
    onProgressText,
    onSuccessText,
    children,
    ...rest
  } = props;

  return (
    <ActionButton
      text={
        isSaving
          ? onProgressText
          : nestTernary(isSuccess, onSuccessText, initialText)
      }
      disabled={isSaving || (!isSaving && isSuccess)}
      type="submit"
      style={{ width: CancelSaveButton }}
      {...rest}
    >
      {isSaving ? <CircularProgress color="inherit" size={20} /> : children}
    </ActionButton>
  );
};

SaveButton.defaultProps = {
  initialText: 'Save',
  onProgressText: 'Saving',
  onSuccessText: 'Saved',
  children: undefined
};

export default SaveButton;
