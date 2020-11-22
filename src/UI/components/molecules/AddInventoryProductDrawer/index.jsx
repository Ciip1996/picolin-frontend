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

type AddInventoryProductDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  onProductInserted: any => any
};

const AddInventoryProductDrawer = (props: AddInventoryProductDrawerProps) => {
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
      // TODO remove this is only for eslint not to crash
      ...prevState
    }));
  }, []);

  const classes = useStyles();

  const onSubmit = async (formData: Object) => {
    try {
      const response = await API.post(
        `${Endpoints.Inventory}${Endpoints.InsertInventory}`,
        formData
      );
      if (response) {
        const { productCode } = response?.data;
        onShowAlert({
          severity: 'success',
          title: 'Producto Agregado',
          autoHideDuration: 3000,
          body: 'Inserción Exitosa'
        });
        productCode && onProductInserted(productCode);
      }
    } catch (err) {
      onShowAlert({
        severity: 'error',
        title: getErrorData(err)?.title,
        autoHideDuration: 800000,
        body: getErrorData(err)?.message
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
              <Text variant="body1" text={Contents[language]?.Subtitle} fontSize={14} />
              <ProductForm />
            </div>
          </Box>
          <div />
        </DrawerFormLayout>
      </FormContext>
    </>
  );
};

AddInventoryProductDrawer.defaultProps = {};

export default AddInventoryProductDrawer;
