// @flow
import React, { useState, Fragment, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useForm, FormContext } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';

import Box from '@material-ui/core/Box';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';

import API from 'services/API';
import { userHasRole } from 'services/Authorization';
import { Roles } from 'UI/constants/roles';

import Drawer from '@material-ui/core/Drawer';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import NewItemsSubtitles from 'UI/components/molecules/NewItemsSubtitles';
import FileUploader from 'UI/components/molecules/FileUploader';
import ActionButton from 'UI/components/atoms/ActionButton';
import { CancelSaveButton, layout } from 'UI/constants/dimensions';

import { nestTernary, getErrorMessage } from 'UI/utils';
import { showAlert } from 'actions/app';

import InputContainer from 'UI/components/atoms/InputContainer';
import { EntityRoutes } from 'routes/constants';
import { globalStyles } from 'GlobalStyles';
import { colors, PaperWriteIcon, EditIcon } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { Endpoints } from 'UI/constants/endpoints';

import { waitingTimeBeforeRedirect, PageTitles, drawerAnchor } from 'UI/constants/defaults';
import JobOrderForm from 'UI/components/organisms/JobOrderForm';
import JobOrderSheet from 'UI/components/organisms/JobOrderSheet';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';

import type { Map } from 'types';
import Tooltip from '@material-ui/core/Tooltip';

type NewJobOrderProps = {
  location: any,
  onShowAlert: any => void
};

const chainedSelects = {
  company_id: ['hiring_authority_id']
};

