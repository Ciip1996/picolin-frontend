// @flow
import React, { useState, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import ProductForm from 'UI/components/organisms/ProductForm';
import { Endpoints } from 'UI/constants/endpoints';

import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
import { getErrorData } from 'UI/utils';
import { useStyles } from './styles';
import Contents from './strings';

type AddProductDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  onProductInserted: Object => any
};

const AddProductDrawer = (props: AddProductDrawerProps) => {
  const { handleClose, onShowAlert, onProductInserted } = props;
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
        `${Endpoints.Products}${Endpoints.InsertProduct}`,
        formData
      );
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
              <ProductForm />
            </div>
          </Box>
          <div />
        </DrawerFormLayout>
      </FormContext>
    </>
  );
};

AddProductDrawer.defaultProps = {};

export default AddProductDrawer;
