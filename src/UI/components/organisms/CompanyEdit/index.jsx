// @flow
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useForm, FormContext } from 'react-hook-form';

import Box from '@material-ui/core/Box';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import CompanyForm from 'UI/components/organisms/CompanyForm';

import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorMessage } from 'UI/utils';
import { showAlert as showAlertAction } from 'actions/app';

type CompanyEditProps = {
  company: any,
  onEditCompleted: (profile: any) => void,
  onEditClosed: () => void,
  showAlert: any => void
};

const CompanyEdit = (props: CompanyEditProps) => {
  const { company, onEditCompleted, onEditClosed, showAlert } = props;
  const {
    id,
    name,
    email,
    website,
    link_profile,
    specialty: { id: specialty_id } = {},
    contact: { phone } = {},
    address: {
      address,
      zip,
      city,
      city: { id: city_id, state, state: { id: state_id } = {} } = {}
    } = {},
    specialty,
    subspecialty
  } = company;

  const initialValues = {
    specialty_id: specialty,
    subspecialty_id: subspecialty,
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
    company
      ? {
          defaultValues: {
            id,
            name,
            phone,
            website,
            address,
            email,
            link_profile,
            specialty_id,
            subspecialty_id: subspecialty?.id,
            city_id,
            state_id,
            zip
          }
        }
      : {}
  );

  const onSubmit = async formData => {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));
      const response = await API.put(`${Endpoints.Companies}/${id}`, formData);
      if (response.data && response.status === 201) {
        showAlert({
          severity: 'success',
          title: 'Awesome',
          body: 'The company was updated successfully'
        });

        const updatedProfile = response.data;
        onEditCompleted(updatedProfile);
      }
    } catch (err) {
      showAlert({
        severity: 'error',
        title: 'Company',
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
        title="EDITING COMPANY"
        onSubmit={form.handleSubmit(onSubmit)}
        onClose={onEditClosed}
        uiState={uiState}
      >
        <Box>
          <CompanyForm initialValues={initialValues} />
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

const CompanyEditConnected = connect(null, mapDispatchToProps)(CompanyEdit);

export default CompanyEditConnected;
