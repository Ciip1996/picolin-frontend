// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import moment from 'moment';

import Box from '@material-ui/core/Box';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';

import { showAlert as showAlertAction } from 'actions/app';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import TextBox from 'UI/components/atoms/TextBox';
import CustomDatePicker from 'UI/components/atoms/CustomDatePicker';
import AutocompleteSelect, {
  statusRenderOption,
  statusStartAdornment
} from 'UI/components/molecules/AutocompleteSelect';
import { EditIcon, colors } from 'UI/res';
import { globalStyles } from 'GlobalStyles';

import type { Map } from 'types';
import {
  nestTernary,
  PERCENT_VALIDATION,
  WARRANTY_VALIDATION,
  removePercentageFromStringNumber,
  getErrorMessage
} from 'UI/utils';
import API from 'services/API';
import { getCurrentUser } from 'services/Authentication';
import {
  canUserEditEntity,
  userHasPermission,
  Permissions,
  userHasRole
} from 'services/Authorization';
import { Roles } from 'UI/constants/roles';
import { Endpoints } from 'UI/constants/endpoints';
import { Typography } from '@material-ui/core';
import { styles } from './styles';

type JobOrderSheetProps = {
  whitesheet: any,
  profile: any,
  joborderId?: number | string,
  isReadOnly: boolean,
  onWhitesheetCompleted: (whitesheet: any) => void,
  onWhitesheetClosed: () => void,
  showAlert: any => void
};

const NUMBER_OF_DATES = 3;
const datesIndexer = Array.from({ length: NUMBER_OF_DATES }).map((_, index) => index);
const FEE_AGREEMENT_PERCENT = 33.33;
const WARRANTY = 30;

const canChangeFeeAgreementField = (
  canUserEdit: boolean,
  whitesheet: any,
  fieldPermission: string
) => {
  const isUserCoach = userHasRole(Roles.Coach);
  const isExistingWhitesheet = whitesheet?.id;
  const hasRightPrivileges = isUserCoach || userHasPermission(fieldPermission);

  return hasRightPrivileges && (!isExistingWhitesheet || (isExistingWhitesheet && canUserEdit));
};

