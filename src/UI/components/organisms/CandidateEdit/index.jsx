// @flow
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useForm, FormContext } from 'react-hook-form';

import Box from '@material-ui/core/Box';

import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorMessage } from 'UI/utils';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import CandidateForm from 'UI/components/organisms/CandidateForm';
import { showAlert as showAlertAction } from 'actions/app';

type CandidateEditProps = {
  candidate: any,
  onEditCompleted: (profile: any) => void,
  onEditClosed: () => void,
  showAlert: any => void
};

const CandidateEdit = (props: CandidateEditProps) => {
  const { candidate, onEditCompleted, onEditClosed, showAlert } = props;
  const {
    id,
    email,
    title,
    link_profile,
    current_company,
    sourceType = {},
    specialty: { id: specialty_id } = {},
    position: { id: position_id } = {},
    personalInformation: {
      first_name,
      last_name,
      contact: { phone, ext, mobile, personal_email } = {},
      address: { zip, city, city: { id: city_id, state, state: { id: state_id } = {} } = {} } = {}
    } = {},
    specialty,
    subspecialty,
    position
  } = candidate;

  const initialValues = {
    specialty_id: specialty,
    subspecialty_id: subspecialty,
    position_id: position,
    state_id: state,
    city_id: city,
    source_type_id: sourceType,
    zip: { id: zip, title: `${zip}` }
  };
  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isFormDisabled: false,
    isReadOnly: false
  });

  const form = useForm(
    candidate
      ? {
          defaultValues: {
            id,
            first_name,
            last_name,
            phone,
            ext,
            mobile,
            personal_email,
            email,
            title,
            link_profile,
            current_company,
            specialty_id,
            subspecialty_id: subspecialty?.id,
            position_id,
            city_id,
            state_id,
            source_type_id: sourceType ? sourceType.id : null,
            zip
          }
        }
      : {}
  );

  const onSubmit = async formData => {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));
      const response = await API.put(`${Endpoints.Candidates}/${id}`, formData);
      if (response.data && response.status === 201) {
        showAlert({
          severity: 'success',
          title: 'Awesome',
          body: 'The candidate was updated successfully'
        });

        const updatedProfile = response.data;
        onEditCompleted(updatedProfile);
      }
    } catch (err) {
      showAlert({
        severity: 'error',
        title: 'Candidate',
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
        title="EDITING CANDIDATE"
        onSubmit={form.handleSubmit(onSubmit)}
        onClose={onEditClosed}
        uiState={uiState}
      >
        <Box>
          <CandidateForm initialValues={initialValues} />
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

const CandidateEditConnected = connect(null, mapDispatchToProps)(CandidateEdit);

export default CandidateEditConnected;
