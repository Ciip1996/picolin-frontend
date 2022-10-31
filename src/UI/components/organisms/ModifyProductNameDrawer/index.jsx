// @flow
import React, { useState, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import ProductNameForm from 'UI/components/organisms/ProductNameForm';
import { Endpoints } from 'UI/constants/endpoints';
import { useLanguage, getErrorData } from 'UI/utils';

import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
import { useStyles } from './styles';
import Contents from './strings';

type ModifyProductNameDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  onProductNameInserted: (productName: string) => any,
  selectedProductName?: any
};

const ModifyProductNameDrawer = (props: ModifyProductNameDrawerProps) => {
  const {
    handleClose,
    onShowAlert,
    onProductNameInserted,
    selectedProductName
  } = props;

  const language = useLanguage();

  const form = useForm({
    defaultValues: {
      idName: selectedProductName?.idName || 100,
      ...selectedProductName,
      status: !!selectedProductName?.status
    }
  });

  const { handleSubmit } = form;

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isReadOnly: false,
    isFormDisabled: false,
    isLoading: true
  });

  useEffect(() => {
    setUiState(prevState => ({
      ...prevState
    }));
  }, []);

  const classes = useStyles();

  const onSubmit = async (formData: Object) => {
    try {
      const response = await API.post(
        `${Endpoints.ProductNames}${Endpoints.ModifyProductName}`,
        { ...formData, status: +formData.status } // the unary operator turns boolean to integer value
      );
      if (response) {
        const { message, title } = response?.data;
        onShowAlert({
          severity: 'success',
          title,
          autoHideDuration: 5000,
          body: message
        });
        onProductNameInserted(formData.name);
      }
    } catch (err) {
      const { title, message, severity } = getErrorData(err);
      onShowAlert({
        severity,
        autoHideDuration: 5000,
        title,
        body: message
      });
      throw err;
    }
  };

  return (
    <>
      <FormContext {...form}>
        <DrawerFormLayout
          title={Contents[language]?.Title}
          onSubmit={handleSubmit(onSubmit)}
          onClose={handleClose}
          onSecondaryButtonClick={handleClose}
          variant="borderless"
          uiState={uiState}
        >
          <form className={classes.root} noValidate autoComplete="off" />
          <Box>
            <div style={globalStyles.feeDrawerslabel}>
              <Text
                variant="body1"
                text={Contents[language]?.Subtitle}
                fontSize={14}
              />
              <ProductNameForm
                showStatus
                showId
                initialComboValues={{
                  idProvider: {
                    id: selectedProductName?.idProvider,
                    title: selectedProductName?.provider
                  }
                }}
              />
            </div>
          </Box>
          <div />
        </DrawerFormLayout>
      </FormContext>
    </>
  );
};

ModifyProductNameDrawer.defaultProps = {
  selectedProductName: {}
};

export default ModifyProductNameDrawer;
