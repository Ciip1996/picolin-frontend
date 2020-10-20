// @flow
import React, { useState } from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { connect } from 'react-redux';
import { showAlert } from 'actions/app';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';

import Box from '@material-ui/core/Box';
import Text from 'UI/components/molecules/ProductCard/node_modules/UI/components/atoms/Text';
import FeeAgreementSummaryFields from 'UI/components/molecules/FeeAgreementSummaryFields';
import FeeAgreementValidationInputs from 'UI/components/molecules/FeeAgreementValidationInputs';
import { globalStyles } from 'GlobalStyles';
import { getUserHighestRole } from 'services/Authorization';
import type { FeeAgreementMode, UserRole } from 'types/app';

import { getErrorMessage } from 'UI/utils/index';
import { Endpoints } from 'UI/constants/endpoints';
import { Roles } from 'UI/constants/roles';
import API from 'services/API';
import CircularProgress from '@material-ui/core/CircularProgress';
// import { getUserHighestRole } from 'services/Authorization';

type FeeAgreementValidationDrawerProps = {
  feeAgreement: Object,
  onFeeAgreementValidation: Object => void,
  handleDeclination: any => void,
  handleClose: () => void,
  onResponse: any => any,
  handleEvent: any => any,
  mode: Array<FeeAgreementMode>,
  isValidatingVerbiage: boolean
};

const FeeAgreementValidationDrawer = (props: FeeAgreementValidationDrawerProps) => {
  const {
    onFeeAgreementValidation,
    handleDeclination,
    handleClose,
    // isWithRecruiterNote,
    feeAgreement,
    onResponse,
    handleEvent,
    mode,
    isValidatingVerbiage
  } = props;

  const userRole: UserRole = getUserHighestRole();
  const roles = Object.keys(Roles);

  const { guarantee_days, fee_percentage, verbiage_changes } = feeAgreement || {};

  const preloadedValues = {
    fee_percentage,
    guarantee_days,
    verbiage_changes
  };
  const form = useForm({ defaultValues: preloadedValues });
  const { handleSubmit } = form;

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isFormDisabled: false,
    isReadOnly: false,
    isLoading: false
  });

  const getEndpoint = () => {
    if (userRole?.title === roles[Roles['Regional Director']]) {
      return `${Endpoints.FeeAgreement}/${Endpoints.FeeAgreementValidationByRegionalDirector}`;
    }
    if (userRole?.title === roles[Roles['Production Director']]) {
      return `${Endpoints.FeeAgreement}/${Endpoints.FeeAgreementValidationByProductionDirector}`;
    }
    return undefined;
  };

  async function onSubmit() {
    try {
      setUiState(prevState => ({ ...prevState, isSaving: true }));
      const endpoint = getEndpoint();
      const response = await API.post(endpoint && endpoint.replace(':id', feeAgreement.id));
      if (response.status === 200) {
        setUiState(prevState => ({
          ...prevState,
          isSuccess: true,
          isSaving: false
        }));
        onResponse({
          severity: 'success',
          title: 'Awesome',
          body: `The Fee Agreement was added successfully`
        });
      }
      onFeeAgreementValidation && response.data && onFeeAgreementValidation(response.data);
    } catch (err) {
      onResponse({
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
  }

  const SubmitButtonTextByRole = {
    'Pending Sign': 'Send to Sign',
    Declined: 'Re validate',
    Signed: ' -signed',
    'Pending Validation': 'Validate',
    'Pending Modification': 'Send to Sign'
  };

  const requestedSubtitle =
    userRole?.title === roles[Roles.ProductionDirector] && mode && mode.includes('verbiage')
      ? ` Once you validate this Fee Agreement, it’ll be sent to the OPS team for modification.`
      : '';

  const feeAgreementFields = ['fee', 'guarantee', 'verbiage'];
  const difference = feeAgreementFields.filter(field =>
    isValidatingVerbiage ? !['verbiage'].includes(field) : !mode.includes(field)
  );

  return (
    <FormContext {...form}>
      <DrawerFormLayout
        onSecondaryButtonClick={handleDeclination}
        onSubmit={handleSubmit(onSubmit)}
        onClose={handleClose}
        variant="borderless"
        uiState={uiState}
        title={isValidatingVerbiage ? ' Modify Fee Agreement' : 'Validate Fee Agreement'}
        initialText={SubmitButtonTextByRole[feeAgreement?.feeAgreementStatus?.group?.title]}
        cancelText="Decline"
        isCancelButtonNeeded={!isValidatingVerbiage}
        isSaveButtonMode={!isValidatingVerbiage}
        triggerActionText="Create template"
        onPrimaryButtonClick={handleEvent}
        contentStyle={null}
        isBottomToolbarNeeded
        isTopToolbarNeeded
      >
        <>
          {uiState.isLoading ? (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
              <CircularProgress color="inherit" size={40} />
            </Box>
          ) : (
            <>
              <Box>
                {mode?.length > 0 && (
                  <div style={globalStyles.feeDrawerslabel}>
                    <Text variant="subtitle1" text="Requested Changes" fontSize={16} />
                    <Text
                      variant="body2"
                      text={
                        isValidatingVerbiage
                          ? 'Modify The following Verbiage change.'
                          : 'You can approve or decline the following changes.'
                      }
                      fontSize={14}
                      fontWeight={300}
                    />
                    <Text variant="body2" text={requestedSubtitle} fontSize={14} fontWeight={300} />
                  </div>
                )}
                <FeeAgreementValidationInputs
                  outPutValue
                  initialValues={feeAgreement}
                  mode={isValidatingVerbiage ? ['verbiage'] : mode}
                />
              </Box>
              <FeeAgreementSummaryFields feeAgreement={feeAgreement} mode={difference} />
            </>
          )}
          <Box />
        </>
      </DrawerFormLayout>
    </FormContext>
  );
};

FeeAgreementValidationDrawer.defaultProps = {
  handleEvent: () => {},
  isValidatingVerbiage: false
  // isWithRecruiterNote: true
};

const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(FeeAgreementValidationDrawer);
