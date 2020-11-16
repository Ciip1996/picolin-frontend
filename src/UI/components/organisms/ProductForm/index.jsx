// @flow
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@material-ui/core/Box';

import TextBox from 'UI/components/atoms/TextBox';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { Endpoints } from 'UI/constants/endpoints';

import { PRODUCT_DESCRIPTION_VALIDATION } from 'UI/utils';
import type { MapType } from 'types';
import InputContainer from 'UI/components/atoms/InputContainer';

import Contents from './strings';

type ProductFormProps = {
  initialValues: MapType
};

const Separator = () => <span style={{ width: 20 }} />;

const ProductForm = (props: ProductFormProps) => {
  const { initialValues } = props;
  const language = localStorage.getItem('language');

  const [comboValues, setComboValues] = useState<MapType>(initialValues);

  const { register, errors, setValue, getValues } = useFormContext();

  useEffect(() => {
    register({ name: 'idType' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'idCharacteristic' }, { required: ` ${Contents[language]?.RequiredMessage}` });
    register({ name: 'color' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'idProvider' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'size' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'pieces' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'cost' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'salePrice' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'idStore' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'idGender' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'quantity' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'description' }, { ...PRODUCT_DESCRIPTION_VALIDATION });
  }, [language, register]);

  const handleComboChange = (name: string, value: any) => {
    setComboValues((prevState: MapType): MapType => ({ ...prevState, [name]: value }));
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
          name="idType"
          selectedValue={comboValues.idType}
          placeholder={Contents[language]?.ProductType}
          error={!!errors?.idType}
          errorText={errors?.idType && errors?.idType?.message}
          onSelect={handleComboChange}
          url={Endpoints.Types}
        />
        <Separator />
        <AutocompleteSelect
          name="idCharacteristic"
          selectedValue={comboValues.idCharacteristic}
          placeholder={Contents[language]?.Characteristics}
          error={!!errors?.idCharacteristic}
          errorText={errors?.idCharacteristic && errors?.idCharacteristic.message}
          onSelect={handleComboChange}
          url={Endpoints.Characteristics}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          name="color"
          selectedValue={comboValues.color}
          placeholder={Contents[language]?.Color}
          error={!!errors?.color}
          errorText={errors?.color && errors?.color.message}
          onSelect={handleComboChange}
          url={Endpoints.Colors}
        />
        <Separator />
        <AutocompleteSelect
          name="idProvider"
          selectedValue={comboValues.idProvider}
          placeholder={Contents[language]?.Provider}
          error={!!errors?.idProvider}
          errorText={errors?.idProvider && errors?.idProvider.message}
          onSelect={handleComboChange}
          url={Endpoints.Provider}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          inputType="number"
          name="size"
          label={Contents[language]?.Size}
          error={!!errors?.size}
          errorText={errors?.size && errors?.size.message}
          onChange={handleTextChange}
          value={getValues('size') || ''}
        />
        <Separator />
        <TextBox
          inputType="number"
          name="pieces"
          label={Contents[language]?.Pieces}
          error={!!errors?.pieces}
          errorText={errors?.pieces && errors?.pieces.message}
          onChange={handleTextChange}
          value={getValues('pieces') || ''}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          inputType="currency"
          name="cost"
          label={Contents[language]?.Cost}
          error={!!errors?.cost}
          errorText={errors?.cost && errors?.cost.message}
          onChange={handleTextChange}
          value={getValues('cost') || ''}
        />
        <Separator />
        <TextBox
          inputType="currency"
          name="salePrice"
          label={Contents[language]?.SalePrice}
          error={!!errors?.salePrice}
          errorText={errors?.salePrice && errors?.salePrice.message}
          onChange={handleTextChange}
          value={getValues('salePrice') || ''}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          name="idStore"
          selectedValue={comboValues.idStore}
          placeholder={Contents[language]?.ReceptionPlace}
          error={!!errors?.idStore}
          errorText={errors?.idStore && errors?.idStore.message}
          onSelect={handleComboChange}
          url={Endpoints.Stores}
        />
        <Separator />
        <AutocompleteSelect
          name="idGender"
          placeholder={Contents[language]?.Gender}
          selectedValue={comboValues.idGender}
          error={!!errors?.idGender}
          errorText={errors?.idGender && errors?.idGender.message}
          onSelect={handleComboChange}
          url={Endpoints.Genders}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          inputType="number"
          name="quantity"
          label={Contents[language]?.Quantity}
          error={!!errors?.quantity}
          errorText={errors?.quantity && errors?.quantity.message}
          onChange={handleTextChange}
          value={getValues('quantity') || ''}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="description"
          label={Contents[language]?.Description}
          error={!!errors?.description}
          errorText={errors?.description && errors?.description.message}
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
