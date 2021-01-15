// @flow
import React, { useState, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import InputContainer from 'UI/components/atoms/InputContainer';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { Endpoints } from 'UI/constants/endpoints';
import TransferCard from 'UI/components/organisms/TransferCard';
import ListProductRow from 'UI/components/molecules/ListProductRow';

import type { MapType } from 'types';
import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
import { useStyles } from './styles';
import Contents from './strings';

type TransferDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  onTransfered: () => any
};

const TransferDrawer = (props: TransferDrawerProps) => {
  const { handleClose, onShowAlert, onTransfered } = props;
  const language = localStorage.getItem('language');
  const [comboValues, setComboValues] = useState<MapType>({});
  const [productsList, setProductsList] = useState([]);

  const classes = useStyles();

  const form = useForm();
  const { register, errors, handleSubmit, setValue, watch, unregister, reset } = form;

  // const vals = getValues();
  // console.log(vals);

  const onSubmit = async (formData: Object) => {
    try {
      const { idDestination, idOrigin, products: isProductsAvailable, ...rest } = formData;
      const products = Object.entries(rest).map(([key, value]) => {
        return { productCode: key, quantity: value };
      });
      const params = {
        idDestination,
        idOrigin,
        products
      };
      const response = await API.post(`${Endpoints.Transfers}${Endpoints.InsertTransfer}`, params);
      if (response) {
        onShowAlert({
          severity: 'success',
          title: 'Transferencia Exitosa',
          autoHideDuration: 3000,
          body: `Se han transferido los productos de ${comboValues.idOrigin.title} a ${comboValues.idDestination.title}`
        });
        onTransfered();
      }
    } catch (err) {
      onShowAlert({
        severity: 'error',
        title: 'Error al transferir',
        autoHideDuration: 3000,
        body: 'Ocurrió un problema'
      });
      throw err;
    }
  };

  const handleComboChange = (name?: string, value: any) => {
    if (productsList.length > 0) {
      // reset the form if there is a change in the selects
      setProductsList([]);
      setComboValues({});
      reset();
      registerFormField();
    }
    setComboValues((prevState: MapType): MapType => ({ ...prevState, [name]: value }));
    setValue(name, value ? value.id : value, true);
  };

  const handleAddProduct = (name: string, value: any) => {
    setProductsList(prevState => {
      // validate that the item has not been added already (removes duplicates)
      if (prevState.length === 0) {
        return [...prevState, { product: { ...value }, quantity: 1 }];
      }
      const doesNotExistInArray = prevState.some(
        each => each.product.productCode === value.productCode
      );
      if (doesNotExistInArray) return prevState;
      return [...prevState, { product: { ...value }, quantity: 1 }];
    });
    setValue(name, value ? true : undefined, true);
  };

  const defaultOptionSelectedFn = (option, value) => option.id === value.id;
  const searchingProductsUrl = `${Endpoints.Inventory}${Endpoints.GetInventory}`.replace(
    ':idStore',
    comboValues?.idOrigin?.id ? comboValues?.idOrigin?.id : ''
  );

  const onRemoveProduct = (productCode: string) => {
    setProductsList(prevState => {
      // remove item with productCode
      const filteredArray = prevState.filter(
        (each: Object) => each.product.productCode !== productCode
      );
      return [...filteredArray];
    });
    unregister(productCode);
  };

  const onModifyAmountOfItem = (productCode: Object, quantity: any, stock: number) => {
    const updatedProducts = productsList.map((each: Object) => {
      if (each?.product?.productCode === productCode) {
        const isStockUnavailable = quantity ? stock < quantity : stock < 0;
        if (isStockUnavailable) {
          setValue(productCode, quantity, true);
        } else {
          setValue(productCode, quantity || 0, true);
        }
        return { ...each, quantity: parseInt(quantity, 10) };
      }
      return each;
    });
    setProductsList(updatedProducts);
  };

  const isProductFieldEnabled =
    comboValues.idOrigin &&
    comboValues.idDestination &&
    comboValues.idOrigin.id !== comboValues.idDestination.id &&
    !errors.idDestination &&
    !errors.idOrigin;

  const registerFormField = () => {
    register(
      { name: 'idOrigin' },
      {
        required: `${Contents[language]?.requiredField}`,
        validate: value => {
          return value !== watch('idDestination') || `${Contents[language]?.sameStore}`;
        }
      }
    );
    register(
      { name: 'idDestination' },
      {
        required: `${Contents[language]?.requiredField}`,
        validate: value => {
          return value !== watch('idOrigin') || `${Contents[language]?.sameStore}`;
        }
      }
    );
    register(
      { name: 'products' },
      {
        required: `${Contents[language]?.emptyProductList}`
      }
    );
  };
  useEffect(() => {
    registerFormField();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register]);

  useEffect(() => {
    if (productsList.length === 0 && comboValues.idOrigin && comboValues.idDestination)
      setValue('products', undefined, true);
  }, [comboValues.idDestination, comboValues.idOrigin, productsList, setValue]);

  const Separator = () => <span style={{ width: 20 }} />;

  return (
    <>
      <DrawerFormLayout
        title={Contents[language]?.Title}
        onSubmit={handleSubmit(onSubmit)}
        onClose={handleClose}
        onSecondaryButtonClick={handleClose}
        variant="borderless"
        initialText="Transferir"
      >
        <FormContext {...form}>
          <div className={classes.root}>
            <Box>
              <div style={globalStyles.feeDrawerslabel}>
                <Text variant="h2" text={Contents[language]?.Subtitle} fontSize={14} />
                <br />
                <Text variant="subtitle1" text={Contents[language]?.FirstStep} fontSize={12} />
                <InputContainer>
                  <AutocompleteSelect
                    autoFocus
                    name="idOrigin"
                    selectedValue={comboValues.idOrigin}
                    placeholder={Contents[language]?.origin}
                    error={!!errors?.idOrigin}
                    errorText={errors?.idOrigin && errors?.idOrigin.message}
                    onSelect={handleComboChange}
                    url={Endpoints.Stores}
                  />
                  <Separator />
                  <AutocompleteSelect
                    name="idDestination"
                    selectedValue={comboValues.idDestination}
                    placeholder={Contents[language]?.Destination}
                    error={!!errors?.idDestination}
                    errorText={errors?.idDestination && errors?.idDestination.message}
                    onSelect={handleComboChange}
                    url={Endpoints.Stores}
                  />
                </InputContainer>
                <Divider />
                <Text variant="subtitle1" text={Contents[language]?.SecondStep} fontSize={12} />
                <InputContainer>
                  <AutocompleteSelect
                    name="products"
                    // selectedValue={comboValues.producto}
                    disabled={!isProductFieldEnabled}
                    placeholder="Escriba un Producto"
                    url={searchingProductsUrl}
                    displayKey="name"
                    typeahead
                    typeaheadLimit={15}
                    onSelect={handleAddProduct}
                    getOptionSelected={defaultOptionSelectedFn}
                    dataFetchKeyName="inventory"
                    error={!!errors?.products}
                    errorText={errors?.products && errors?.products.message}
                    renderOption={option => {
                      return <ListProductRow product={option} />;
                    }}
                  />
                </InputContainer>
                <div>
                  {/* <Text variant="body1" text={Contents[language]?.Subtitle} fontSize= {14} /> */}
                  {productsList.map(each => {
                    return (
                      <TransferCard
                        product={each?.product}
                        quantityOfProducts={each?.quantity}
                        onRemoveItem={onRemoveProduct}
                        onAmountOfProductsChanged={onModifyAmountOfItem}
                      />
                    );
                  })}
                </div>
              </div>
            </Box>
          </div>
        </FormContext>
      </DrawerFormLayout>
    </>
  );
};

TransferDrawer.defaultProps = {};

export default TransferDrawer;
