// @flow
import React, { useState, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import ProductNameForm from 'UI/components/organisms/ProductNameForm';
import { Endpoints } from 'UI/constants/endpoints';

import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
import { getErrorData } from 'UI/utils';
import { useStyles } from './styles';
import Contents from './strings';

type AddInventoryProductDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  onProductNameInserted: () => any,
  selectedProductName: Object
};

const AddProductNameDrawer = (props: AddInventoryProductDrawerProps) => {
  const {
    handleClose,
    onShowAlert,
    onProductNameInserted,
    selectedProductName
  } = props;

  console.log(selectedProductName);
  // TODO show edit mode
  const language = localStorage.getItem('language');

  const form = useForm({
    defaultValues: {}
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
        onProductNameInserted();
      }
    } catch (err) {
      const { title, message } = getErrorData(err);

      onShowAlert({
        severity: 'error',
        autoHideDuration: 3000,
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

AddProductNameDrawer.defaultProps = {};

export default AddProductNameDrawer;