const JobOrderSheet = (props: JobOrderSheetProps) => {
  const {
    whitesheet,
    profile,
    onWhitesheetCompleted,
    onWhitesheetClosed,
    joborderId = '',
    isReadOnly,
    showAlert
  } = props;

  const currentUser = getCurrentUser();

  const [canDiscussing, setDiscussing] = useState(
    whitesheet ? nestTernary(Number(whitesheet.discussing_agreement_complete) === 1, '1', '0') : ''
  );
  const [comboValues, setComboValues] = useState<Map>({
    job_order_type_id: whitesheet?.jobOrderType || null,
    work_type_option_id: whitesheet?.workTypeOption || null
  });

  const { register, errors, handleSubmit, setValue, getValues } = useForm(
    !whitesheet
      ? {
          defaultValues: {
            fee_agreement_percent: FEE_AGREEMENT_PERCENT,
            warranty_time_in_days: WARRANTY,
            time_position_open: null,
            position_filled: null,
            preset_interview_dates: [null, null, null]
          }
        }
      : {
          defaultValues: {
            ...whitesheet
          }
        }
  );

  const canUserEdit = canUserEditEntity(currentUser, profile);
  const canModifyFeeGuarantee = canChangeFeeAgreementField(
    canUserEdit,
    whitesheet,
    Permissions.FeeAgreements.ModifyGuarantee
  );
  const canModifyFeePercentage = canChangeFeeAgreementField(
    canUserEdit,
    whitesheet,
    Permissions.FeeAgreements.ModifyPercentage
  );

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isReadOnly,
    isFormDisabled: isReadOnly || (!canUserEdit && whitesheet)
  });

  useEffect(() => {
    register(
      { name: 'discussing_agreement_complete' },
      { required: 'Indicate if discussing fee agrement is complete' }
    );
    register({ name: 'time_position_open' }, { required: 'This field is required' });
    register({ name: 'position_filled' }, { required: 'This field is required' });
    register({ name: 'maximum_compensation' }, { required: 'This field is required' });
    register({ name: 'minimum_compensation' }, { required: 'This field is required' });
    register({ name: 'good_compensation' }, { required: 'This field is required' });
    datesIndexer.forEach((_, index) => {
      register({ name: `preset_interview_dates[${index}]` });
    });
    register({ name: 'job_order_type_id' }, { required: 'This field is required' });
    register({ name: 'work_type_option_id' }, { required: 'This field is required' });
  }, [register, getValues]);

  const FormControlDiscussing = () => {
    const handleChange = e => {
      const { value } = e.target;

      setValue('discussing_agreement_complete', value, true);
      setDiscussing(value);
    };

    return (
      <FormControl component="fieldset" error={!!errors.discussing_agreement_complete}>
        <RadioGroup
          aria-label="position"
          name="discussing_agreement_complete"
          value={canDiscussing}
          onChange={handleChange}
          row
        >
          <FormControlLabel
            className="l-radio-check"
            value="1"
            control={<Radio color="primary" />}
            label="Yes"
            labelPlacement="end"
            disabled={uiState.isFormDisabled}
          />
          <FormControlLabel
            className="l-radio-check"
            value="0"
            control={<Radio color="primary" />}
            label="Pending"
            labelPlacement="end"
            disabled={uiState.isFormDisabled}
          />
        </RadioGroup>
        <FormHelperText>
          {errors.discussing_agreement_complete && errors.discussing_agreement_complete.message}
        </FormHelperText>
      </FormControl>
    );
  };

  const handleDateChange = (name, date) => {
    setValue(name, date, true);
    setUiState({ ...uiState }); // TODO to force a render as form hook doest not fire a render
  };

  const handleEditClick = () => {
    setUiState(prevState => ({
      ...prevState,
      isReadOnly: false,
      isFormDisabled: !canUserEdit && whitesheet
    }));
  };

  async function onSubmit(formData) {
    const whitesheetData = {
      ...formData,
      fee_agreement_percent: removePercentageFromStringNumber(formData.fee_agreement_percent)
    };

    if (whitesheet) {
      await updateExistingWhitesheet(whitesheetData);
    } else {
      onWhitesheetCompleted && onWhitesheetCompleted(whitesheetData);
    }
  }

  const updateExistingWhitesheet = async sheet => {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));

      const response = await API.put(
        `${Endpoints.JobOrders}/${joborderId}/whiteSheets/${whitesheet.id}`,
        sheet
      );
      if (response.data) {
        setUiState(prevState => ({
          ...prevState,
          isSuccess: false /** just to reset the button state and because it wouldnt be visible */,
          isSaving: false
        }));

        showAlert({
          severity: 'success',
          title: 'Awesome',
          body: 'The write up was updated successfully'
        });

        onWhitesheetCompleted && onWhitesheetCompleted(response.data);
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
      isSuccess: false /** just to reset the button state and because it wouldnt be visible */,
      isSaving: false
    }));
  };

  const handleSalaryChange = (name?: string, value: any) => {
    setValue(name, value, true);
    setUiState({ ...uiState }); // to force a render as form hook doest not fire a render
  };

  const handleFeePercentageChange = (name?: string, text: any) => {
    setValue(name, text, true);
    setUiState({ ...uiState }); // to force a render as form hook doest not fire a render
  };

  const handleComboChange = (name?: string, value: any) => {
    setComboValues((prevState: Map): Map => ({ ...prevState, [name]: value }));
    setValue(name, value ? value.id : value, true);
  };

  const timeLooking = getValues('time_position_open');
  const lookingFor = timeLooking ? moment(timeLooking).fromNow(true) : '---';

  return (
    <DrawerFormLayout
      onSubmit={handleSubmit(onSubmit)}
      onClose={onWhitesheetClosed}
      uiState={uiState}
      title="WRITE UP"
      additionalHeaderButtons={
        whitesheet &&
        whitesheet.id &&
        uiState.isReadOnly &&
        canUserEdit && (
          <CustomIconButton style={styles.headerIcon} tooltipText="Edit" onClick={handleEditClick}>
            <EditIcon fill={colors.black} width={20} height={20} />
          </CustomIconButton>
        )
      }
    >
      <Typography variant="h2">
        <Box mb={0.625}>
          <Box>1.- Signed Fee Agreement?*</Box>
          <FormControlDiscussing />
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>2.- Fee Agreement Percent*</Box>
          <Box style={globalStyles.sheetInputMargin}>
            <TextBox
              name="fee_agreement_percent"
              label="Fee %*"
              defaultValue={
                whitesheet ? whitesheet.fee_agreement_percent : FEE_AGREEMENT_PERCENT.toString()
              }
              error={!!errors.fee_agreement_percent}
              errorText={errors.fee_agreement_percent && errors.fee_agreement_percent.message}
              inputRef={register({
                required: 'Fee percent is required',
                ...PERCENT_VALIDATION
              })}
              width="100%"
              inputType="percentage"
              inputProps={{
                step: 0.01
              }}
              disabled={!canModifyFeePercentage || uiState.isFormDisabled}
              onChange={handleFeePercentageChange}
            />
          </Box>
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>3.- Guarantee*</Box>
          <Box style={globalStyles.sheetInputMargin}>
            <TextBox
              name="warranty_time_in_days"
              label="Guarantee*"
              defaultValue={`${WARRANTY}`}
              error={!!errors.warranty_time_in_days}
              errorText={errors.warranty_time_in_days && errors.warranty_time_in_days.message}
              inputRef={register({
                required: 'Guarantee time is required',
                ...WARRANTY_VALIDATION
              })}
              disabled={!canModifyFeeGuarantee || uiState.isFormDisabled}
              width="100%"
              inputType="number"
            />
          </Box>
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>4.- How long has this position been open?*</Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <CustomDatePicker
                name="time_position_open"
                label="Open Since*"
                disableFuture
                value={timeLooking}
                onDateChange={handleDateChange}
                error={!!errors.time_position_open}
                helperText={errors.time_position_open && errors.time_position_open.message}
                disabled={uiState.isFormDisabled}
              />
            </Grid>
            <Grid item xs={4}>
              <Box mt={1}>
                Open for <br />
                <b>{lookingFor}</b>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>5.- When do you need the position to be filled?*</Box>
          <Box my={1.4}>
            <CustomDatePicker
              name="position_filled"
              label="Start Date*"
              disablePast={!whitesheet?.id}
              value={getValues('position_filled')}
              onDateChange={handleDateChange}
              error={!!errors.position_filled}
              helperText={errors.position_filled && errors.position_filled.message}
              disabled={uiState.isFormDisabled}
              width="100%"
            />
          </Box>
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>6.- Compensation salary range:*</Box>
          <Box style={globalStyles.sheetInputMargin}>
            <TextBox
              name="maximum_compensation"
              label="High salary*"
              error={!!errors.maximum_compensation}
              errorText={errors.maximum_compensation && errors.maximum_compensation.message}
              value={getValues('maximum_compensation') || ''}
              onChange={handleSalaryChange}
              inputType="currency"
              disabled={uiState.isFormDisabled}
              width="100%"
            />
            <TextBox
              name="minimum_compensation"
              label="Low salary*"
              error={!!errors.minimum_compensation}
              errorText={errors.minimum_compensation && errors.minimum_compensation.message}
              value={getValues('minimum_compensation') || ''}
              onChange={handleSalaryChange}
              inputType="currency"
              disabled={uiState.isFormDisabled}
              width="100%"
            />
            <TextBox
              name="good_compensation"
              label="Ideal salary*"
              error={!!errors.good_compensation}
              errorText={errors.good_compensation && errors.good_compensation.message}
              value={getValues('good_compensation') || ''}
              onChange={handleSalaryChange}
              inputType="currency"
              disabled={uiState.isFormDisabled}
              width="100%"
            />
          </Box>
          <Box style={globalStyles.sheetQuestionItem}>
            <Box fontSize={16} fontWeight={300} my={1}>
              Other Compensations and benefits
            </Box>
            <Box style={globalStyles.sheetInputMargin}>
              <TextBox
                label="Other benefits*"
                multiline
                name="benefits"
                inputRef={register({ required: 'Other benefits is required' })}
                error={!!errors.benefits}
                errorText={errors.benefits && errors.benefits.message}
                disabled={uiState.isFormDisabled}
              />
            </Box>
          </Box>
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>7.- Minimum background requirements*</Box>
          <Box style={globalStyles.sheetInputMargin}>
            <TextBox
              label="Background requirements*"
              name="background_requirements"
              inputRef={register({ required: 'Minimum background requirements is required' })}
              error={!!errors.background_requirements}
              errorText={errors.background_requirements && errors.background_requirements.message}
              disabled={uiState.isFormDisabled}
              multiline
            />
          </Box>
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>9.- Work location*</Box>
          <Box style={globalStyles.sheetInputMargin}>
            <AutocompleteSelect
              width="100%"
              name="work_type_option_id"
              selectedValue={comboValues.work_type_option_id}
              placeholder="Work preference *"
              error={!!errors.work_type_option_id}
              errorText={errors.work_type_option_id && errors.work_type_option_id.message}
              url={Endpoints.WorkTypes}
              onSelect={handleComboChange}
              disabled={uiState.isFormDisabled}
            />
          </Box>
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>10.- Preset interview dates</Box>
          <Box style={globalStyles.sheetInputMargin}>
            {datesIndexer.map(index => (
              <CustomDatePicker
                key={`preset_interview_dates[${index}]`}
                name={`preset_interview_dates[${index}]`}
                label="Date & Time"
                value={getValues(`preset_interview_dates[${index}]`) || null}
                onDateChange={handleDateChange}
                withTime
                disablePast={!whitesheet?.id}
                disabled={uiState.isFormDisabled}
              />
            ))}
          </Box>
        </Box>

        <Box style={globalStyles.sheetQuestionItem}>
          <Box>11.- Job Order Status*</Box>
          <Box mt={2.8}>
            <AutocompleteSelect
              name="job_order_type_id"
              selectedValue={comboValues.job_order_type_id}
              placeholder="Job Order Type *"
              error={!!errors.job_order_type_id}
              errorText={errors.job_order_type_id && errors.job_order_type_id.message}
              url={Endpoints.JobOrderTypes}
              onSelect={handleComboChange}
              disabled={uiState.isFormDisabled}
              renderOption={statusRenderOption}
              startAdornment={
                comboValues.job_order_type_id &&
                statusStartAdornment(comboValues.job_order_type_id.style_class_name)
              }
            />
          </Box>
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>Notes*:</Box>
          <Box style={globalStyles.sheetInputMargin}>
            <TextBox
              name="notes"
              label="More details"
              inputRef={register({ required: 'More details is required' })}
              error={!!errors.notes}
              errorText={errors.notes && errors.notes.message}
              disabled={uiState.isFormDisabled}
              multiline
            />
          </Box>
        </Box>
      </Typography>
    </DrawerFormLayout>
  );
};

JobOrderSheet.defaultProps = {
  whitesheet: null,
  joborderId: null,
  profile: null
};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert))
  };
};

const JobOrderSheetConnected = connect(null, mapDispatchToProps)(JobOrderSheet);

export default JobOrderSheetConnected;
