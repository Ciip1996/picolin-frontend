// @flow
import React, { useState, useEffect } from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { showAlert } from 'actions/app';
import { connect } from 'react-redux';

import type { DrawerUiState } from 'types/app';
import {
  getErrorMessage,
  PERCENT_VALIDATION,
  WARRANTY_VALIDATION,
  VALIDATION_REGEXS,
  removePercentageFromStringNumber
} from 'UI/utils/index';

import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';

import Text from 'UI/components/molecules/ProductCard/node_modules/UI/components/atoms/Text';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import TextBox from 'UI/components/atoms/TextBox';
// import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
// import { Endpoints } from 'UI/constants/endpoints';
import SelectBox from 'UI/components/atoms/SelectBox';

import type { Map } from 'types';
import API from 'services/API';
import { styles } from './style';

type FeeAgreementDrawerProps = {
  onFAClosed: () => void,
  onFACompleted: Object => any,
  hiringAuthorities: Array<Object>,
  onShowAlert: any => void,
  endpoint: string,
  company: Object,
  initialValues: any
};

const FeeAgreementDrawer = (props: FeeAgreementDrawerProps) => {
  const {
    onFAClosed,
    onFACompleted,
    hiringAuthorities,
    onShowAlert,
    endpoint,
    company,
    initialValues
  } = props;

  const [uiState, setUiState] = useState<DrawerUiState>({
    isSaving: false,
    isSuccess: false,
    isFormDisabled: false,
    isReadOnly: false
  });

  // const [comboValues, setComboValues] = useState<Map>({
  //   company
  // });

  const defaultValues = {
    fee_percentage: '33.33',
    guarantee_days: '30',
    notes: '',
    verbiage_changes: '',
    verbiage_changes_requested: false,
    fee_percentage_change_requested: false,
    guarantee_days_change_requested: false
  };

  const init = initialValues ? { ...initialValues } : { ...defaultValues };
  const [formValues, setFormValues] = useState<Map>(init);

  const form = useForm({ defaultValues: init });
  const { register, errors, handleSubmit, setValue, unregister } = form;

  // const defaultOptionSelectedFn = (option, value) => option.id === value.id;

  const handleComboChange = (name?: string, value: any) => {
    // setComboValues((prevState: Map): Map => ({ ...prevState, [name]: value }));
    setValue(name, value, true);
  };

  const handleToogleCheck = (event: any, value?: any) => {
    const {
      target: { name, id }
    } = event;
    setFormValues((prevState: Map): Map => ({
      ...prevState,
      [id]: value ? '' : defaultValues[id]
    }));
    setValue(id, value ? '' : defaultValues[id], true);
    setFormValues((prevState: Map): Map => ({ ...prevState, [name]: value }));
    setValue(name, value, true);
  };

  const handleTextChange = (field: string, value: any) => {
    setFormValues((prevState: Map): Map => ({
      ...prevState,
      [field]: value
    }));
    setValue(field, value, true);
  };

  // The following method will only be called when the fee_percentage agreement is being created in the company company page
  const saveFeeAgreement = async fa => {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));
      const response = await API.post(endpoint, { ...fa });
      setUiState(prevState => ({
        ...prevState,
        isSuccess: true,
        isSaving: false
      }));
      onShowAlert({
        severity: 'success',
        title: 'Awesome',
        body: `The Fee Agreement was added successfully`
      });
      onFACompleted && response.data && onFACompleted(response.data);
    } catch (err) {
      onShowAlert({
        severity: 'error',
        title: `Fee Agreement not added`,
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

  async function onSubmit(formData) {
    const data = {
      ...formData,
      fee_percentage: removePercentageFromStringNumber(formData.fee_percentage),
      template_id: 'a8514a34-75fe-40d6-8af1-871788293d16',
      hiring_authority_email: formData?.hiringAuthority?.work_email
    };
    if (endpoint) {
      await saveFeeAgreement(data);
    } else {
      onFACompleted && onFACompleted(data);
    }
    setUiState(prevState => ({
      ...prevState,
      isSuccess: false,
      isSaving: false
    }));
  }

  useEffect(() => {
    register({ name: 'hiringAuthority' }, { required: 'Hiring Authority is required' });
    register({ name: 'fee_percentage_change_requested' });
    register({ name: 'verbiage_changes_requested' });
    register({ name: 'guarantee_days_change_requested' });
    register({ name: 'verbiage_changes' });
  }, [register]);

  useEffect(() => {
    // has verbiage changes requested
    if (formValues.verbiage_changes_requested) {
      unregister('verbiage_changes');
      register({ name: 'verbiage_changes' }, { required: 'Verbiage change is required' });
    } else {
      unregister('verbiage_changes');
      register({ name: 'verbiage_changes' });
    }
  }, [register, formValues.verbiage_changes_requested, unregister]);

  return (
    <DrawerFormLayout
      onSubmit={handleSubmit(onSubmit)}
      onClose={onFAClosed}
      variant="borderless"
      uiState={uiState}
      title="Create Fee Agreement"
      isTopToolbarNeeded
      isBottomToolbarNeeded
      onSecondaryButtonClick={onFAClosed}
    >
      <FormContext {...form}>
        <TextBox
          name="fee_percentage"
          label="Fee %*"
          value={formValues.fee_percentage}
          inputRef={register({
            required: 'Fee percent is required',
            ...PERCENT_VALIDATION
          })}
          error={!!errors.fee_percentage}
          errorText={errors.fee_percentage && errors.fee_percentage.message}
          defaultValue={defaultValues.fee_percentage}
          onChange={handleTextChange}
          inputType="percentage"
          disabled={!formValues.fee_percentage_change_requested}
        />
        <FormControl component="fieldset">
          <FormGroup aria-label="position" row>
            <div style={styles.checkBoxContainer}>
              <FormControlLabel
                value="end"
                control={
                  <Checkbox
                    id="fee_percentage"
                    name="fee_percentage_change_requested"
                    onChange={handleToogleCheck}
                    checked={formValues.fee_percentage_change_requested}
                    color="primary"
                  />
                }
                label="Request Fee Agreement % change"
                labelPlacement="end"
              />
            </div>
          </FormGroup>
        </FormControl>
        <TextBox
          name="guarantee_days"
          label="Days under guarantee *"
          value={formValues.guarantee_days}
          inputRef={register({
            required: 'Guarantee time is required',
            ...WARRANTY_VALIDATION // TODO: check why is not working this validation
          })}
          error={!!errors.guarantee_days}
          errorText={errors.guarantee_days && errors.guarantee_days.message}
          defaultValue={defaultValues.guarantee_days}
          onChange={handleTextChange}
          inputType="number"
          disabled={!formValues.guarantee_days_change_requested}
        />
        <FormControl component="fieldset">
          <FormGroup aria-label="position" row>
            <div style={styles.checkBoxContainer}>
              <FormControlLabel
                value="end"
                control={
                  <Checkbox
                    id="guarantee_days"
                    name="guarantee_days_change_requested"
                    onChange={handleToogleCheck}
                    checked={formValues.guarantee_days_change_requested}
                    color="primary"
                  />
                }
                label="Request Guarantee Period change"
                labelPlacement="end"
              />
            </div>
          </FormGroup>
        </FormControl>
        {company && (
          <TextBox
            outPutValue
            name="company"
            label="Company"
            error={!!errors.company}
            errorText={errors.company && errors.company.message}
            value={company?.name}
          />
        )}
        <div style={styles.inputSpacing}>
          <SelectBox
            options={hiringAuthorities}
            onSelect={handleComboChange}
            displayKey="full_name"
            name="hiringAuthority"
            placeholder="Hiring Authority *"
            error={!!errors.hiringAuthority}
            errorText={errors.hiringAuthority && errors.hiringAuthority.message}
            selected={formValues?.hiringAuthority || undefined}
          />
        </div>
        <TextBox
          name="cc_email"
          label="CC Email"
          error={!!errors.cc_email}
          errorText={errors.cc_email && errors.cc_email.message}
          onChange={handleTextChange}
          inputRef={register({
            pattern: {
              value: VALIDATION_REGEXS.EMAIL,
              message: 'Email must be valid'
            }
          })}
        />
        <FormControl component="fieldset">
          <FormGroup aria-label="position" row>
            <div style={styles.checkBoxContainer}>
              <FormControlLabel
                value="end"
                control={
                  <Checkbox
                    id="verbiage_changes"
                    name="verbiage_changes_requested"
                    onChange={handleToogleCheck}
                    checked={formValues.verbiage_changes_requested}
                    color="primary"
                  />
                }
                label="Request Verbiage Change"
                labelPlacement="end"
              />
            </div>
          </FormGroup>
        </FormControl>
        {formValues.verbiage_changes_requested && (
          <>
            <TextBox
              name="verbiage_changes"
              value={formValues.verbiage_changes}
              label="Verbiage Change(s)"
              error={!!errors.verbiage_changes}
              errorText={errors.verbiage_changes && errors.verbiage_changes.message}
              multiline
              onChange={handleTextChange}
            />
            <Divider />
          </>
        )}
        <Text variant="subtitle1" text="Notes from Recruiter" />
        <TextBox
          name="notes"
          label="Notes"
          error={!!errors.notes}
          errorText={errors.notes && errors.notes.message}
          multiline
          onChange={handleTextChange}
          inputRef={register({})}
        />
      </FormContext>
    </DrawerFormLayout>
  );
};

FeeAgreementDrawer.defaultProps = {
  company: undefined,
  initialValues: undefined
};

// export default FeeAgreementDrawer;

const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(FeeAgreementDrawer);
