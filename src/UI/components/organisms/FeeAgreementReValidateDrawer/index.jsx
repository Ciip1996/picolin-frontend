// @flow
import React, { useState } from 'react';
import { useForm, FormContext } from 'react-hook-form';
import moment from 'moment';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import UserComments from 'UI/components/molecules/UserComments';
import Box from '@material-ui/core/Box';
import Text from 'UI/components/molecules/ProductCard/node_modules/UI/components/atoms/Text';

import FeeAgreementValidationInputs from 'UI/components/molecules/FeeAgreementValidationInputs';
import { globalStyles } from 'GlobalStyles';
import { DateFormats } from 'UI/constants/defaults';

import FeeAgreementSummaryFields from 'UI/components/molecules/FeeAgreementSummaryFields';
import { PendingDeclinationStatusBy } from 'UI/constants/status';

import { getErrorMessage } from 'UI/utils';
import { Endpoints } from 'UI/constants/endpoints';
import API from 'services/API';
import { styles } from './style';

type FeeAgreementReValidateDrawerProps = {
  handleFeeAgreementRevalidation: () => void,
  handleClose: any => any,
  feeAgreement: Object,
  onResponse: any => any
};

const FeeAgreementReValidateDrawer = (props: FeeAgreementReValidateDrawerProps) => {
  const { handleFeeAgreementRevalidation, handleClose, onResponse, feeAgreement } = props;

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isReadOnly: false,
    isFormDisabled: false,
    isLoading: true
  });

  const {
    declination_details = {},
    created_at,
    guarantee_days,
    fee_percentage,
    verbiage_changes,
    creator: {
      initials: recruiterInitials,
      personalInformation: { full_name: recruiterName }
    },
    fee_agreement_status_id
  } = feeAgreement || {};

  const declinationMode =
    declination_details?.declined_fields &&
    declination_details.declined_fields.map(each => {
      if (each.includes('fee')) return 'fee';
      if (each.includes('guarantee')) return 'guarantee';
      if (each.includes('verbiage')) return 'verbiage';
      return null;
    });

  const preloadedValues = {
    fee_percentage,
    guarantee_days,
    verbiage_changes
  };

  const form = useForm({ defaultValues: preloadedValues });

  const getEndpoint = () => {
    if (fee_agreement_status_id === PendingDeclinationStatusBy['Regional Director']) {
      return `${Endpoints.FeeAgreement}/${Endpoints.FeeAgreementRevalidationToRegionalDirector}`;
    }
    if (fee_agreement_status_id === PendingDeclinationStatusBy['Production Director']) {
      return `${Endpoints.FeeAgreement}/${Endpoints.FeeAgreementRevalidationToProductionDirector}`;
    }
    return undefined;
  };

  const onSubmit = async formData => {
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
          body: `The Fee Agreement was revalidated successfully`
        });
        handleFeeAgreementRevalidation && handleFeeAgreementRevalidation();
        handleClose && handleClose();
      }
    } catch (err) {
      onResponse({
        severity: 'error',
        title: `Fee Agreement not revalidated`,
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

  const feeAgreementFields = ['fee', 'guarantee', 'verbiage'];
  const difference = feeAgreementFields.filter(
    field => declinationMode && !declinationMode.includes(field)
  );

  return (
    <>
      <FormContext {...form}>
        <DrawerFormLayout
          onSubmit={form.handleSubmit(onSubmit)}
          onClose={handleClose}
          onSecondaryButtonClick={handleClose}
          variant="borderless"
          uiState={uiState}
          title="RE-Validate Fee Agreement"
          initialText="Re-Validate"
        >
          <div>
            <Text variant="subtitle1" text="Reasons of declination" fontSize={16} />
            <UserComments
              avatarInitials={recruiterInitials}
              author={recruiterName}
              date={moment(created_at).format(DateFormats.DetailDate)}
              note={declination_details?.declination_notes}
            />
          </div>
          <hr style={styles.hr} />
          <Box>
            <div style={globalStyles.feeDrawerslabel}>
              <Text variant="subtitle1" text="Modify The Declined Fields" fontSize={16} />
            </div>
            <FeeAgreementValidationInputs mode={declinationMode} />
          </Box>
          <FeeAgreementSummaryFields mode={difference} feeAgreement={feeAgreement} />
          <div />
        </DrawerFormLayout>
      </FormContext>
    </>
  );
};

FeeAgreementReValidateDrawer.defaultProps = {
  onResponse: () => {}
};

export default FeeAgreementReValidateDrawer;
