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

type AddInventoryProductDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  onProductNameInserted: (productName: string) => any,
  selectedProductName?: Object
};

const AddProductNameDrawer = (props: AddInventoryProductDrawerProps) => {
  const {
    handleClose,
    onShowAlert,
    onProductNameInserted,
    selectedProductName
  } = props;

  // TODO show edit mode
  const language = useLanguage();

  const form = useForm({
    defaultValues: { ...selectedProductName, status: 1 }
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
        `${Endpoints.ProductNames}${Endpoints.InsertProductNames}`,
        formData
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
          initialText="Agregar"
        >
          <form className={classes.root} noValidate autoComplete="off" />
          <Box>
            <div style={globalStyles.feeDrawerslabel}>
              <Text
                variant="body1"
                text={Contents[language]?.Subtitle}
                fontSize={14}
              />
              <ProductNameForm />
            </div>
          </Box>
          <div />
        </DrawerFormLayout>
      </FormContext>
    </>
  );
};

AddProductNameDrawer.defaultProps = {
  selectedProductName: {}
};

export default AddProductNameDrawer;
