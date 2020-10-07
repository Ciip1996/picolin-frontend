// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import moment from 'moment';

import Box from '@material-ui/core/Box';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import { EditIcon, colors } from 'UI/res';
import { globalStyles } from 'GlobalStyles';
import AutocompleteSelect, {
  statusRenderOption,
  statusStartAdornment
} from 'UI/components/molecules/AutocompleteSelect';
import TextBox from 'UI/components/atoms/TextBox';
import CustomDatePicker from 'UI/components/atoms/CustomDatePicker';
import { nestTernary, getErrorMessage, ACHIEVEMENT_VALIDATION } from 'UI/utils';
import { getCurrentUser } from 'services/Authentication';
import { canUserEditEntity } from 'services/Authorization';
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';

import { showAlert as showAlertAction } from 'actions/app';
import type { Map } from 'types';
import Typography from '@material-ui/core/Typography';
import { styles } from './styles';

type CandidateSheetProps = {
  bluesheet: any,
  profile: any,
  candidateId?: number | string,
  isReadOnly: boolean,
  onBluesheetCompleted: (bluesheet: any) => void,
  onBluesheetClosed: () => void,
  showAlert: any => void
};

const NUMBER_OF_DATES = 3;
const datesIndexer = Array.from({ length: NUMBER_OF_DATES }).map((_, index) => index);