const NewJobOrder = (props: NewJobOrderProps) => {
  const { onShowAlert, location } = props;
  const history = useHistory();

  useEffect(() => {
    document.title = PageTitles.JobOrderCreate;
  });

  const [attachments, setAttachments] = useState([]);
  const [isWhitesheetOpen, setisWhitesheetOpen] = useState(false);
  const { companyId } = queryString.parse(location.search);
  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isHiringAuthorityEnabled: !!companyId
  });

  const [whitesheet, setWhitesheet] = useState(null);
  const [comboValues, setComboValues] = useState<Map>({});
  const [hasHiringAuthority, setHasHiringAuthority] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const isUserCoach = userHasRole(Roles.Coach);
  const currentCompanyId = comboValues?.company_id?.id || companyId;

  const form = useForm();

  const { register, unregister, setValue, handleSubmit } = form;

  useEffect(() => {
    if (hasHiringAuthority) {
      register({ name: 'hiring_authority_id' }, { required: 'Hiring Authority is required' });
    } else {
      register({ name: 'hiring_authority_id' });
    }
  }, [register, hasHiringAuthority]);

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

    setisWhitesheetOpen(open);
  };

  const handleWhitesheetCompleted = newWhitesheet => {
    setisWhitesheetOpen(false);
    setValue('whitesheet_completed', true, true);
    setWhitesheet(newWhitesheet);
  };

  const handleWhitesheetClosed = () => {
    isWhitesheetOpen && setisWhitesheetOpen(false);
  };

  const handleAttachmentsChanged = attachmnts => {
    setAttachments(attachmnts);
  };

  const handleCancelClick = () => {
    history.goBack();
  };

  const handleComboChange = (name?: string, value: any) => {
    setComboValues((prevState: Map): Map => ({ ...prevState, [name]: value }));
    setValue(name, value ? value.id : value, true);

    name === 'company_id' &&
      setUiState(prevState => ({ ...prevState, isHiringAuthorityEnabled: true }));

    if (name && chainedSelects[name]) {
      chainedSelects[name].forEach(chainedSelect => {
        setComboValues((prevState: Map): Map => ({ ...prevState, [chainedSelect]: null }));
        setValue(chainedSelect, null);
      });
    }
  };

  const handleHiringAuthorityLoaded = useCallback((options?: any[]) => {
    setHasHiringAuthority(options && options.length);
  }, []);

  const onSubmit = async formData => {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));
      const candidateData = {
        ...formData,
        whiteSheet: whitesheet,
        files: attachments.map(att => att.id)
      };
      const response = await API.post('job-orders', candidateData);
      if (response.data && response.status === 201) {
        setUiState(prevState => ({
          ...prevState,
          isSuccess: true
        }));
        onShowAlert({
          severity: 'success',
          title: 'Job Order',
          body: 'Awesome! The job order was created succesfully'
        });
        setTimeout(() => {
          companyId
            ? history.push(EntityRoutes.CompanyProfile.replace(':id', companyId))
            : history.push(EntityRoutes.JobOrderProfile.replace(':id', response.data.data.id));
        }, waitingTimeBeforeRedirect);
      }
    } catch (err) {
      setUiState(prevState => ({
        ...prevState,
        isSuccess: false
      }));
      onShowAlert({
        severity: 'error',
        title: 'Job Order',
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
    setValue(name, value ? value.id : value, true);
  };

  return (
    <ContentPageLayout>
      <Fragment key={drawerAnchor}>
        <Box maxWidth={layout.maxWidth} width="100%" margin="auto">
          <FormContext {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box px={4}>
                <Box py={4}>
                  <TitleLabel backNavigation text="New Job Order" />
                </Box>
                <Box mb={4} style={globalStyles.containerBoxShadow}>
                  <NewItemsSubtitles
                    subTitle="CONTACT DATA"
                    description="Fields marked with * are required to add this candidate"
                  />
                  <Box
                    bgcolor={colors.white}
                    display="flex"
                    alignItems="center"
                    minHeight={223}
                    style={globalStyles.newItemBoxContent}
                  >
                    <JobOrderForm companyId={companyId} onCompanySelect={handleComboChange} />
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
                    description="A hiring authority related to this job order is required. Choose one"
                  />
                  <Box style={globalStyles.newItemBoxContent}>
                    <Tooltip
                      placement="top"
                      title={
                        uiState.isHiringAuthorityEnabled ? '' : 'Please select a Company first'
                      }
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        width="100%"
                        maxWidth={470}
                        height="100%"
                      >
                        <AutocompleteSelect
                          disabled={!uiState.isHiringAuthorityEnabled}
                          name="hiring_authority_id"
                          selectedValue={comboValues.hiring_authority_id}
                          placeholder={`Hiring Authorities ${hasHiringAuthority ? '*' : ''}`}
                          error={!!form.errors.hiring_authority_id}
                          errorText={
                            form.errors.hiring_authority_id &&
                            form.errors.hiring_authority_id.message
                          }
                          url={
                            currentCompanyId &&
                            `${Endpoints.Companies}/${currentCompanyId}/${Endpoints.HiringAuthorities}`
                          }
                          onSelect={handleComboChange}
                          getOptionLabel={option => option.full_name}
                          onOptionsLoaded={handleHiringAuthorityLoaded}
                        />
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>
                <Box
                  bgcolor={colors.white}
                  my={4}
                  minHeight={178}
                  style={globalStyles.containerBoxShadow}
                >
                  <NewItemsSubtitles
                    subTitle="ATTACHMENTS"
                    description="You can upload files later but we suggest you upload the job description file at least"
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

                <Box my={4} style={globalStyles.containerBoxShadow}>
                  <NewItemsSubtitles
                    subTitle="WRITE UP"
                    description="It is required to fill the write up and choose the job order type in order to add it*"
                  />
                  <Box style={globalStyles.newItemBoxContent}>
                    <Box>
                      <InputContainer>
                        <ActionButton
                          onClick={toggleDrawer(drawerAnchor, true)}
                          width={CancelSaveButton}
                          text={whitesheet ? 'EDIT' : 'Fill Out'}
                        >
                          {whitesheet ? (
                            <EditIcon fill={colors.white} />
                          ) : (
                            <PaperWriteIcon size={20} fill={colors.white} />
                          )}
                        </ActionButton>
                      </InputContainer>
                      <input
                        ref={form.register({
                          required: 'You have to complete the whitesheet before continue'
                        })}
                        type="hidden"
                        name="whitesheet_completed"
                      />
                      {!!form.errors.whitesheet_completed && (
                        <Box>
                          <FormControl
                            component="fieldset"
                            error={!!form.errors.whitesheet_completed}
                          >
                            <FormHelperText>
                              {form.errors.whitesheet_completed &&
                                form.errors.whitesheet_completed.message}
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
                  </>
                )}

                <Box my={4} display="flex" alignItems="center" justifyContent="flex-end">
                  <Box mr={3}>
                    <ActionButton
                      variant="outlined"
                      width={CancelSaveButton}
                      text="Cancel"
                      onClick={handleCancelClick}
                    />
                  </Box>
                  <ActionButton
                    text={
                      uiState.isSaving ? 'Saving' : nestTernary(uiState.isSuccess, 'Saved', 'Save')
                    }
                    disabled={uiState.isSaving || (!uiState.isSaving && uiState.isSuccess)}
                    type="submit"
                    width={CancelSaveButton}
                  >
                    {uiState.isSaving ? <CircularProgress color="white" size={20} /> : null}
                  </ActionButton>
                </Box>
              </Box>
            </form>
          </FormContext>
        </Box>
        <Drawer
          anchor={drawerAnchor}
          open={isWhitesheetOpen}
          onClose={toggleDrawer(drawerAnchor, false)}
          ModalProps={{
            keepMounted: true
          }}
        >
          <div role="presentation">
            <JobOrderSheet
              onWhitesheetCompleted={handleWhitesheetCompleted}
              onWhitesheetClosed={handleWhitesheetClosed}
            />
          </div>
        </Drawer>
      </Fragment>
    </ContentPageLayout>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(NewJobOrder);
