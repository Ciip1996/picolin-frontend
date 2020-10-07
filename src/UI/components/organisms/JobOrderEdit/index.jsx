// @flow
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useForm, FormContext } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';

import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorMessage } from 'UI/utils';
import { showAlert as showAlertAction } from 'actions/app';
import JobOrderForm from 'UI/components/organisms/JobOrderForm';

type JobOrderEditProps = {
  joborder: any,
  onEditCompleted: (profile: any) => void,
  onEditClosed: () => void,
  showAlert: any => void
};

const JobOrderEdit = (props: JobOrderEditProps) => {
  const { joborder, onEditCompleted, onEditClosed, showAlert } = props;
  const {
    id,
    title,
    source,
    company: { id: company_id } = {},
    specialty: { id: specialty_id } = {},
    position: { id: position_id } = {},
    different_location,
    address: { zip, city, city: { id: city_id, state, state: { id: state_id } = {} } = {} } = {},
    company,
    specialty,
    subspecialty,
    position
  } = joborder;

  const initialValues = {
    company_id: company,
    specialty_id: specialty,
    subspecialty_id: subspecialty,
    position_id: position,
    different_location,
    state_id: state,
    city_id: city,
    zip: { id: zip, title: `${zip}` }
  };
  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isFormDisabled: false,
    isReadOnly: false
  });

  const form = useForm(
    joborder
      ? {
          defaultValues: {
            id,
            title,
            source,
            company_id,
            specialty_id,
            subspecialty_id: subspecialty?.id,
            position_id,
            different_location,
            state_id,
            city_id,
            zip
          }
        }
      : {}
  );

  const onSubmit = async formData => {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));
      const response = await API.put(`${Endpoints.JobOrders}/${id}`, formData);
      if (response.data && response.status === 201) {
        showAlert({
          severity: 'success',
          title: 'Awesome',
          body: 'The Job Order was updated successfully'
        });

        const updatedProfile = response.data;
        onEditCompleted(updatedProfile);
      }
    } catch (err) {
      showAlert({
        severity: 'error',
        title: 'Job Order',
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
        title="EDITING JOB ORDER"
        onSubmit={form.handleSubmit(onSubmit)}
        onClose={onEditClosed}
        uiState={uiState}
      >
        <Box>
          <JobOrderForm initialValues={initialValues} />
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

const JobOrderEditConnected = connect(null, mapDispatchToProps)(JobOrderEdit);

export default JobOrderEditConnected;
