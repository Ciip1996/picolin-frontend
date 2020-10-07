// @flow
import React, { useState, useEffect } from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';

import TitleLabel from 'UI/components/atoms/TitleLabel';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import NewItemsSubtitles from 'UI/components/molecules/NewItemsSubtitles';
import ActionButton from 'UI/components/atoms/ActionButton';

import { colors, PlusIcon, WriteUpIcon, SuccessIcon } from 'UI/res';
import { CancelSaveButton, layout } from 'UI/constants/dimensions';
import CompanyForm from 'UI/components/organisms/CompanyForm';
import HiringAuthorityDrawer from 'UI/components/organisms/HiringAuthorityDrawer';

import API from 'services/API';
import { userHasRole } from 'services/Authorization';
import { Roles } from 'UI/constants/roles';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorMessage, getFeatureFlags } from 'UI/utils';
import { showAlert } from 'actions/app';
import { EntityRoutes } from 'routes/constants';
import HiringAuthorityPreview from 'UI/components/organisms/HiringAuthorityPreview';
import FileUploader from 'UI/components/molecules/FileUploader';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { globalStyles } from 'GlobalStyles';
import InputContainer from 'UI/components/atoms/InputContainer';
import { waitingTimeBeforeRedirect, PageTitles, drawerAnchor } from 'UI/constants/defaults';
import { EntityType } from 'UI/constants/entityTypes';
import { FeatureFlags } from 'UI/constants/featureFlags';
import FeeAgreementDrawer from 'UI/components/organisms/FeeAgreementDrawer';

const featureFlags = getFeatureFlags();
type NewCompanyProps = {
  onShowAlert: any => void
};

