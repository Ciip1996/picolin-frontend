// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm, FormContext } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import API from 'services/API';
import { userHasRole } from 'services/Authorization';
import { Roles } from 'UI/constants/roles';
import { Endpoints } from 'UI/constants/endpoints';

import CandidateSheet from 'UI/components/organisms/CandidateSheet';
import CandidateForm from 'UI/components/organisms/CandidateForm';
import Drawer from '@material-ui/core/Drawer';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import NewItemsSubtitles from 'UI/components/molecules/NewItemsSubtitles';
import FileUploader from 'UI/components/molecules/FileUploader';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import ActionButton from 'UI/components/atoms/ActionButton';
import SaveButton from 'UI/components/atoms/SaveButton';
import { CancelSaveButton, layout } from 'UI/constants/dimensions';

import { getErrorMessage, getFeatureFlags } from 'UI/utils';
import { showAlert } from 'actions/app';
import { FeatureFlags } from 'UI/constants/featureFlags';

import InputContainer from 'UI/components/atoms/InputContainer';
import { EntityRoutes } from 'routes/constants';
import { globalStyles } from 'GlobalStyles';
import { colors, PaperWriteIcon, EditIcon } from 'UI/res';
// import { EntityType } from 'UI/constants/entityTypes';

import { waitingTimeBeforeRedirect, PageTitles, drawerAnchor } from 'UI/constants/defaults';
import Text from 'UI/components/atoms/Text';
import { CircularProgress } from '@material-ui/core';
import { styles } from './styles';

type NewCandidateProps = {
  onShowAlert: any => void
};

const featureFlags = getFeatureFlags();

