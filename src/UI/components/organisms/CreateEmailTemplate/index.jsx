// @flow
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@material-ui/core';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CancelSaveButton, editorConfig } from 'UI/constants/dimensions';
import TitleLabel from 'UI/components/atoms/TitleLabel';

import ActionButton from 'UI/components/atoms/ActionButton';
import TextBox from 'UI/components/atoms/TextBox';
import './styles.css';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import CustomRadioButtonOptions from 'UI/components/molecules/CustomRadioButtonOptions';

import { useStyles } from './styles';

type CreateEmailTemplateProps = {
  selectedItem?: any,
  onCancel: any => void,
  onTemplateSave: () => any,
  isBulkEmailPage: boolean
};

const CreateEmailTemplate = (props: CreateEmailTemplateProps) => {
  const { selectedItem, onCancel, onTemplateSave, isBulkEmailPage } = props;
  const [body, setBody] = useState(selectedItem?.body);
  const { setValue } = useForm(selectedItem ? { defaultValues: { ...selectedItem } } : {});

  const handleEditorChange = (event, editor) => {
    const html = editor.getData();
    setBody(html);
    setValue('body', html, true);
  };

  const classes = useStyles(props);

  return (
    <Box className={classes.main}>
      {isBulkEmailPage && (
        <div className={classes.modalHeader}>
          <TitleLabel text="NEW TEMPLATE" fontSize={18} />
        </div>
      )}
      <div>
        <div className={classes.textBoxContainer}>
          <div className={classes.textBoxContainerLabel}>Template Name</div>
          <div className={classes.textBoxContainerInput}>
            <TextBox name="folder" label="Folder Name" />
          </div>
        </div>
        <div className={classes.textBoxContainer}>
          <div className={classes.textBoxContainerLabel}>Make this Template:</div>
          <div className={classes.textBoxContainerInput}>
            <CustomRadioButtonOptions
              controlValue="private"
              controlLabel="Private"
              defaultValue="private"
              secondControlValue="public"
              secondControlLabel="Public"
              controlValueText="*Only you can visualize this folder"
              secondValueText="*Everyone can visualize this folder"
            />
          </div>
        </div>
        <div className={classes.textBoxContainer}>
          <div className={classes.textBoxContainerLabel}>Save Template in:</div>
          <div className={classes.textBoxContainerInput}>
            <AutocompleteSelect placeholder="Where" />
          </div>
        </div>
      </div>
      <div className={classes.ckEditorContainer}>
        <div className="customEditor">
          <CKEditor
            data={body}
            editor={ClassicEditor}
            config={editorConfig}
            onChange={handleEditorChange}
          />
        </div>
      </div>
      <Box className={classes.footer}>
        <Box mr={3}>
          <ActionButton
            text="CANCEL"
            onClick={onCancel}
            variant="outlined"
            style={{ width: CancelSaveButton }}
          />
        </Box>
        <ActionButton
          text="SAVE TEMPLATE"
          onClick={onTemplateSave}
          style={{ width: CancelSaveButton }}
        />
      </Box>
    </Box>
  );
};

CreateEmailTemplate.defaultProps = {
  selectedItem: undefined,
  isBulkEmailPage: true
};

export default CreateEmailTemplate;
