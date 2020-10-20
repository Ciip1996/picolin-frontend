// @flow
import React, { useState, useEffect } from 'react';
import { useForm, FormContext } from 'react-hook-form';

import FormHelperText from '@material-ui/core/FormHelperText';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Box from '@material-ui/core/Box';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';

import { CancelCheckBox } from 'UI/res';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import TextBox from 'UI/components/atoms/TextBox';
import Text from 'UI/components/atoms/Text';
import type { UserRole } from 'types/app';

import { getUserHighestRole } from 'services/Authorization';
import type { Map } from 'types';
import { globalStyles } from 'GlobalStyles';
import { Roles } from 'UI/constants/roles';
import { getErrorMessage } from 'UI/utils';
import { Endpoints } from 'UI/constants/endpoints';
import API from 'services/API';
import { styles } from './styles';

const OutlineCheck = () => {
  const CheckOutlineSize = 20;
  return <CheckBoxOutlineBlankIcon style={{ width: CheckOutlineSize, height: CheckOutlineSize }} />;
};

type FeeAgreementDeclineDrawerProps = {
  feeAgreement: Object,
  handleClose: any => any,
  onResponse: any => any
};

const FeeAgreementDeclineDrawer = (props: FeeAgreementDeclineDrawerProps) => {
  const { feeAgreement, onResponse, handleClose } = props;
  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isFormDisabled: false,
    isReadOnly: false,
    isLoading: true
  });
  const {
    declination_notes,
    verbiage_changes_requested,
    fee_percentage_change_requested,
    guarantee_days_change_requested,
    fee_percentage,
    guarantee_days
  } = feeAgreement || {};

  const [formValues, setFormValues] = useState({
    declined_fields: {
      fee_percentage: null,
      guarantee_days: null,
      verbiage_change: null
    },
    declination_notes,
    verbiage_changes_requested,
    fee_percentage_change_requested,
    guarantee_days_change_requested,
    fee_percentage,
    guarantee_days
  });

  const CheckSize = 20;
  const form = useForm({ defaultValues: {} });

  const { handleSubmit, setValue, errors, register, getValues } = form;

  const getEndpoint = () => {
    const userRole: UserRole = getUserHighestRole();
    const roles = Object.keys(Roles);
    if (userRole.title === roles[Roles['Regional Director']]) {
      return `${Endpoints.FeeAgreement}/${Endpoints.FeeAgreementDeclinationByRegionalDirector}`;
    }
    if (userRole.title === roles[Roles['Production Director']]) {
      return `${Endpoints.FeeAgreement}/${Endpoints.FeeAgreementDeclinationByProductionDirector}`;
    }
    return undefined;
  };

  const onSubmit = async (formData: any) => {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));
      const endpoint = getEndpoint();
      const response = await API.post(
        endpoint && endpoint.replace(':id', feeAgreement.id),
        formData
      );
      if (response.status === 200) {
        setUiState(prevState => ({
          ...prevState,
          isSuccess: true,
          isSaving: false
        }));
        onResponse({
          severity: 'success',
          title: 'Awesome',
          body: `The Fee Agreement was declined successfully`
        });
        handleClose && handleClose();
      }
    } catch (err) {
      onResponse({
        severity: 'error',
        title: `Fee Agreement not declined`,
        body: getErrorMessage(err),
        autoHideDuration: 8000
      });
    } finally {
      setUiState(prevState => ({
        ...prevState,
        isSuccess: false,
        isSaving: false
      }));
    }
  };
  const handleTextChange = (field: string, value: any) => {
    setFormValues((prevState: Map): Map => ({
      ...prevState,
      [field]: value
    }));
    setValue(field, value, true);
  };

  const handleCheckChange = (event: any) => {
    const { name, checked } = event.target;
    setValue(name, checked ? name : null, checked);
    setFormValues((prevState: any) => {
      return {
        ...prevState,
        declined_fields: { ...prevState.declined_fields, [name]: checked }
      };
    });
  };

  useEffect(() => {
    register({ name: 'declined_fields' }, { required: 'Select at least one' });
  }, [register]);

  useEffect(() => {
    const newValues = [];
    formValues.declined_fields.fee_percentage && newValues.push('fee_percentage');
    formValues.declined_fields.guarantee_days && newValues.push('guarantee_days');
    formValues.declined_fields.verbiage_change && newValues.push('verbiage_change');
    setValue('declined_fields', newValues.length > 0 ? newValues : undefined, true);
  }, [formValues, getValues, setValue]);

  return (
    <DrawerFormLayout
      onSecondaryButtonClick={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      onClose={handleClose}
      variant="borderless"
      uiState={uiState}
      title="DECLINE FEE AGREEMENT"
      initialText="Decline"
    >
      <div>
        <FormContext {...form}>
          <Box>
            <div style={globalStyles.feeDrawerslabel}>
              <div style={styles.sectionLabel}>
                <Text
                  variant="subtitle1"
                  text="Select the change(s) you decided to decline."
                  fontSize={14}
                />
              </div>
            </div>
            <FormControl component="fieldset" error={!!errors.declined_fields}>
              <FormGroup
                aria-label="position"
                name="declined_fields"
                onChange={handleCheckChange}
                // value={formValues}
                row
              >
                <div style={styles.checkBoxContainer}>
                  <FormHelperText>
                    {errors.declined_fields && errors.declined_fields.message}
                  </FormHelperText>
                  <FormControlLabel
                    value="end"
                    style={styles.label}
                    control={
                      <Checkbox
                        checked={formValues.declined_fields.fee_percentage}
                        disabled={!formValues.fee_percentage_change_requested}
                        icon={<OutlineCheck />}
                        checkedIcon={<CancelCheckBox size={CheckSize} />}
                        name="fee_percentage"
                        onChange={handleCheckChange}
                        ref={register}
                      />
                    }
                    label={`Fee ${formValues.fee_percentage}%`}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="end"
                    style={styles.label}
                    control={
                      <Checkbox
                        checked={formValues.declined_fields.guarantee_days}
                        disabled={!formValues.guarantee_days_change_requested}
                        icon={<OutlineCheck />}
                        checkedIcon={<CancelCheckBox size={CheckSize} />}
                        name="guarantee_days"
                        onChange={handleCheckChange}
                        ref={register}
                      />
                    }
                    label={`${formValues.guarantee_days} Days under guarantee`}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="end"
                    style={styles.label}
                    control={
                      <Checkbox
                        checked={formValues.declined_fields.verbiage_change}
                        disabled={!formValues.verbiage_changes_requested}
                        icon={<OutlineCheck />}
                        checkedIcon={<CancelCheckBox size={CheckSize} />}
                        name="verbiage_change"
                        onChange={handleCheckChange}
                        ref={register}
                      />
                    }
                    label="Verbiage Change"
                    labelPlacement="end"
                  />
                </div>
              </FormGroup>
            </FormControl>
          </Box>
          <div style={globalStyles.feeDrawerslabel}>
            <div style={styles.sectionLabel}>
              <Text
                variant="subtitle1"
                text="Please specify the reason of declination"
                fontSize={14}
                label="Reason to decline"
              />
            </div>
          </div>
          <TextBox
            name="declination_notes"
            value={formValues.declination_notes}
            onChange={handleTextChange}
            multiline
            label="Reason of declination *"
            inputRef={register({ required: 'Wite the reason of declination' })}
            error={!!errors.declination_notes}
            errorText={errors.declination_notes && errors.declination_notes.message}
          />
          <div />
        </FormContext>
      </div>
    </DrawerFormLayout>
  );
};

FeeAgreementDeclineDrawer.defaultProps = {
  handleClose: () => {},
  onResponse: () => {}
};

export default FeeAgreementDeclineDrawer;
