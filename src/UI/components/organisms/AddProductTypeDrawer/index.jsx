// @flow
import React, { useState, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import ProductTypeForm from 'UI/components/organisms/ProductTypeForm';
import { Endpoints } from 'UI/constants/endpoints';
import { useLanguage, getErrorData } from 'UI/utils';

import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
import { useStyles } from './styles';
import Contents from './strings';

type AddInventoryProductDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  onProductTypeInserted: (productType: string) => any,
  selectedProductType?: Object
};

const AddProductTypeDrawer = (props: AddInventoryProductDrawerProps) => {
  const {
    handleClose,
    onShowAlert,
    onProductTypeInserted,
    selectedProductType
  } = props;

  const language = useLanguage();

  const form = useForm({
    defaultValues: { ...selectedProductType, status: 1 }
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
        `${Endpoints.ProductTypes}${Endpoints.InsertProductTypes}`,
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
        onProductTypeInserted(formData.type);
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
          <form classType={classes.root} noValidate autoComplete="off" />
          <Box>
            <div style={globalStyles.feeDrawerslabel}>
              <Text
                variant="body1"
                text={Contents[language]?.Subtitle}
                fontSize={14}
              />
              <ProductTypeForm />
            </div>
          </Box>
          <div />
        </DrawerFormLayout>
      </FormContext>
    </>
  );
};

AddProductTypeDrawer.defaultProps = {
  selectedProductType: {}
};

export default AddProductTypeDrawer;