const NewCompany = (props: NewCompanyProps) => {
  useEffect(() => {
    document.title = PageTitles.CompanyCreate;
  });

  const { onShowAlert } = props;
  const history = useHistory();

  const form = useForm({
    defaultValues: {
      feeagreement_completed: false,
      hiring_authority_completed: false
    }
  });

  const { register, unregister, getValues, errors, setValue, handleSubmit } = form;

  const [attachments, setAttachments] = useState([]);
  const [hiringAuthorities, setHiringAuthorities] = useState([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [feeAgreement, setFeeAgreement] = useState(undefined);

  const [uiState, setUiState] = useState({
    isLoading: false,
    isHAOpen: false,
    isHAEditingOpen: false,
    selectedHA: null,
    isSaving: false,
    isSuccess: false,
    isFeeAgreementOpen: false
  });

  const isUserCoach = userHasRole(Roles.Coach);

  useEffect(() => {
    if (isUserCoach) {
      register({ name: 'recruiter_id' });
    }
  }, [register, isUserCoach]);

  // register({ name: 'recruiter_id' });

  useEffect(() => {
    if (hiringAuthorities.length === 0) {
      register(
        { name: 'hiring_authority_completed' },
        { required: 'You need to have at least one hiring authority' }
      );
    } else {
      unregister({ name: 'hiring_authority_completed' });
    }
    if (feeAgreement) {
      register({ name: 'feeagreement_completed' });
    } else {
      unregister({ name: 'feeagreement_completed' });
    }
    // setValue('feeagreement_completed', false, true);
    // setValue('hiring_authority_completed', false, true);
  }, [feeAgreement, hiringAuthorities.length, register, unregister]);

  const toggleDrawer = (drawer: string, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setUiState(prevState => ({ ...prevState, [drawer]: open }));
  };

  const handleNewHAClick = () => {
    const companyValues = getValues();

    setUiState(prevState => ({
      ...prevState,
      selectedHA: {
        specialty: companyValues?.specialty,
        specialty_id: companyValues?.specialty?.id,
        subspecialty: companyValues?.subspecialty,
        subspecialty_id: companyValues?.subspecialty?.id
      },
      isHAOpen: true,
      isHAEditingOpen: false
    }));
  };

  const handleHiringAuthorityOpenEdit = item => {
    setUiState(prevState => ({
      ...prevState,
      selectedHA: item,
      isHAOpen: true,
      isHAEditingOpen: true
    }));
  };

  const handleHiringAuthorityEdited = item => {
    setHiringAuthorities(prevState =>
      prevState.map(currentItem => (currentItem !== uiState.selectedHA ? currentItem : item))
    );
  };

  const handleHiringAuthorityDeleted = item => {
    setHiringAuthorities(prevState => prevState.filter(currentItem => currentItem !== item));
  };

  const handleHiringAuthorityCompleted = newHiringAuthority => {
    setUiState(prevState => ({
      ...prevState,
      selectedHA: null,
      isHAOpen: false,
      isHAEditingOpen: false
    }));

    setValue('hiring_authority_completed', true, true);

    uiState.isHAEditingOpen
      ? handleHiringAuthorityEdited({
          ...newHiringAuthority,
          full_name: `${newHiringAuthority.first_name} ${newHiringAuthority.last_name}`
        })
      : setHiringAuthorities([
          ...hiringAuthorities,
          {
            ...newHiringAuthority,
            full_name: `${newHiringAuthority.first_name} ${newHiringAuthority.last_name}`
          }
        ]);
  };

  const handleHiringAuthorityClosed = () => {
    setUiState(prevState => ({
      ...prevState,
      selectedHA: null,
      isHAOpen: false,
      isHAEditingOpen: false
    }));
  };

  const handleAttachmentsChanged = attachmnts => {
    setAttachments(attachmnts);
  };

  const handleCancelClick = () => {
    history.push(EntityRoutes.Companies);
  };

  const handleRecruiterSelect = (name?: string, value: any) => {
    setSelectedRecruiter(value);
    setValue(name, value ? value.id : value, true);
  };

  const handleFAClick = () => {
    if (hiringAuthorities.length > 0) {
      setUiState(prevState => ({ ...prevState, isFeeAgreementOpen: true }));
    } else {
      unregister('hiring_authority_completed');
      register(
        { name: 'hiring_authority_completed' },
        {
          required:
            'You need to have at least one hiring authority in order to create a fee agreement'
        }
      );
      setValue('hiring_authority_completed', false, true);
    }
  };

  const handleFAClose = () => {
    setUiState(prevState => ({ ...prevState, isFeeAgreementOpen: false }));
  };

  const handleFeeAgreementCompleted = newFeeAgreement => {
    // The button of Fee Agreement should change
    setUiState(prevState => ({
      ...prevState,
      isFeeAgreementOpen: false
    }));
    setValue('feeagreement_completed', true, true);
    setFeeAgreement(newFeeAgreement);
  };

  const onSubmit = async formData => {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));
      const companyData = {
        ...formData,
        hiringAuthorities,
        feeAgreement,
        hiring_authority_email: feeAgreement?.hiring_authority_email,
        fileId: attachments.length > 0 ? attachments[0].id : ''
      };

      const response = await API.post(Endpoints.Companies, companyData);
      if (response.data && response.status === 201) {
        setUiState(prevState => ({
          ...prevState,
          isSuccess: true
        }));

        onShowAlert({
          severity: 'success',
          title: 'Companies',
          body: 'Awesome! The company was created succesfully'
        });

        setTimeout(() => {
          history.push(EntityRoutes.CompanyProfile.replace(':id', response.data.data.id));
        }, waitingTimeBeforeRedirect);
      }
    } catch (err) {
      setUiState(prevState => ({
        ...prevState,
        isSuccess: false
      }));
      onShowAlert({
        severity: 'error',
        title: 'Companies',
        autoHideDuration: 5000,
        body: getErrorMessage(err)
      });
    }

    setUiState(prevState => ({
      ...prevState,
      isSaving: false
    }));
  };

  const saveButtonCopy = () => {
    if (uiState.isSaving) return 'Saving';
    if (uiState.isSuccess) return 'Saved';
    if (featureFlags.includes(FeatureFlags.FeeAgreement)) return 'Save & Send';
    return 'Save';
  };

  return (
    <ContentPageLayout>
      <Box maxWidth={layout.maxWidth} width="100%" margin="auto">
        <FormContext {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid item xs={12}>
              <Box px={4}>
                <Box py={4}>
                  <TitleLabel backNavigation text="New Company" />
                </Box>
                <Box
                  bgcolor={colors.white}
                  mb={4}
                  minHeight={248}
                  style={globalStyles.containerBoxShadow}
                >
                  <NewItemsSubtitles
                    subTitle="CONTACT DATA"
                    description="Fields marked with * are required to add this company"
                  />
                  <Box style={globalStyles.newItemBoxContent}>
                    <CompanyForm />
                  </Box>
                </Box>
                <Box
                  bgcolor={colors.white}
                  my={4}
                  minHeight={176}
                  style={globalStyles.containerBoxShadow}
                >
                  <NewItemsSubtitles
                    subTitle="HIRING AUTHORITIES"
                    description="At least one hiring authority is required to add this company"
                  />

                  {hiringAuthorities.length > 0 && (
                    <Box style={globalStyles.newItemBoxContent}>
                      <HiringAuthorityPreview
                        data={hiringAuthorities}
                        onHiringAuthorityEdit={handleHiringAuthorityOpenEdit}
                        onHiringAuthorityDelete={handleHiringAuthorityDeleted}
                      />
                    </Box>
                  )}
                  <Box style={globalStyles.newItemBoxContent}>
                    <Box>
                      <ActionButton
                        onClick={handleNewHAClick}
                        style={{ width: 250 }}
                        text="Add Hiring A."
                      >
                        <PlusIcon size={20} fill={colors.white} />
                      </ActionButton>
                      <input type="hidden" name="hiring_authority_completed" />
                      {!!errors.hiring_authority_completed && (
                        <Box ml={2} mt={1}>
                          <FormControl
                            component="fieldset"
                            error={!!errors.hiring_authority_completed}
                          >
                            <FormHelperText>
                              {errors.hiring_authority_completed &&
                                errors.hiring_authority_completed.message}
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box
                  bgcolor={colors.white}
                  my={4}
                  minHeight={176}
                  style={globalStyles.containerBoxShadow}
                >
                  {featureFlags.includes(FeatureFlags.FeeAgreement) ? (
                    <>
                      <NewItemsSubtitles
                        subTitle="FEE AGREEMENT"
                        description="Once you save this Company, the fee agreement will be sent to sign."
                      />
                      <Box padding={4}>
                        <Box>
                          <ActionButton
                            iconPosition="left"
                            onClick={handleFAClick}
                            text={feeAgreement ? 'Edit' : 'Create New'}
                          >
                            {feeAgreement ? <SuccessIcon fill={colors.white} /> : <WriteUpIcon />}
                          </ActionButton>
                          <input type="hidden" name="feeagreement_completed" />
                          {!!errors.feeagreement_completed && (
                            <Box ml={2} mt={1}>
                              <FormControl
                                component="fieldset"
                                error={!!errors.feeagreement_completed}
                              >
                                <FormHelperText>
                                  {errors.feeagreement_completed &&
                                    errors.feeagreement_completed.message}
                                </FormHelperText>
                              </FormControl>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <>
                      <NewItemsSubtitles
                        subTitle="FEE AGREEMENT"
                        description="You can upload the fee agreement later"
                      />
                      <Box style={globalStyles.newItemBoxContent}>
                        <FileUploader
                          endpoint="files"
                          fileNameField="original_name"
                          maxNumberOfFiles={1}
                          onAttachmentsChanged={handleAttachmentsChanged}
                        />
                      </Box>
                    </>
                  )}
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
                  <ActionButton
                    text={saveButtonCopy()}
                    disabled={uiState.isSaving || (!uiState.isSaving && uiState.isSuccess)}
                    type="submit"
                    style={{ width: CancelSaveButton }}
                  >
                    {uiState.isSaving ? <CircularProgress color="white" size={20} /> : null}
                  </ActionButton>
                </Box>
              </Box>
            </Grid>
          </form>
        </FormContext>
      </Box>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isHAOpen}
        onClose={toggleDrawer('isHAOpen', false)}
      >
        <div role="presentation">
          <HiringAuthorityDrawer
            type={EntityType.Company}
            isEditing={uiState.isHAEditingOpen}
            hiringAuthority={uiState.selectedHA}
            onHACompleted={handleHiringAuthorityCompleted}
            onHAClosed={handleHiringAuthorityClosed}
          />
        </div>
      </Drawer>
      {featureFlags.includes(FeatureFlags.FeeAgreement) && (
        <Drawer
          anchor={drawerAnchor}
          open={uiState.isFeeAgreementOpen}
          onClose={toggleDrawer('isFeeAgreementOpen', false)}
        >
          <div role="presentation">
            <FeeAgreementDrawer
              initialValues={feeAgreement}
              isEditing={uiState.isHAEditingOpen}
              onFAClosed={handleFAClose}
              onFACompleted={handleFeeAgreementCompleted}
              hiringAuthorities={hiringAuthorities}
            />
          </div>
        </Drawer>
      )}
    </ContentPageLayout>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(NewCompany);