const CandidateSheet = (props: CandidateSheetProps) => {
  const {
    bluesheet,
    profile,
    onBluesheetCompleted,
    onBluesheetClosed,
    candidateId = '',
    isReadOnly,
    showAlert
  } = props;

  const currentUser = getCurrentUser();

  const prevRelocations =
    bluesheet && bluesheet.relocations
      ? bluesheet.relocations.map(rel => ({
          ...rel.city,
          slug: rel.city.state.slug,
          state: rel.city.state.title,
          is_state: rel.city.is_state
        }))
      : null;

  const { register, errors, handleSubmit, setValue, getValues } = useForm(
    !bluesheet
      ? {
          defaultValues: {
            time_looking: null,
            work_type_option_id: null,
            interview_dates: [null, null, null]
          }
        }
      : {
          defaultValues: {
            ...bluesheet,
            relocations: prevRelocations
          }
        }
  );

  const [comboValues, setComboValues] = useState<Map>(
    bluesheet
      ? {
          time_start_type_id: bluesheet.timeToStart,
          candidate_type_id: bluesheet.candidateType,
          work_type_option_id: bluesheet.workTypeOption
        }
      : { time_start_type_id: null, candidate_type_id: null, work_type_option_id: null }
  );

  const [relocations, setRelocations] = useState(prevRelocations || []);
  const [canRelocate, setCanRelocate] = useState(
    prevRelocations ? nestTernary(prevRelocations.length, 'yes', 'no') : ''
  );

  const userCanEdit = canUserEditEntity(currentUser, profile);

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isReadOnly,
    isFormDisabled: isReadOnly || (!userCanEdit && bluesheet)
  });

  useEffect(() => {
    register(
      { name: 'relocations' },
      {
        validate(values) {
          return (
            canRelocate !== 'yes' ||
            (canRelocate === 'yes' && values && values.length) ||
            'Select at least one city to relocate'
          );
        }
      }
    );
  }, [register, canRelocate, getValues]);

  useEffect(() => {
    register({ name: 'relocation' }, { required: 'Indicate if relocation is possible' });
    register({ name: 'time_looking' }, { required: 'This field is required' });
    register({ name: 'work_type_option_id' }, { required: 'This field is required' });
    register({ name: 'time_start_type_id' }, { required: 'This field is required' });
    register({ name: 'good_salary' }, { required: 'This field is required' });
    register({ name: 'minimum_salary' }, { required: 'This field is required' });
    register({ name: 'no_brainer_salary' }, { required: 'This field is required' });
    register({ name: 'candidate_type_id' }, { required: 'This field is required' });

    datesIndexer.forEach((_, index) => {
      register({ name: `interview_dates[${index}]` });
    });
  }, [register, getValues]);

  const handleSalaryChange = (name?: string, value: any) => {
    setValue(name, value, true);
    setUiState({ ...uiState }); // TODO to force a render as form hook doest not fire a render
  };

  const handleRelocationChange = event => {
    const { value } = event.target;
    setCanRelocate(value);
    setValue('relocation', value, true);
  };

  const handleComboChange = (name?: string, value: any) => {
    setComboValues((prevState: Map): Map => ({ ...prevState, [name]: value }));
    setValue(name, value ? value.id : value, true);
  };

  const handleDateChange = (name, date) => {
    setValue(name, date, true);
    setUiState({ ...uiState });
  };

  const handleRelocationsChange = (e, data) => {
    setRelocations(data);
    setValue('relocations', data, true);
  };

  const handleEditClick = () => {
    setUiState(prevState => ({
      ...prevState,
      isReadOnly: false,
      isFormDisabled: !userCanEdit && bluesheet
    }));
  };

  const relocationsGetOptionLabel = option =>
    option.is_state ? `${option.title}` : `${option.title}, ${option.slug}`;

  const relocationsGetOptionSelected = (option, value) => option.id === value.id;
  const relocationsGroupBy = option => option.state;

  async function onSubmit(formData) {
    const bluesheetData = {
      ...formData,
      relocations:
        formData.relocations && canRelocate === 'yes'
          ? formData.relocations.map(reloc => reloc.id)
          : null
    };

    if (bluesheet) {
      await updateExistingBluesheet(bluesheetData);
    } else {
      onBluesheetCompleted && onBluesheetCompleted(bluesheetData);
    }
  }

  const updateExistingBluesheet = async sheet => {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));

      const response = await API.put(
        `${Endpoints.Candidates}/${candidateId}/blueSheets/${sheet.id}`,
        sheet
      );
      if (response.data) {
        setUiState(prevState => ({
          ...prevState,
          isSuccess: false,
          isSaving: false
        }));

        showAlert({
          severity: 'success',
          title: 'Awesome',
          body: 'The write up was updated successfully'
        });

        onBluesheetCompleted && onBluesheetCompleted(response.data);
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
      isSuccess: false,
      isSaving: false
    }));
  };

  const timeLooking = getValues('time_looking');
  const lookingFor = timeLooking ? moment(timeLooking).fromNow(true) : '---';

  return (
    <DrawerFormLayout
      onSubmit={handleSubmit(onSubmit)}
      onClose={onBluesheetClosed}
      uiState={uiState}
      title="WRITE UP"
      variant="blue"
      additionalHeaderButtons={
        bluesheet &&
        bluesheet.id &&
        uiState.isReadOnly &&
        userCanEdit && (
          <CustomIconButton style={styles.headerIcon} tooltipText="Edit" onClick={handleEditClick}>
            <EditIcon fill={colors.black} width={20} height={20} />
          </CustomIconButton>
        )
      }
    >
      <Typography variant="h2">
        <Box style={globalStyles.sheetQuestionItem}>
          <Box> 1.- What is the reason for leaving? *</Box>
          <Box style={globalStyles.sheetInputMargin}>
            <TextBox
              name="reason_leaving"
              label="Reason for leaving"
              error={!!errors.reason_leaving}
              errorText={errors.reason_leaving && errors.reason_leaving.message}
              inputRef={register({ required: 'Please explain the reason' })}
              disabled={uiState.isFormDisabled}
              multiline
            />
          </Box>
        </Box>

        <Box style={globalStyles.sheetQuestionItem}>
          <Box>2.- Are you open to relocate? *</Box>
          <FormControl component="fieldset" error={!!errors.relocation}>
            <RadioGroup
              aria-label="position"
              name="relocation"
              value={canRelocate}
              onChange={handleRelocationChange}
              row
            >
              <FormControlLabel
                value="yes"
                control={<Radio color="primary" />}
                label="Yes"
                labelPlacement="end"
                disabled={uiState.isFormDisabled}
              />
              <FormControlLabel
                value="no"
                control={<Radio color="primary" />}
                label="No"
                labelPlacement="end"
                disabled={uiState.isFormDisabled}
              />
            </RadioGroup>
            <FormHelperText>{errors.relocation && errors.relocation.message}</FormHelperText>
          </FormControl>
          {canRelocate === 'yes' && (
            <Box>
              <AutocompleteSelect
                width="100%"
                multiple
                typeahead
                typeaheadLimit={125}
                name="relocations"
                selectedValue={relocations}
                placeholder="Relocation Destinations"
                error={!!errors.relocations}
                errorText={errors.relocations && errors.relocations.message}
                url={Endpoints.CitiesSearch}
                disabled={uiState.isFormDisabled}
                onSelect={handleRelocationsChange}
                getOptionLabel={relocationsGetOptionLabel}
                getOptionSelected={relocationsGetOptionSelected}
                groupBy={relocationsGroupBy}
              />
            </Box>
          )}
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>3.- How would you prefer to work?*</Box>
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
          <Box>4.- Top 3 Professional Achievements *</Box>
          <Box style={globalStyles.sheetInputMargin}>
            <TextBox
              name="achievement_one"
              label="Achievement 1*"
              error={!!errors.achievement_one}
              errorText={errors.achievement_one && errors.achievement_one.message}
              inputRef={register({ required: 'This field is required', ...ACHIEVEMENT_VALIDATION })}
              disabled={uiState.isFormDisabled}
            />
            <TextBox
              name="achievement_two"
              label="Achievement 2 *"
              error={!!errors.achievement_two}
              errorText={errors.achievement_two && errors.achievement_two.message}
              inputRef={register({ required: 'This field is required', ...ACHIEVEMENT_VALIDATION })}
              disabled={uiState.isFormDisabled}
            />
            <TextBox
              name="achievement_three"
              label="Achievement 3 *"
              error={!!errors.achievement_three}
              errorText={errors.achievement_three && errors.achievement_three.message}
              inputRef={register({ required: 'This field is required', ...ACHIEVEMENT_VALIDATION })}
              disabled={uiState.isFormDisabled}
            />
          </Box>
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>5.- Experience & Skills *</Box>
          <Box style={globalStyles.sheetInputMargin}>
            <TextBox
              name="experience"
              label="Experience and skills *"
              error={!!errors.experience}
              errorText={errors.experience && errors.experience.message}
              inputRef={register({ required: 'This field is required' })}
              disabled={uiState.isFormDisabled}
              multiline
            />
          </Box>
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>6.- How long have you been looking? *</Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <CustomDatePicker
                name="time_looking"
                label="Looking since *"
                disableFuture
                value={timeLooking}
                onDateChange={handleDateChange}
                error={!!errors.time_looking}
                helperText={errors.time_looking && errors.time_looking.message}
                disabled={uiState.isFormDisabled}
              />
            </Grid>
            <Grid item xs={4}>
              <Box>
                Looking for <br />
                <b>{lookingFor}</b>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>7.- Ideal time to start new position? *</Box>
          <Box style={globalStyles.sheetInputMargin}>
            <AutocompleteSelect
              width="100%"
              name="time_start_type_id"
              selectedValue={comboValues.time_start_type_id}
              placeholder="Ideal time *"
              error={!!errors.time_start_type_id}
              errorText={errors.time_start_type_id && errors.time_start_type_id.message}
              url={Endpoints.StartTimes}
              onSelect={handleComboChange}
              disabled={uiState.isFormDisabled}
            />
          </Box>
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>8.- Desired compensation range *</Box>
          <Box style={globalStyles.sheetInputMargin}>
            <TextBox
              name="good_salary"
              label="High salary *"
              error={!!errors.good_salary}
              errorText={errors.good_salary && errors.good_salary.message}
              value={getValues('good_salary') || ''}
              onChange={handleSalaryChange}
              inputType="currency"
              disabled={uiState.isFormDisabled}
            />
            <TextBox
              name="minimum_salary"
              label="Low salary *"
              error={!!errors.minimum_salary}
              errorText={errors.minimum_salary && errors.minimum_salary.message}
              value={getValues('minimum_salary') || ''}
              onChange={handleSalaryChange}
              inputType="currency"
              disabled={uiState.isFormDisabled}
            />
            <TextBox
              name="no_brainer_salary"
              label="Ideal salary *"
              error={!!errors.no_brainer_salary}
              errorText={errors.no_brainer_salary && errors.no_brainer_salary.message}
              value={getValues('no_brainer_salary') || ''}
              onChange={handleSalaryChange}
              inputType="currency"
              disabled={uiState.isFormDisabled}
            />
          </Box>
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>9.- Available Interview Dates</Box>
          <Box my={1}>
            {datesIndexer.map(index => (
              <CustomDatePicker
                key={`interview_dates[${index}]`}
                name={`interview_dates[${index}]`}
                label="Date & Time"
                value={getValues(`interview_dates[${index}]`) || null}
                onDateChange={handleDateChange}
                withTime
                disablePast={!bluesheet?.id}
                disabled={uiState.isFormDisabled}
              />
            ))}
            <input
              ref={register()}
              type="hidden"
              name="id"
              value={(bluesheet && bluesheet.id) || ''}
            />
          </Box>
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>10.- Candidate Status *</Box>
          <Box style={globalStyles.sheetInputMargin}>
            <AutocompleteSelect
              width="100%"
              name="candidate_type_id"
              selectedValue={comboValues.candidate_type_id}
              placeholder="Type *"
              error={!!errors.candidate_type_id}
              errorText={errors.candidate_type_id && errors.candidate_type_id.message}
              url={Endpoints.CandidateTypes}
              onSelect={handleComboChange}
              disabled={uiState.isFormDisabled}
              renderOption={statusRenderOption}
              startAdornment={
                comboValues.candidate_type_id &&
                statusStartAdornment(comboValues.candidate_type_id.style_class_name)
              }
            />
          </Box>
        </Box>
        <Box style={globalStyles.sheetQuestionItem}>
          <Box>Notes *</Box>
          <Box style={globalStyles.sheetInputMargin}>
            <TextBox
              name="notes"
              label="Notes"
              inputRef={register({ required: 'This field is required' })}
              error={!!errors.notes}
              errorText={errors.notes && errors.notes.message}
              disabled={uiState.isFormDisabled}
              width="100%"
              multiline
            />
          </Box>
        </Box>
      </Typography>
    </DrawerFormLayout>
  );
};

CandidateSheet.defaultProps = {
  bluesheet: null,
  profile: null,
  candidateId: ''
};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert))
  };
};

const CandidateSheetConnected = connect(null, mapDispatchToProps)(CandidateSheet);

export default CandidateSheetConnected;
