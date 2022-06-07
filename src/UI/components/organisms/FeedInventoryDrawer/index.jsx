// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';

import AutocompleteDebounce from 'UI/components/molecules/AutocompleteDebounce';
import InputContainer from 'UI/components/atoms/InputContainer';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import TextBox from 'UI/components/atoms/TextBox';
import { Endpoints } from 'UI/constants/endpoints';
import SaleCard from 'UI/components/organisms/SaleCard';
import { v4 as uuidv4 } from 'uuid';

import { isEmpty } from 'lodash';
import { getErrorData } from 'UI/utils';
import type { MapType } from 'types';

import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
import { useStyles } from './styles';
import Contents from './strings';

const Separator = () => <span style={{ width: 20, height: 48 }} />;

type FeedInventoryDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  onInventoryInserted: (product: Object) => any,
  preloadedProduct?: any
};

const FeedInventoryDrawer = ({
  handleClose,
  onShowAlert,
  onInventoryInserted,
  preloadedProduct
}: FeedInventoryDrawerProps) => {
  const [comboValues, setComboValues] = useState<MapType>({});
  const [selectedProduct, setSelectedProduct] = useState<Object | null>(
    preloadedProduct || null
  );

  const language = localStorage.getItem('language');

  const { idProduct } = preloadedProduct || {};

  const form = useForm({
    defaultValues: {
      ...preloadedProduct,
      idProduct
    }
  });

  const {
    register,
    errors,
    getValues,
    setValue,
    handleSubmit,
    unregister
  } = useForm();

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

  useEffect(() => {
    register(
      { name: 'idStore' },
      { required: `${Contents[language]?.RequiredMessage}` }
    );
    register(
      { name: 'product' },
      { required: `${Contents[language]?.RequiredMessage}` }
    );
    register(
      { name: 'stock' },
      { required: `${Contents[language]?.RequiredMessage}` }
    );
  }, [language, register]);

  const classes = useStyles();

  const onSubmit = useCallback(
    async (formData: Object) => {
      try {
        const endpointURL = `${Endpoints.Inventory}${Endpoints.FeedProduct}`;
        const response = await API.post(endpointURL, formData);
        if (response) {
          const { insertedInventory, message, title } = response?.data;
          onShowAlert({
            severity: response.status === 200 ? 'success' : 'warning',
            title,
            autoHideDuration: 3000,
            body: message
          });
          onInventoryInserted(insertedInventory);
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
    [onShowAlert]
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

  const handleComboChange = (name?: string, value: any) => {
    setComboValues((prevState: MapType): MapType => ({
      ...prevState,
      [name]: value
    }));
    setValue(name, value ? value.id : value, true);
  };

  const handleAddProduct = (name: string, value: any) => {
    setSelectedProduct(value);
    setValue(name, value, true);
  };

  const handleTextChange = (name?: string, value: any) => {
    setValue(name, value, true);
    setComboValues({ ...comboValues });
  };

  const onRemoveProduct = () => {
    setSelectedProduct({});
    unregister('product');
  };

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
              <InputContainer>
                <AutocompleteSelect
                  autoFocus
                  name="idStore"
                  selectedValue={comboValues.idStore}
                  placeholder={Contents[language]?.Store}
                  error={!!errors?.idStore}
                  errorText={errors?.idStore && errors?.idStore.message}
                  onSelect={handleComboChange}
                  url={Endpoints.Stores}
                />
                <Separator />
                <TextBox
                  inputType="number"
                  name="stock"
                  label={Contents[language]?.Stock}
                  error={!!errors?.stock}
                  errorText={errors?.stock && errors?.stock.message}
                  onChange={handleTextChange}
                  value={getValues('stock') || ''}
                />
              </InputContainer>

              <InputContainer>
                <AutocompleteDebounce
                  maxOptions={10}
                  name="product"
                  onSelectItem={product => handleAddProduct('product', product)}
                  placeholder="Escanee o Escriba un Producto"
                  disabled={false}
                  url={`${Endpoints.Products}${Endpoints.GetProducts}`}
                  dataFetchKeyName="products"
                  displayKey="name"
                  handleError={errorMessage =>
                    onShowAlert({
                      severity: 'error',
                      title: 'Error de busqueda',
                      autoHideDuration: 3000,
                      body: `Ocurrió un problema: ${errorMessage}`
                    })
                  }
                  error={!!errors?.product}
                  errorText={errors?.product && errors?.product.message}
                />
              </InputContainer>
              <InputContainer>
                {selectedProduct ? (
                  <SaleCard
                    key={uuidv4()}
                    product={selectedProduct}
                    quantityOfProducts={selectedProduct?.quantity || 0}
                    onRemoveItem={onRemoveProduct}
                  />
                ) : null}
              </InputContainer>
            </div>
          </Box>
          <div />
        </DrawerFormLayout>
      </FormContext>
    </>
  );
};

FeedInventoryDrawer.defaultProps = { preloadedProduct: null };

export default FeedInventoryDrawer;