const NewCandidate = (props: NewCandidateProps) => {
  const { onShowAlert } = props;
  const history = useHistory();

  useEffect(() => {
    document.title = PageTitles.CandidateCreate;
  });

  const [attachments, setAttachments] = useState([]);
  const [isBluesheetOpen, setIsBluesheetOpen] = useState(false);
  const [isFromDirectory, setIsFromDirectory] = useState(false);

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isLoading: false
  });
  const [bluesheet, setBluesheet] = useState(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [selectedName, setSelectedName] = useState({ id: '' });
  const [nameComboValues, setNameComboValues] = useState(null);

  const isUserCoach = userHasRole(Roles.Coach);

  const form = useForm();
  const { register, reset, unregister, handleSubmit } = form;

  useEffect(() => {
    if (isUserCoach) {
      register({ name: 'recruiter_id' });
    }
    return () => unregister('recruiter_id');
  }, [register, unregister, isUserCoach]);

  const toggleDrawer = (anchor, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setIsBluesheetOpen(open);
  };

  const handleBluesheetCompleted = bs => {
    setIsBluesheetOpen(false);
    form.setValue('bluesheet_completed', true, true);
    setBluesheet(bs);
  };

  const handleBluesheetClosed = () => {
    isBluesheetOpen && setIsBluesheetOpen(false);
  };

  const handleAttachmentsChanged = attachmnts => {
    setAttachments(attachmnts);
  };

  const handleCancelClick = () => {
    history.goBack();
  };

  const onSubmit = async formData => {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));

      const candidateData = {
        ...formData,
        blueSheet: bluesheet,
        files: attachments.map(att => att.id)
      };

      const urlString = isFromDirectory
        ? `${Endpoints.Candidates}/fromName/:id`.replace(':id', selectedName.id)
        : `${Endpoints.Candidates}`;

      const response = await API.post(urlString, candidateData);
      if (response.data && response.status === 201) {
        setUiState(prevState => ({
          ...prevState,
          isSuccess: true
        }));

        onShowAlert({
          severity: 'success',
          title: 'Candidates',
          body: 'Awesome! The candidate was created succesfully'
        });

        setTimeout(() => {
          history.push(EntityRoutes.CandidateProfile.replace(':id', response.data.data.id));
        }, waitingTimeBeforeRedirect);
      }
    } catch (err) {
      setUiState(prevState => ({
        ...prevState,
        isSuccess: false
      }));
      onShowAlert({
        severity: 'error',
        title: 'Candidates',
        autoHideDuration: 5000,
        body: getErrorMessage(err)
      });
    }

    setUiState(prevState => ({
      ...prevState,
      isSaving: false
    }));
  };

  const handleRecruiterSelect = (name?: string, value: any) => {
    setSelectedRecruiter(value);
    form.setValue(name, value ? value.id : value, true);
  };

  const toggleDirectoryOption = () => {
    resetForm();
    setIsFromDirectory(!isFromDirectory);
  };

  const preloadForm = (nameInfo: any) => {
    const {
      id,
      email,
      title,
      link_profile,
      current_company,
      sourceType = {},
      personalInformation: {
        first_name,
        last_name,
        contact: { phone, ext, mobile, personal_email } = {},
        address: { zip, city = {} } = {}
      } = {},
      specialty = {},
      subspecialty,
      position
    } = nameInfo || {};

    const { state = {}, state: { id: state_id = null } = {} } = city || {};

    setNameComboValues({
      specialty_id: specialty,
      subspecialty_id: subspecialty,
      position_id: position,
      state_id: state,
      city_id: city,
      source_type_id: sourceType,
      zip: zip ? { id: zip, title: `${zip}` } : {}
    });

    reset({
      id,
      first_name,
      last_name,
      position_id: position && position.id,
      subspecialty_id: subspecialty?.id,
      specialty_id: specialty && specialty.id,
      phone,
      ext,
      mobile,
      personal_email,
      email,
      title,
      link_profile,
      current_company,
      city_id: city?.id,
      state_id,
      source_type_id: sourceType ? sourceType.id : null,
      zip
    });
    setUiState(prevState => ({ ...prevState, isLoading: false }));
  };

  const handleNameSelect = async (name?: string, value: any) => {
    setUiState(prevState => ({ ...prevState, isLoading: true }));

    if (!value) {
      resetForm();
    }
    const getName = async () => {
      try {
        const response = await API.get(`${Endpoints.Names}/${value?.id}`);
        response.data && preloadForm(response.data);
      } catch (error) {
        onShowAlert({
          severity: 'error',
          title: 'Error',
          body: getErrorMessage(error)
        });
      }
    };
    value && getName();
    setSelectedName(value);
    form.setValue('name_completed', true, true);
  };

  const resetForm = () => {
    reset({});
    setNameComboValues(null);
    setSelectedName({ id: '' });
    setUiState(prevState => ({ ...prevState, isLoading: false }));
  };

  return (
    <ContentPageLayout>
      <React.Fragment key={drawerAnchor}>
        <Box maxWidth={layout.maxWidth} width="100%" margin="auto">
          <FormContext {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid item xs={12}>
                <Box px={4}>
                  <Box py={4}>
                    <TitleLabel backNavigation text="New Candidate" />
                  </Box>
                  <Box mb={4} style={globalStyles.containerBoxShadow}>
                    <NewItemsSubtitles
                      subTitle="Personal Data"
                      description="Fields marked with * are required to add this candidate"
                    />
                    <Box style={globalStyles.newItemBoxContent}>
                      {featureFlags.includes(FeatureFlags.Names) ? (
                        <Box>
                          <Box display="flex" alignItems="center" fontSize={16} marginBottom={1}>
                            {isFromDirectory ? (
                              <>
                                <Text
                                  text="Choose a candidate from  directory or "
                                  variant="subtitle1"
                                />
                                <button
                                  type="button"
                                  style={styles.button}
                                  onClick={toggleDirectoryOption}
                                >
                                  <Text text="Create a new one " variant="subtitle1" />
                                </button>
                              </>
                            ) : (
                              <>
                                <Text
                                  text="You are creating a new candidate but you can  "
                                  variant="subtitle1"
                                />
                                <button
                                  type="button"
                                  style={styles.button}
                                  onClick={toggleDirectoryOption}
                                >
                                  <Text
                                    text="select and existing one from directory"
                                    variant="subtitle1"
                                  />
                                </button>
                                <Text text=" instead" variant="subtitle1" />
                              </>
                            )}
                          </Box>
                          {isFromDirectory ? (
                            <>
                              <>
                                <Box maxWidth={348}>
                                  <AutocompleteSelect
                                    name="names"
                                    selectedValue={selectedName}
                                    placeholder="Possible Candidates from Directory"
                                    displayKey="title"
                                    typeahead
                                    typeaheadLimit={20}
                                    typeaheadParams={{ entityType: 'name' }}
                                    url={`${Endpoints.Search}`}
                                    onSelect={handleNameSelect}
                                  />
                                  {uiState.isLoading && <CircularProgress size={24} />}
                                </Box>
                              </>
                              {nameComboValues && (
                                <>
                                  <hr style={styles.hr} />
                                  <CandidateForm initialValues={nameComboValues} />
                                </>
                              )}
                            </>
                          ) : (
                            <CandidateForm />
                          )}
                          <input
                            ref={
                              isFromDirectory
                                ? register({
                                    required: 'You have to select a name before continue'
                                  })
                                : register
                            }
                            type="hidden"
                            name="name_completed"
                          />
                          {!!form.errors.name_completed && (
                            <Box>
                              <FormControl
                                component="fieldset"
                                error={!!form.errors.name_completed}
                              >
                                <FormHelperText>
                                  {form.errors.name_completed && form.errors.name_completed.message}
                                </FormHelperText>
                              </FormControl>
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <CandidateForm />
                      )}
                    </Box>
                  </Box>
                  <Box mb={4} style={globalStyles.containerBoxShadow}>
                    <NewItemsSubtitles
                      subTitle="ATTACHMENTS"
                      description="You can upload files later but we suggest you upload the resume file at least"
                    />
                    <Box style={globalStyles.newItemBoxContent}>
                      <FileUploader
                        endpoint="files"
                        fileNameField="original_name"
                        maxNumberOfFiles={4}
                        onAttachmentsChanged={handleAttachmentsChanged}
                      />
                    </Box>
                  </Box>
                  <Box mb={4} style={globalStyles.containerBoxShadow}>
                    <Box>
                      <NewItemsSubtitles
                        subTitle="WRITE UP"
                        description="It is required to fill the write up and choose the candidate type in order to add it*"
                      />
                    </Box>
                    <Box style={globalStyles.newItemBoxContent}>
                      <Box>
                        <InputContainer>
                          <ActionButton
                            onClick={toggleDrawer(drawerAnchor, true)}
                            text={bluesheet ? 'EDIT' : 'FILL UP'}
                            style={{ width: '100%' }}
                          >
                            {bluesheet ? (
                              <EditIcon fill={colors.white} />
                            ) : (
                              <PaperWriteIcon size={20} fill={colors.white} />
                            )}
                          </ActionButton>
                        </InputContainer>
                        <input
                          ref={register({
                            required: 'You have to complete the write up before continue'
                          })}
                          type="hidden"
                          name="bluesheet_completed"
                        />
                        {!!form.errors.bluesheet_completed && (
                          <Box>
                            <FormControl
                              component="fieldset"
                              error={!!form.errors.bluesheet_completed}
                            >
                              <FormHelperText>
                                {form.errors.bluesheet_completed &&
                                  form.errors.bluesheet_completed.message}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {isUserCoach && (
                    <>
                      <Box>
                        <NewItemsSubtitles
                          subTitle="Assign to a recruiter"
                          description="Choose a recruiter to assign this item to."
                        />
                      </Box>
                      <Box style={globalStyles.newItemBoxContent}>
                        <Box>
                          <InputContainer>
                            <AutocompleteSelect
                              name="recruiter_id"
                              selectedValue={selectedRecruiter}
                              placeholder="Recruiters in your team"
                              displayKey="full_name"
                              url={`${Endpoints.Recruiters}/myTeam`}
                              onSelect={handleRecruiterSelect}
                            />
                          </InputContainer>
                        </Box>
                      </Box>
                    </>
                  )}

                  <Box my={4} display="flex" justifyContent="flex-end">
                    <Box mr={2.3}>
                      <ActionButton
                        variant="outlined"
                        style={{ width: CancelSaveButton }}
                        text="Cancel"
                        onClick={handleCancelClick}
                      />
                    </Box>
                    <SaveButton isSaving={uiState.isSaving} isSuccess={uiState.isSuccess} />
                  </Box>
                </Box>
              </Grid>
            </form>
          </FormContext>
        </Box>
        <Drawer
          anchor={drawerAnchor}
          open={isBluesheetOpen}
          onClose={toggleDrawer(drawerAnchor, false)}
          ModalProps={{
            keepMounted: true
          }}
        >
          <div role="presentation">
            <CandidateSheet
              onBluesheetCompleted={handleBluesheetCompleted}
              onBluesheetClosed={handleBluesheetClosed}
              isReadOnly={false}
            />
          </div>
        </Drawer>
      </React.Fragment>
    </ContentPageLayout>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(NewCandidate);
