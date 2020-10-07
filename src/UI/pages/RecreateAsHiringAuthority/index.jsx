// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm, FormContext } from 'react-hook-form';

import { globalStyles } from 'GlobalStyles';
import { showAlert as showAlertAction } from 'actions/app';
import API from 'services/API';

import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import NewItemsSubtitles from 'UI/components/molecules/NewItemsSubtitles';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import HiringAuthorityForm from 'UI/components/organisms/HiringAuthorityForm';
import ActionButton from 'UI/components/atoms/ActionButton';
import SaveButton from 'UI/components/atoms/SaveButton';
import Text from 'UI/components/atoms/Text';

import CompanyForm from 'UI/components/organisms/CompanyForm';
import { useLocation, useHistory } from 'react-router-dom';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorMessage } from 'UI/utils';
import { CancelSaveButton, layout } from 'UI/constants/dimensions';

import { styles } from './styles';

type RecreateAsHiringAuthorityProps = {
  name: any,
  showAlert: any => void
};

const RecreateAsHiringAuthority = (props: RecreateAsHiringAuthorityProps) => {
  const { showAlert } = props;
  const location = useLocation();
  const history = useHistory();

  const [name, setName] = useState(location.state);
  const [isFromDirectory, setIsFromDirectory] = useState(true);

  const [selectedCompany, setselectedCompany] = useState(null);

  useEffect(() => {
    if (location.state) setName(location.state);
  }, [location.state]);

  const {
    email,
    id,
    specialty: { id: specialty_id } = {},
    personalInformation: {
      first_name,
      last_name,
      contact: { phone, mobile, ext, other_ext, personal_email } = {}
    } = {},
    position: { id: position_id } = {},
    specialty,
    subspecialty,
    title,
    position
  } = name;

  const initialValuesHA = {
    specialty_id: specialty,
    subspecialty_id: subspecialty,
    position_id: position
  };

  const form = useForm(
    name
      ? {
          defaultValues: {
            id,
            first_name,
            last_name,
            personal_phone: mobile,
            work_phone: phone,
            ext,
            other_ext,
            work_email: email,
            personal_email,
            title,
            specialty_id,
            subspecialty_id: subspecialty?.id,
            position_id,
            company_id: null
          }
        }
      : {}
  );

  const { register, errors, setValue } = form;

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isFormDisabled: false
  });

  const handleCompanySelected = (Name?: string, value: any) => {
    setselectedCompany(value);
    setValue(Name, value ? value.id : value, true);
  };

  const companyGetOptionLabel = option =>
    `${option.name} - ${option.city} - ${option.specialty_title}`;

  const companyGetOptionSelected = (option, value) => option.id === value.id;

  const onSubmit = async formData => {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));
      const response = await API.post(
        `${Endpoints.Companies}/${formData.company_id}/${Endpoints.HiringAuthorities}`,
        formData
      );
      if (response.data && response.status === 201) {
        showAlert({
          severity: 'success',
          title: 'Awesome',
          body: 'The Hiring Authority was created successfully'
        });
        history.goBack();
      }
    } catch (err) {
      showAlert({
        severity: 'error',
        title: 'Error while trying to create H.A.',
        body: getErrorMessage(err)
      });
    }
    setUiState(prevState => ({
      ...prevState,
      isSaving: false,
      isSuccess: false
    }));
  };

  const initialValuesCompany = {};

  const toggleDirectoryOption = () => {
    setIsFromDirectory(!isFromDirectory);
  };

  useEffect(() => {
    register({ name: 'company_id' }, { required: 'Recruiter is required' });
  }, [register]);

  return (
    <ContentPageLayout>
      <>
        <Box maxWidth={layout.maxWidth} width="100%" margin="0 auto">
          {/* onSubmit={form.handleSubmit(onSubmit)} */}
          <Grid item xs={12}>
            <FormContext {...form}>
              <Box px={4} component="form" onSubmit={form.handleSubmit(onSubmit)}>
                <Box py={4}>
                  <TitleLabel backNavigation text="Recreate as Hiring Authority" />
                </Box>
                <Box mb={4} style={globalStyles.containerBoxShadow}>
                  <NewItemsSubtitles
                    subTitle="Personal Data"
                    description="Fields marked with * are required to add this candidate"
                  />
                  <Box style={globalStyles.newItemBoxContent}>
                    <HiringAuthorityForm initialValues={initialValuesHA} />
                  </Box>
                </Box>
                <Box mb={4} style={globalStyles.containerBoxShadow}>
                  <NewItemsSubtitles
                    subTitle="Company Data"
                    description="Fields marked with * are required to add this company"
                  />
                  <Box
                    alignItems="flex-start"
                    flexDirection="column"
                    style={{ ...globalStyles.newItemBoxContent, alignItems: 'flex-start' }}
                  >
                    {!isFromDirectory ? (
                      <>
                        <Box display="flex" flexDirection="row">
                          <Text
                            customStyle={styles.textDescription}
                            text="You are creating a new company but you can "
                            variant="subtitle1"
                          />
                          <Button
                            color="primary"
                            size="small"
                            onClick={toggleDirectoryOption}
                            style={globalStyles.resetButton}
                          >
                            select and existing one from directory
                          </Button>
                          <Text
                            customStyle={styles.textDescription}
                            text=" instead."
                            variant="subtitle1"
                          />
                        </Box>
                        <CompanyForm initialValues={initialValuesCompany} />
                      </>
                    ) : (
                      <Box display="flex" flexDirection="column">
                        <Box display="flex" flexDirection="row">
                          <Text
                            text="Choose a company from directory or "
                            variant="subtitle1"
                            customStyle={styles.textDescription}
                          />
                          <Button
                            color="primary"
                            size="small"
                            onClick={toggleDirectoryOption}
                            style={globalStyles.resetButton}
                          >
                            Create a new one
                          </Button>
                        </Box>
                        <Box mt={2.8}>
                          <AutocompleteSelect
                            name="company_id"
                            selectedValue={selectedCompany}
                            placeholder="Company"
                            displayKey="name"
                            typeahead
                            typeaheadParams={{ perPage: 256 }}
                            typeaheadLimit={256}
                            getOptionLabel={companyGetOptionLabel}
                            getOptionSelected={companyGetOptionSelected}
                            url={Endpoints.Companies}
                            onSelect={handleCompanySelected}
                            groupBy={option => option.state}
                            error={!!errors.company_id}
                            errorText={errors.company_id && errors.company_id.message}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box my={4} display="flex" justifyContent="flex-end">
                  <Box mr={2.3}>
                    <ActionButton
                      variant="outlined"
                      style={{ width: CancelSaveButton }}
                      text="Cancel"
                      onClick={() => {
                        history.goBack();
                      }} // TODO: navigate to previous page
                    />
                  </Box>
                  <SaveButton
                    isSaving={uiState.isSaving}
                    isSuccess={uiState.isSuccess}
                    disabled={uiState.isFormDisabled || uiState.isSaving}
                  />
                </Box>
              </Box>
            </FormContext>
          </Grid>
        </Box>
      </>
    </ContentPageLayout>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert))
  };
};

const RecreateAsHiringAuthorityConnected = connect(
  null,
  mapDispatchToProps
)(RecreateAsHiringAuthority);

export default RecreateAsHiringAuthorityConnected;
