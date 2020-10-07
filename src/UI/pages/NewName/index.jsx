// @flow
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useForm, FormContext } from 'react-hook-form';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import API from 'services/API';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import NewItemsSubtitles from 'UI/components/molecules/NewItemsSubtitles';
import ActionButton from 'UI/components/atoms/ActionButton';
import SaveButton from 'UI/components/atoms/SaveButton';
import { CancelSaveButton, layout } from 'UI/constants/dimensions';

import { getErrorMessage } from 'UI/utils';
import { showAlert } from 'actions/app';

import { EntityRoutes } from 'routes/constants';
import { globalStyles } from 'GlobalStyles';
import { drawerAnchor, waitingTimeBeforeRedirect } from 'UI/constants/defaults';

import NameForm from 'UI/components/organisms/NameForm';

type NewNameProps = {
  onShowAlert: any => void
};
const NewName = (props: NewNameProps) => {
  const { onShowAlert } = props;
  const history = useHistory();
  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false
  });

  const location = useLocation();
  const {
    firstName,
    lastName,
    currentPosition,
    currentCompany,
    email,
    phone,
    linkProfile
  } = queryString.parse(location.search);

  const initialValues = {
    source_type_id: { id: 1, title: 'LinkedIn' },
    name_status_id: {
      id: 0,
      name_type_id: 0,
      title: 'Undefined'
    }
  };

  const form = useForm(
    location.search
      ? {
          defaultValues: {
            first_name: firstName,
            last_name: lastName,
            phone,
            email,
            title: currentPosition,
            current_company: currentCompany,
            link_profile: linkProfile,
            name_status_id: initialValues.name_status_id.id,
            source_type_id: initialValues.source_type_id.id
          }
        }
      : {}
  );

  const handleCancelClick = () => {
    history.goBack();
  };

  const onSubmit = async formData => {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));

      const nameData = {
        ...formData
        // blueSheet: bluesheet,
      };

      const response = await API.post('names', nameData);
      if (response.data && response.status === 201) {
        setUiState(prevState => ({
          ...prevState,
          isSuccess: true
        }));

        onShowAlert({
          severity: 'success',
          title: 'Names',
          body: 'Awesome! The name was created succesfully'
        });

        setTimeout(() => {
          history.push(EntityRoutes.NameProfile.replace(':id', response.data.data.id));
        }, waitingTimeBeforeRedirect);
      }
    } catch (err) {
      setUiState(prevState => ({
        ...prevState,
        isSuccess: false
      }));
      onShowAlert({
        severity: 'error',
        title: 'Names',
        autoHideDuration: 5000,
        body: getErrorMessage(err)
      });
    }

    setUiState(prevState => ({
      ...prevState,
      isSaving: false
    }));
  };

  return (
    <ContentPageLayout>
      <React.Fragment key={drawerAnchor}>
        <Box maxWidth={layout.maxWidth} width="100%" margin="0 auto">
          <FormContext {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Grid item xs={12}>
                <Box px={4}>
                  <Box py={4}>
                    <TitleLabel backNavigation text="New Name" />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    minHeight="650px"
                    justifyContent="space-between"
                  >
                    <Box mb={4} style={globalStyles.containerBoxShadow}>
                      <NewItemsSubtitles
                        subTitle="Personal Data"
                        description="Fields marked with * are required to add this lead"
                      />
                      <Box style={globalStyles.newItemBoxContent}>
                        <NameForm initialValues={location.search ? initialValues : {}} />
                      </Box>
                    </Box>
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
                </Box>
              </Grid>
            </form>
          </FormContext>
        </Box>
      </React.Fragment>
    </ContentPageLayout>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(NewName);
