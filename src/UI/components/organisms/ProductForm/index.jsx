// @flow
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@material-ui/core/Box';

import TextBox from 'UI/components/atoms/TextBox';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { Endpoints } from 'UI/constants/endpoints';

import { PRODUCT_DESCRIPTION_VALIDATION } from 'UI/utils';
import type { Map } from 'types';
import InputContainer from 'UI/components/atoms/InputContainer';

import Contents from './strings';

type ProductFormProps = {
  initialValues: Map
};

const Separator = () => <span style={{ width: 20 }} />;

const ProductForm = (props: ProductFormProps) => {
  const { initialValues } = props;
  const language = localStorage.getItem('language');

  const [comboValues, setComboValues] = useState<Map>(initialValues);

  const { register, errors, setValue, getValues } = useFormContext();

  useEffect(() => {
    register({ name: 'type' }, { required: `type ${Contents[language].RequiredMessage}` });
    register(
      { name: 'characteristic' },
      { required: `characteristic ${Contents[language].RequiredMessage}` }
    );
    register({ name: 'color' }, { required: `Color ${Contents[language].RequiredMessage}` });
    register({ name: 'provider' }, { required: `Proveedor ${Contents[language].RequiredMessage}` });
    register({ name: 'size' }, { required: `Tamaño ${Contents[language].RequiredMessage}` });
    register({ name: 'pieces' }, { required: `Piezas ${Contents[language].RequiredMessage}` });
    register({ name: 'cost' }, { required: `Costo ${Contents[language].RequiredMessage}` });
    register(
      { name: 'salePrice' },
      { required: `Precio de venta ${Contents[language].RequiredMessage}` }
    );
    register({ name: 'idStore' }, { required: `Tienda ${Contents[language].RequiredMessage}` });
    register({ name: 'gender' }, { required: `Genero ${Contents[language].RequiredMessage}` });
    register({ name: 'quantity' }, { required: `Cantidad ${Contents[language].RequiredMessage}` });
    register({ name: 'description' }, { ...PRODUCT_DESCRIPTION_VALIDATION });
  }, [language, register]);

  const handleComboChange = (name: string, value: any) => {
    // const val = getValues();
    // console.log(val);
    setComboValues((prevState: Map): Map => ({ ...prevState, [name]: value }));
    setValue(name, value?.id ? value?.id : value?.title, true);
  };

  const handleTextChange = (name?: string, value: any) => {
    setValue(name, value, true);
    setComboValues({ ...comboValues });
  };

  return (
    <Box display="flex" flexWrap="wrap" maxWidth={1360} width="100%">
      <InputContainer>
        <AutocompleteSelect
          name="type"
          selectedValue={comboValues.type}
          placeholder="Tipo de Producto *"
          error={!!errors.type}
          errorText={errors.type && errors.type.message}
          onSelect={handleComboChange}
          url={Endpoints.Types}
        />
        <Separator />
        <AutocompleteSelect
          name="characteristic"
          selectedValue={comboValues.characteristic}
          placeholder="Caracteristicas *"
          error={!!errors.characteristic}
          errorText={errors.characteristic && errors.characteristic.message}
          onSelect={handleComboChange}
          url={Endpoints.Characteristics}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          name="color"
          selectedValue={comboValues.color}
          placeholder="Color *"
          error={!!errors.color}
          errorText={errors.color && errors.color.message}
          onSelect={handleComboChange}
          url={Endpoints.Colors}
        />
        <Separator />
        <AutocompleteSelect
          name="provider"
          selectedValue={comboValues.provider}
          placeholder="Proveedor *"
          error={!!errors.provider}
          errorText={errors.provider && errors.provider.message}
          onSelect={handleComboChange}
          url={Endpoints.Provider}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          inputType="number"
          name="size"
          label="Talla *"
          error={!!errors.size}
          errorText={errors.size && errors.size.message}
          onChange={handleTextChange}
          value={getValues('size') || ''}
        />
        <Separator />
        <TextBox
          inputType="number"
          name="pieces"
          label="Piezas *"
          error={!!errors.pieces}
          errorText={errors.pieces && errors.pieces.message}
          onChange={handleTextChange}
          value={getValues('pieces') || ''}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          inputType="currency"
          name="cost"
          label="Costo *"
          error={!!errors.cost}
          errorText={errors.cost && errors.cost.message}
          onChange={handleTextChange}
          value={getValues('cost') || ''}
        />
        <Separator />
        <TextBox
          inputType="currency"
          name="salePrice"
          label="Precio de Venta *"
          error={!!errors.salePrice}
          errorText={errors.salePrice && errors.salePrice.message}
          onChange={handleTextChange}
          value={getValues('salePrice') || ''}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          name="idStore"
          selectedValue={comboValues.idStore}
          placeholder="Lugar de recepción *"
          error={!!errors.idStore}
          errorText={errors.idStore && errors.idStore.message}
          onSelect={handleComboChange}
          url={Endpoints.Stores}
        />
        <Separator />
        <AutocompleteSelect
          name="gender"
          placeholder="Genero *"
          selectedValue={comboValues.gender}
          error={!!errors.gender}
          errorText={errors.gender && errors.gender.message}
          onSelect={handleComboChange}
          url={Endpoints.Genders}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          inputType="number"
          name="quantity"
          label="Cantidad *"
          error={!!errors.quantity}
          errorText={errors.quantity && errors.quantity.message}
          onChange={handleTextChange}
          value={getValues('quantity') || ''}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="description"
          label="Descripción *"
          error={!!errors.description}
          errorText={errors.description && errors.description.message}
          onChange={handleTextChange}
          value={getValues('description') || ''}
        />
      </InputContainer>
    </Box>
  );
};

ProductForm.defaultProps = {
  initialValues: {}
};

export default ProductForm;
