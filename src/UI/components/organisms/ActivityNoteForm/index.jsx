// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { editorConfig } from 'UI/constants/dimensions';

import TextBox from 'UI/components/atoms/TextBox';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { getErrorMessage } from 'UI/utils';
import API from 'services/API';
import { getCurrentUser } from 'services/Authentication';
import { doesUserOwnItem } from 'services/Authorization';
import { Endpoints } from 'UI/constants/endpoints';
import { showAlert as showAlertAction } from 'actions/app';
import './styles.css';

type ActivityNoteType = 'activity' | 'note';

type ActivityNoteFormProps = {
  type: ActivityNoteType,
  endpoint: string,
  selectedItem: any,
  onNoteCompleted: (type: ActivityNoteType, note: any, wasEditing: boolean) => void,
  onNoteClosed: () => void,
  showAlert: any => void
};

const ActivityNoteForm = (props: ActivityNoteFormProps) => {
  const {
    type = 'activity',
    endpoint,
    selectedItem,
    onNoteCompleted,
    onNoteClosed,
    showAlert
  } = props;

  const currentUser = getCurrentUser();
  const canEdit = !selectedItem?.id || doesUserOwnItem(currentUser, selectedItem);
  const [body, setBody] = useState(selectedItem?.body || '');
  const [activityType, setActivityType] = useState(selectedItem?.activityLogType);
  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isEditing: !!selectedItem?.id,
    isFormDisabled: !canEdit,
    isReadOnly: false
  });

  const finalEndpoint = `${endpoint}/${
    type === 'activity' ? Endpoints.Activities : Endpoints.Notes
  }`;

  const { register, errors, handleSubmit, setValue } = useForm(
    selectedItem ? { defaultValues: { ...selectedItem } } : {}
  );

  useEffect(() => {
    if (type === 'activity') {
      register({ name: 'activity_log_type_id' }, { required: 'The type is required' });
    }
    register({ name: 'body' }, { required: 'The note is required' });
  }, [register, type]);

  const handleTypeChange = (name?: string, value: any) => {
    setActivityType(value);
    setValue('activity_log_type_id', value?.id, true);
  };

  const handleEditorChange = (event, editor) => {
    const html = editor.getData();
    setBody(html);
    setValue('body', html, true);
  };

  const onSubmit = async (formData: any) => {
    setUiState(prevState => ({ ...prevState, isSaving: true }));
    await saveActivityNote(formData);
  };

  const saveActivityNote = async (activityNote: any) => {
    try {
      const response = !uiState.isEditing
        ? await API.post(finalEndpoint, activityNote)
        : await API.put(`${finalEndpoint}/${selectedItem.id}`, activityNote);

      if (response.data) {
        showAlert({
          severity: 'success',
          title: 'Awesome',
          body: `The ${type} was ${uiState.isEditing ? 'updated' : 'created'} successfully`
        });

        onNoteCompleted(
          type,
          !uiState.isEditing ? response.data.data : response.data,
          uiState.isEditing
        );
      }
    } catch (error) {
      showAlert({
        severity: 'error',
        title: 'Error',
        body: getErrorMessage(error)
      });
    }
    setUiState(prevState => ({
      ...prevState,
      isSuccess: false,
      isSaving: false
    }));
  };

  return (
    <DrawerFormLayout
      onSubmit={handleSubmit(onSubmit)}
      onClose={onNoteClosed}
      uiState={uiState}
      title={type === 'activity' ? 'ACTIVITY' : 'NOTE'}
    >
      <Box mt={2} mb={3}>
        {type === 'activity' ? (
          <AutocompleteSelect
            name="type"
            placeholder="Type *"
            error={!!errors.activity_log_type_id}
            errorText={errors.activity_log_type_id && errors.activity_log_type_id.message}
            value={activityType}
            onSelect={handleTypeChange}
            url={Endpoints.ActivityTypes}
            width="100%"
            disabled={uiState.isFormDisabled}
          />
        ) : (
          <TextBox
            name="title"
            label="Title *"
            error={!!errors.title}
            errorText={errors.title && errors.title.message}
            inputRef={register({ required: 'The title is required' })}
            disabled={uiState.isFormDisabled}
          />
        )}
      </Box>
      <CKEditor
        data={body}
        editor={ClassicEditor}
        config={editorConfig}
        onChange={handleEditorChange}
        disabled={uiState.isFormDisabled}
      />
      {selectedItem?.user && (
        <FormHelperText>
          Created by{' '}
          <b>
            {selectedItem?.user.initials} - {selectedItem?.user.email}
          </b>
        </FormHelperText>
      )}

      <FormControl component="fieldset" error={!!errors.body}>
        <FormHelperText>{errors.body && errors.body.message}</FormHelperText>
      </FormControl>
    </DrawerFormLayout>
  );
};

ActivityNoteForm.defaultProps = {};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert))
  };
};

const ActivityNoteFormConnected = connect(null, mapDispatchToProps)(ActivityNoteForm);

export default ActivityNoteFormConnected;
