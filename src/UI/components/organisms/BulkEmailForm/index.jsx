// @flow
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@material-ui/core';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TextBox from 'UI/components/atoms/TextBox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { editorConfig } from 'UI/constants/dimensions';
import DropDownTree from 'UI/components/atoms/DropDownTree';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { resendStyles, useStyles } from './styles';
import '../CreateEmailTemplate/styles.css';
import './styles.css';

const ResendOptions = () => {
  const [value, setValue] = useState('off');

  const handleChange = event => {
    setValue(event.target.value);
  };

  const classes = resendStyles();

  const sentValues = ['Day', '7 Days', '15 Days', '30 Days', '60 Days', '90 Days', '365 Days'];

  return (
    <>
      <FormControl component="fieldset">
        <RadioGroup aria-label="options" name="options" value={value} onChange={handleChange}>
          <div className={classes.flexCenter}>
            <div className={classes.resendTitle}>Resend Options:</div>
            <div className={classes.formContainer}>
              <div className={classes.radioDivider}>
                <FormControlLabel value="on" control={<Radio color="primary" />} label="On" />
              </div>
              <FormControlLabel value="off" control={<Radio color="primary" />} label="Off" />
            </div>

            <div className={value === 'off' ? classes.formLabel : classes.formLabelError}>
              {value === 'off'
                ? '* This template can be resent to this search project list'
                : '*This template won’t be sent to the contacts who have already received it.'}
            </div>
          </div>
        </RadioGroup>
      </FormControl>
      {value === 'on' && (
        <>
          <Box display="flex" alignItems="center" mb={1}>
            <div className={classes.inputContainer}>Sent Within:</div>
            <AutocompleteSelect getOptionLabel={option => option} options={sentValues} />
          </Box>
        </>
      )}
    </>
  );
};

type BulkEmailFormProps = {
  selectedItem?: any,
  isEmailModal?: boolean,
  variant?: 'bulk' | 'email',
  onNewTemplateClick: () => any
};

const BulkEmailForm = (props: BulkEmailFormProps) => {
  const { selectedItem, isEmailModal, variant, onNewTemplateClick } = props;
  const [body, setBody] = useState(selectedItem?.body);
  const { setValue } = useForm(selectedItem ? { defaultValues: { ...selectedItem } } : {});

  const handleEditorChange = (event, editor) => {
    const html = editor.getData();
    setBody(html);
    setValue('body', html, true);
  };

  const classes = useStyles();

  return (
    <Box className={classes.main}>
      <Box className={classes.container}>
        <div className={classes.flexCenter}>
          <div className={classes.inputContainer}>To:</div>
          <TextBox name="To" />
        </div>
        <div className={classes.flexCenter}>
          <div className={classes.inputContainer}>Subject:</div>
          <TextBox name="Subject" />
        </div>
        {isEmailModal && (
          <div className={classes.flexCenter}>
            <div className={classes.inputContainer}>CC:</div>
            <TextBox name="cc" />
          </div>
        )}
        <Box display="flex" alignItems="center" mb={1}>
          <div className={classes.inputContainer}>Attach Files:</div>
          <TextBox name="files" />
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <div className={classes.inputContainer}>Template:</div>
          <DropDownTree onClick={onNewTemplateClick} />
        </Box>
        {variant === 'bulk' && <ResendOptions />}

        <div className="bulkEmailEditor">
          <CKEditor
            data={body}
            editor={ClassicEditor}
            config={editorConfig}
            onChange={handleEditorChange}
          />
        </div>
      </Box>
    </Box>
  );
};

BulkEmailForm.defaultProps = {
  isEmailModal: false,
  selectedItem: undefined,
  variant: 'bulk'
};

export default BulkEmailForm;
