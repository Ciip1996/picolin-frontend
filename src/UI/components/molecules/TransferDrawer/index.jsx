// @flow
import React, { useState, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Box from '@material-ui/core/Box';
import Text from 'UI/components/atoms/Text';
import InputContainer from 'UI/components/atoms/InputContainer';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { Endpoints } from 'UI/constants/endpoints';
import TransferCard from 'UI/components/organisms/TransferCard';

import type { MapType } from 'types';
import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
import { useStyles } from './styles';
import Contents from './strings';

type TransferProductsDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  onTransfered: any => any
};

const TransferProductsDrawer = (props: TransferProductsDrawerProps) => {
  const { handleClose, onShowAlert, onTransfered } = props;
  const language = localStorage.getItem('language');
  const [comboValues, setComboValues] = useState<MapType>({});
  const [productsList, setProductsList] = useState([]);

  const classes = useStyles();

  const form = useForm({
    defaultValues: {}
  });
  const { handleSubmit, register, errors, setValue } = form;

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

  useEffect(() => {
    setUiState(prevState => ({
      // TODO remove this is only for eslint not to crash
      ...prevState
    }));
  }, []);

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
        productCode && onTransfered(productCode);
      }
    } catch (err) {
      onShowAlert({
        severity: 'error',
        title: 'Error',
        autoHideDuration: 3000,
        body: 'Ocurrio un problema'
      });
      throw err;
    }
  };

  const handleComboChange = (name: string, value: any) => {
    setComboValues((prevState: MapType): MapType => ({ ...prevState, [name]: value }));
    setValue(name, value?.id ? value?.id : value?.title, true);
  };

  const handleAddProduct = (name: string, value: any) => {
    setProductsList(prevState => {
      // validate that the item has not been added already (removes duplicates)
      if (prevState.length === 0) return [...prevState, { ...value }];
      const doesNotExistInArray = prevState.some(each => each.productCode === value.productCode);
      if (doesNotExistInArray) return prevState;
      return [...prevState, { ...value }];
    });
  };

  useEffect(() => {
    register({ name: 'copies' }, { required: `${Contents[language]?.CopiesRequired}` });
  }, [language, register]);

  const Separator = () => <span style={{ width: 20 }} />;

  const defaultOptionSelectedFn = (option, value) => option.id === value.id;
  const searchingProductsUrl = `${Endpoints.Inventory}${Endpoints.GetInventory}`.replace(
    ':idStore',
    'All'
  );

  const example = {
    idInventory: 20,
    productCode: 'PDIDOJU2012',
    description: ' tiene incrustacion de oro falso',
    characteristic: 'Lino',
    provider: 'Ropones de san juan',
    color: 'Dorado',
    size: 3,
    pieces: 7,
    salePrice: 399,
    cost: 199,
    gender: 'niño',
    type: 'Vestido',
    stock: 1,
    reservedQuantity: 0,
    store: 'Tienda Centro'
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

              <InputContainer>
                <AutocompleteSelect
                  name="idOrigin"
                  selectedValue={comboValues.idOrigin}
                  placeholder={Contents[language]?.Origin}
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
              <InputContainer>
                <AutocompleteSelect
                  name="products"
                  // selectedValue={comboValues.producto}
                  placeholder="Escriba un Producto"
                  url={searchingProductsUrl}
                  displayKey="name"
                  typeahead
                  typeaheadLimit={25}
                  onSelect={handleAddProduct}
                  getOptionSelected={defaultOptionSelectedFn}
                  dataFetchKeyName="inventory"
                  renderOption={option => {
                    return (
                      <div>
                        <strong>{option.productCode}</strong>
                        <br />
                        <span>{option.type}</span> | <span>{option.gender}</span> |
                        <span>{option.characteristic}</span>| <span>{option.color}</span>
                      </div>
                    );
                  }}
                />
              </InputContainer>
              <div>
                <TransferCard />
                <TransferCard
                  description={`${example?.productCode} - ${example?.description}`}
                  characteristic={example?.characteristic}
                  color={example?.color}
                  cost={example?.cost}
                  gender={example?.gender}
                  size={example?.size}
                  type={example.type}
                />
                {productsList.map(each => (
                  <TransferCard
                    description={`${each?.productCode} - ${each?.description}`}
                    characteristic={each?.characteristic}
                    color={each?.color}
                    cost={each?.cost}
                    gender={each?.gender}
                    size={each.size}
                    type={each.type}
                  />
                ))}
              </div>
            </div>
          </Box>
          <div />
        </DrawerFormLayout>
      </FormContext>
    </>
  );
};

TransferProductsDrawer.defaultProps = {};

export default TransferProductsDrawer;
