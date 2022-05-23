// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import { Endpoints } from 'UI/constants/endpoints';
import { isEmpty } from 'lodash';

import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
import { getErrorData } from 'UI/utils';
import { useStyles } from './styles';
import Contents from './strings';

type FeedInventoryDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  onProductInserted: (product: Object) => any,
  selectedProduct?: any
};

const FeedInventoryDrawer = (props: FeedInventoryDrawerProps) => {
  const {
    handleClose,
    onShowAlert,
    onProductInserted,
    selectedProduct
  } = props;

  const language = localStorage.getItem('language');

  const { idName } = selectedProduct || {};

  const form = useForm({
    defaultValues: {
      ...selectedProduct,
      name: idName
    }
  });

  const { handleSubmit, errors } = form;

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isReadOnly: false,
    isFormDisabled: false,
    isLoading: true,
    preloadedProduct: {}
  });

  useEffect(() => {
    setUiState(prevState => ({
      ...prevState
    }));
  }, []);

  const classes = useStyles();

  const onSubmit = useCallback(
    async (formData: Object) => {
      try {
        const endpointURL = `${Endpoints.Inventory}${Endpoints.FeedProduct}`;
        const response = await API.post(endpointURL, formData);
        if (response) {
          const { insertedProduct, message, title } = response?.data;
          onShowAlert({
            severity: response.status === 200 ? 'success' : 'warning',
            title,
            autoHideDuration: 3000,
            body: message
          });
          onProductInserted(insertedProduct);
        }
      } catch (err) {
        const { title, message, severity } = getErrorData(err);
        onShowAlert({
          severity,
          title,
          autoHideDuration: 800000,
          body: message
        });
        throw err;
      }
    },
    [onProductInserted, onShowAlert]
  );

  if (!isEmpty(errors)) {
    Object.entries(errors).map(([key, value]: any) => {
      return onShowAlert({
        severity: 'error',
        title: `Error en ${key}`,
        autoHideDuration: 800000,
        body: value?.message
      });
    });
  }

  const uiMode = 'Feed';

  return (
    <>
      <FormContext {...form}>
        <DrawerFormLayout
          title={Contents[language][uiMode].Title}
          onSubmit={handleSubmit(onSubmit)}
          onClose={handleClose}
          onSecondaryButtonClick={handleClose}
          variant="borderless"
          uiState={uiState}
          initialText={Contents[language][uiMode].Submit}
        >
          <form className={classes.root} noValidate autoComplete="off" />
          <Box>
            <div style={globalStyles.feeDrawerslabel}>
              <Text
                variant="body1"
                text={Contents[language][uiMode]?.Subtitle}
                fontSize={14}
              />
            </div>
          </Box>
          <div />
        </DrawerFormLayout>
      </FormContext>
    </>
  );
};

FeedInventoryDrawer.defaultProps = { selectedProduct: null };

export default FeedInventoryDrawer;
