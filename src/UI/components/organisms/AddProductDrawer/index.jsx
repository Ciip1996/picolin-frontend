// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import ProductForm from 'UI/components/organisms/ProductForm';
import { Endpoints } from 'UI/constants/endpoints';
import { isEmpty } from 'lodash';

import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
import { getErrorData, getSizeObjectByValue } from 'UI/utils';
import { useStyles } from './styles';
import Contents from './strings';

type AddProductDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  onProductInserted: (product: Object) => any,
  selectedProduct?: any,
  isEditMode?: boolean
};

const AddProductDrawer = (props: AddProductDrawerProps) => {
  const {
    handleClose,
    onShowAlert,
    onProductInserted,
    selectedProduct,
    isEditMode
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
        const endpointURL = isEditMode
          ? `${Endpoints.Products}${Endpoints.ModifyProduct}`
          : `${Endpoints.Products}${Endpoints.InsertProduct}`;
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
          autoHideDuration: 8000,
          body: message
        });
        throw err;
      }
    },
    [isEditMode, onProductInserted, onShowAlert]
  );
  useEffect(() => {
    if (!isEmpty(errors)) {
      onShowAlert({
        severity: 'error',
        title: `Formulario Incompleto`,
        autoHideDuration: 8000,
        body: 'Porfavor revise los campos que faltan.'
      });
    }
  }, [errors, onShowAlert]);

  const uiMode = isEditMode ? 'Edit' : 'Register';

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
              <ProductForm
                isEditMode={isEditMode}
                initialComboValues={{
                  idType: {
                    id: selectedProduct?.idType,
                    title: selectedProduct?.type
                  },
                  name: {
                    id: selectedProduct?.idName,
                    title: selectedProduct?.name,
                    name_with_provider: selectedProduct?.name_with_provider
                  },
                  idMaterial: {
                    id: selectedProduct?.idMaterial,
                    title: selectedProduct?.material
                  },
                  idGender: {
                    id: selectedProduct?.idGender,
                    title: selectedProduct?.gender
                  },
                  idColor: {
                    id: selectedProduct?.idColor,
                    title: selectedProduct?.color
                  },
                  pSize: getSizeObjectByValue(selectedProduct?.pSize || ''),
                  isSizeNumeric: !Number.isNaN(
                    parseInt(selectedProduct?.pSize, 10)
                  )
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

AddProductDrawer.defaultProps = { selectedProduct: null, isEditMode: false };

export default AddProductDrawer;
