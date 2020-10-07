// @flow
import React from 'react';
import TextBox from 'UI/components/atoms/TextBox';
import TitleLabel from 'UI/components/atoms/TitleLabel';

import ActionButton from 'UI/components/atoms/ActionButton';
import { useStyles } from './style';
import CustomRadioButtonOptions from '../CustomRadioButtonOptions';

const ModalNewFolderCreation = () => {
  const classes = useStyles();

  return (
    <div className={classes.modal}>
      <div className={classes.modalHeader}>
        <TitleLabel text="NEW FOLDER" fontSize={26} />
      </div>
      <div className={classes.contentContainer}>
        <div className={classes.textBoxContainer}>
          <TextBox name="folder" label="Folder Name" />
        </div>
        <CustomRadioButtonOptions
          radioTitle="Create this Folder"
          controlValue="private"
          controlLabel="Private"
          defaultValue="private"
          secondControlValue="public"
          secondControlLabel="Public"
          controlValueText="*Only you can visualize this folder"
          secondValueText="*Everyone can visualize this folder"
        />
      </div>
      <div className={classes.actionsBar}>
        <div className={classes.actionsDivider}>
          <ActionButton variant="outlined" text="Cancel" />
        </div>
        <ActionButton text="Create" />
      </div>
    </div>
  );
};

export default ModalNewFolderCreation;
