// @flow
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import TextBox from 'UI/components/atoms/TextBox';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { Endpoints } from 'UI/constants/endpoints';

import {
  PRODUCT_DESCRIPTION_VALIDATION,
  OBSERVATIONS_VALIDATION,
  PRODUCT_SIZE_VALIDATION
} from 'UI/utils';
import type { MapType } from 'types';
import InputContainer from 'UI/components/atoms/InputContainer';

import Contents from './strings';

type ProductFormProps = {
  initialComboValues: MapType
};

const Separator = () => <span style={{ width: 20 }} />;

const ProductForm = (props: ProductFormProps) => {
  const { initialComboValues } = props;
  const language = localStorage.getItem('language');

  const [comboValues, setComboValues] = useState<MapType>(initialComboValues);
  const [isSizeNumeric, setIsSizeNumeric] = useState(true);

  const {
    register,
    errors,
    setValue,
    getValues,
    unregister
  } = useFormContext();

  useEffect(() => {
    register(
      { name: 'idType' },
      { required: `${Contents[language]?.RequiredMessage}` }
    );
    register(
      { name: 'idMaterial' },
      { required: ` ${Contents[language]?.RequiredMessage}` }
    );
    register(
      { name: 'idColor' },
      { required: `${Contents[language]?.RequiredMessage}` }
    );
    register({ name: 'size' });
    register(
      { name: 'pieces' },
      { required: `${Contents[language]?.RequiredMessage}` }
    );
    register(
      { name: 'cost' },
      { required: `${Contents[language]?.RequiredMessage}` }
    );
    register(
      { name: 'salePrice' },
      { required: `${Contents[language]?.RequiredMessage}` }
    );
    register(
      { name: 'idGender' },
      { required: `${Contents[language]?.RequiredMessage}` }
    );
    register({ name: 'name' }, { ...PRODUCT_DESCRIPTION_VALIDATION });
    register({ name: 'observations' }, { ...OBSERVATIONS_VALIDATION });
  }, [language, register]);

  const handleComboChange = (name: string, value: any) => {
    setComboValues((prevState: MapType): MapType => ({
      ...prevState,
      [name]: value
    }));
    setValue(name, value?.id ? value?.id : value?.title, true);
  };

  const handleTextChange = (name?: string, value: any) => {
    setValue(name, value, true);
    setComboValues({ ...comboValues });
  };

  const onSwitcherChange = (event: Object) => {
    const isNumericSize = event.target.checked;
    setValue('size', null, true);
    setIsSizeNumeric(isNumericSize);
  };

  useEffect(() => {
    if (isSizeNumeric) {
      unregister('size');
      register(
        { name: 'size' },
        {
          ...PRODUCT_SIZE_VALIDATION
        }
      );
    } else {
      unregister('size');
      register(
        { name: 'size' },
        {
          required: `${Contents[language]?.RequiredMessage}`
        }
      );
    }
  }, [isSizeNumeric, language, register, unregister]);

  return (
    <Box display="flex" flexWrap="wrap" maxWidth={1360} width="100%" mb={10}>
      <InputContainer>
        <AutocompleteSelect
          noOptionsText="No se existe este nombre, solicite al administrador que lo agregue."
          name="name"
          displayKey="name_with_provider"
          selectedValue={comboValues.name}
          placeholder={Contents[language]?.Name}
          error={!!errors?.name}
          errorText={errors?.name && errors?.name?.message}
          onSelect={handleComboChange}
          url={Endpoints.GetNames}
          autoFocus
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          name="idType"
          selectedValue={comboValues.idType}
          placeholder={Contents[language]?.ProductType}
          error={!!errors?.idType}
          errorText={errors?.idType && errors?.idType?.message}
          onSelect={handleComboChange}
          url={Endpoints.GetTypes}
          autoFocus
        />
        <Separator />
        <AutocompleteSelect
          name="idMaterial"
          selectedValue={comboValues.idMaterial}
          placeholder={Contents[language]?.Material}
          error={!!errors?.idMaterial}
          errorText={errors?.idMaterial && errors?.idMaterial.message}
          onSelect={handleComboChange}
          url={Endpoints.Materials}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          name="idGender"
          placeholder={Contents[language]?.Gender}
          selectedValue={comboValues.idGender}
          error={!!errors?.idGender}
          errorText={errors?.idGender && errors?.idGender.message}
          onSelect={handleComboChange}
          url={Endpoints.Genders}
        />

        <Separator />
        <AutocompleteSelect
          name="idColor"
          selectedValue={comboValues.idColor}
          placeholder={Contents[language]?.Color}
          error={!!errors?.idColor}
          errorText={errors?.idColor && errors?.idColor.message}
          onSelect={handleComboChange}
          url={Endpoints.Colors}
        />
      </InputContainer>
      <InputContainer>
        <FormControlLabel
          name="isSizeNumeric"
          style={{ height: '100%' }}
          control={<Switch color="primary" />}
          onChange={onSwitcherChange}
          label={Contents[language]?.NumericSize}
          labelPlacement="start"
          checked={isSizeNumeric}
        />
        <Separator />
        {isSizeNumeric ? (
          <TextBox
            inputType="number"
            name="size"
            label={Contents[language]?.Size}
            error={!!errors?.size}
            errorText={errors?.size && errors?.size.message}
            onChange={handleTextChange}
            value={getValues('size') || ''}
          />
        ) : (
          <AutocompleteSelect
            name="size"
            displayKey="title"
            selectedValue={comboValues.size}
            placeholder={Contents[language]?.Size}
            error={!!errors?.size}
            errorText={errors?.size && errors?.size.message}
            onSelect={(name: string, item: any) => {
              setComboValues((prevState: MapType): MapType => ({
                ...prevState,
                [name]: item
              }));
              setValue(name, item?.value, true);
            }}
            options={[
              { id: 0, title: 'Unitalla', value: 'UN' },
              { id: 1, title: 'Chica (CH)', value: 'CH' },
              { id: 2, title: 'Mediana (M)', value: 'M' },
              { id: 3, title: 'Grande (G)', value: 'G' },
              { id: 4, title: 'Extra Grande (XG)', value: 'XG' }
            ]}
          />
        )}

        <Separator />
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
      <InputContainer display="contents">
        <Box display="flex" width="100%">
          <TextBox
            ref={register}
            inputRef={register}
            inputType="number"
            name="pieces"
            label={Contents[language]?.Pieces}
            error={!!errors?.pieces}
            errorText={errors?.pieces && errors?.pieces.message}
            onChange={handleTextChange}
            value={getValues('pieces') || ''}
            helperText={Contents[language]?.PiecesDescription}
          />
        </Box>
      </InputContainer>
      <InputContainer display="contents">
        <TextBox
          inputType="text"
          multiline
          name="observations"
          label={Contents[language]?.Observations}
          error={!!errors?.observations}
          errorText={errors?.observations && errors?.observations.message}
          onChange={handleTextChange}
          value={getValues('observations') || ''}
          helperText={Contents[language]?.ObservationsDesc}
        />
      </InputContainer>
    </Box>
  );
};

ProductForm.defaultProps = {
  initialComboValues: {}
};

export default ProductForm;
