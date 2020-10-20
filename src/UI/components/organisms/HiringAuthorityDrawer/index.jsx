// @flow
import React, { useState } from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { connect } from 'react-redux';
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import HiringAuthorityForm from 'UI/components/organisms/HiringAuthorityForm';

import { getErrorMessage } from 'UI/utils';

import API from 'services/API';
import { showAlert as showAlertAction } from 'actions/app';
import { EntityType } from 'UI/constants/entityTypes';
import HiringAuthoritySelectForm from '../HiringAuthoritySelectForm';

type HiringAuthorityDrawerProps = {
  hiringAuthority?: Object,
  endpoint: string,
  companyId: number,
  joborderId: number,
  onHACompleted: (hiringAuthority: any) => void,
  onHAClosed: () => void,
  showAlert: any => void,
  type: 'company' | 'joborder',
  isEditing: boolean
};

const HiringAuthorityDrawer = (props: HiringAuthorityDrawerProps) => {
  const {
    hiringAuthority,
    onHACompleted,
    onHAClosed,
    showAlert,
    endpoint,
    companyId,
    joborderId,
    type,
    isEditing
  } = props;

  const isEditMode = isEditing;

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isFormDisabled: false,
    isReadOnly: false
  });

  const {
    company_id,
    created_at,
    ext,
    first_name,
    full_name,
    hiring_authority_status_id,
    id,
    last_name,
    other_ext,
    pcr_record,
    personal_email,
    personal_phone,
    position_id,
    specialty_id,
    specialty,
    position,
    subspecialty,
    title,
    updated_at,
    work_email,
    work_phone
  } = hiringAuthority || {};

  const initialValuesHA = {
    specialty_id: specialty,
    subspecialty_id: subspecialty,
    position_id: position
  };

  const form = useForm(
    hiringAuthority
      ? {
          defaultValues: {
            ...hiringAuthority,
            company_id,
            created_at,
            ext,
            first_name,
            full_name,
            hiring_authority_status_id,
            id,
            last_name,
            other_ext,
            pcr_record,
            personal_email,
            personal_phone,
            position_id,
            specialty_id,
            subspecialty_id: subspecialty?.id,
            title,
            updated_at,
            work_email,
            work_phone
          }
        }
      : {}
  );

  const { handleSubmit, reset } = form;
  const [isSelectingHA, setIsSelectingHA] = useState(false);

  const handleCancelClick = () => {
    onHAClosed && onHAClosed();
    reset();
  };

  async function onSubmit(formData) {
    if (endpoint) {
      await saveHiringAuthority(formData);
    } else {
      const { existingHiringAuthority, ...formRest } = formData;
      const formWithoutNulls = omitBy(formRest, isNil);
      /* When an HA was selected but had no specialty, it's necessary to merge specialty/subspecialty combos with the existing HA */
      const mergedData = { ...existingHiringAuthority, ...formWithoutNulls };
      onHACompleted && onHACompleted(existingHiringAuthority ? mergedData : formData);
    }
  }

  const saveHiringAuthority = async ha => {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));
      let response;

      if (isSelectingHA) {
        response = await API.put(
          `${endpoint}/${ha.hiring_authority_id}${type === EntityType.Company ? '/assign' : ''}`,
          {
            ...ha,
            company_id: companyId
          }
        );
      } else {
        response = isEditMode
          ? await API.put(endpoint, { ...ha, company_id: companyId })
          : await API.post(endpoint, { ...ha, company_id: companyId });
      }

      // onHACompleted && response.data && onHACompleted(response.data);

      setUiState(prevState => ({
        ...prevState,
        isSuccess: true,
        isSaving: false
      }));

      showAlert({
        severity: 'success',
        title: 'Awesome',
        body: `The hiring authority was ${isEditMode ? 'updated' : 'added'} successfully`
      });

      // onHACompleted && onHACompleted(response.data);
      onHACompleted && response.data && onHACompleted(response.data);
    } catch (err) {
      setUiState(prevState => ({
        ...prevState,
        isSuccess: false,
        isSaving: false
      }));
      showAlert({
        severity: 'error',
        title: `Hiring authority ${isEditMode ? 'not updated' : 'not added'} `,
        body: getErrorMessage(err)
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
      onClose={handleCancelClick}
      uiState={uiState}
      title={isEditMode ? 'EDIT HIRING AUTHORITY' : 'ADD HIRING AUTHORITY TO THIS COMPANY'}
    >
      <Text variant="body2" text="Required *" />
      <Box my={4}>
        <Box mt={2}>
          <FormContext {...form}>
            {isSelectingHA && !isEditMode ? (
              <>
                <strong>
                  Select an existing Hiring Authority or
                  <Button color="primary" onClick={() => setIsSelectingHA(false)}>
                    Create a new one
                  </Button>
                </strong>
                <HiringAuthoritySelectForm joborderId={joborderId} type={type} />
              </>
            ) : (
              <>
                {!isSelectingHA && !isEditMode && (
                  <>
                    <strong>
                      You are now creating a new Hiring Authority but you can
                      <Button color="primary" onClick={() => setIsSelectingHA(true)}>
                        Select an existing one
                      </Button>
                      instead.
                    </strong>
                    {type === EntityType.Joborder && (
                      <p>
                        This Hiring Authority will be added to the company and to the job order at
                        the same time.
                      </p>
                    )}
                  </>
                )}
                <HiringAuthorityForm initialValues={initialValuesHA} />
              </>
            )}
          </FormContext>
        </Box>
      </Box>
    </DrawerFormLayout>
  );
};

HiringAuthorityDrawer.defaultProps = {
  hiringAuthority: {},
  companyId: 0,
  joborderId: 0,
  endpoint: null
};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert))
  };
};

const HiringAuthorityDrawerConnected = connect(null, mapDispatchToProps)(HiringAuthorityDrawer);

export default HiringAuthorityDrawerConnected;
