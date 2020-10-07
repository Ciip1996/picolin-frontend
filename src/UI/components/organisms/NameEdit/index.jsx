// @flow
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useForm, FormContext } from 'react-hook-form';

import Box from '@material-ui/core/Box';

import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorMessage } from 'UI/utils';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import NameForm from 'UI/components/organisms/NameForm';
import { showAlert as showAlertAction } from 'actions/app';

type NameEditProps = {
  name: any,
  onEditCompleted: (profile: any) => void,
  onEditClosed: () => void,
  showAlert: any => void
};

const NameEdit = (props: NameEditProps) => {
  const { name, onEditCompleted, onEditClosed, showAlert } = props;
  const {
    current_company,
    email,
    id,
    link_profile,
    nameStatus,
    nameStatus: { id: name_status_id } = {},
    specialty: { id: specialty_id } = {},
    personalInformation: {
      first_name,
      last_name,
      contact: { phone, mobile, ext, personal_email } = {},
      address: { zip = {}, city = {} } = {}
    } = {},
    position: { id: position_id } = {},
    sourceType = {},
    specialty,
    subspecialty,
    title,
    position
  } = name;

  const initialValues = {
    specialty_id: specialty,
    subspecialty_id: subspecialty,
    position_id: position,
    source_type_id: sourceType,
    name_status_id: nameStatus,
    city_id: city,
    state_id: city?.state,
    zip: { id: zip, title: zip }
  };

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isFormDisabled: false,
    isReadOnly: false
  });

  const form = useForm(
    name
      ? {
          defaultValues: {
            id,
            first_name,
            last_name,
            phone,
            mobile,
            ext,
            personal_email,
            email,
            title,
            link_profile,
            current_company,
            specialty_id,
            subspecialty_id: subspecialty?.id,
            position_id,
            city_id: city?.id,
            state_id: city?.state?.id,
            source_type_id: sourceType?.id,
            zip,
            name_status_id
          }
        }
      : {}
  );

  const onSubmit = async formData => {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));
      const response = await API.put(`${Endpoints.Names}/${id}`, formData);
      if (response.data && response.status === 201) {
        showAlert({
          severity: 'success',
          title: 'Awesome',
          body: 'The name was updated successfully'
        });

        const updatedProfile = response.data;
        onEditCompleted(updatedProfile);
      }
    } catch (err) {
      showAlert({
        severity: 'error',
        title: 'Name',
        body: getErrorMessage(err)
      });
    }
    setUiState(prevState => ({
      ...prevState,
      isSaving: false,
      isSuccess: false
    }));
  };

  return (
    <FormContext {...form}>
      <DrawerFormLayout
        title="EDITING NAME"
        onSubmit={form.handleSubmit(onSubmit)}
        onClose={onEditClosed}
        uiState={uiState}
      >
        <Box>
          <NameForm initialValues={initialValues} />
        </Box>
      </DrawerFormLayout>
    </FormContext>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert))
  };
};

const NameEditConnected = connect(null, mapDispatchToProps)(NameEdit);

export default NameEditConnected;
