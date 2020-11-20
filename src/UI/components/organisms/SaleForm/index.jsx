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

type SaleFormProps = {
  initialValues: MapType
};

const SaleForm = (props: SaleFormProps) => {
  const { initialValues } = props;
  const language = localStorage.getItem('language');

  const [comboValues, setComboValues] = useState<MapType>(initialValues);

  const { register, errors, setValue, getValues } = useFormContext();

  useEffect(() => {
    register({ name: 'idType' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'idCharacteristic' }, { required: ` ${Contents[language]?.RequiredMessage}` });
    register({ name: 'color' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'idProvider' }, { required: `${Contents[language]?.RequiredMessage}` });
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
      <AutocompleteSelect
        name="idType"
        selectedValue={comboValues.idType}
        placeholder={Contents[language]?.ProductType}
        error={!!errors?.idType}
        errorText={errors?.idType && errors?.idType?.message}
        onSelect={handleComboChange}
        url={Endpoints.Types}
      />
      <AutocompleteSelect
        name="color"
        selectedValue={comboValues.color}
        placeholder={Contents[language]?.Color}
        error={!!errors?.color}
        errorText={errors?.color && errors?.color.message}
        onSelect={handleComboChange}
        url={Endpoints.Colors}
      />
      <AutocompleteSelect
        name="idProvider"
        selectedValue={comboValues.idProvider}
        placeholder={Contents[language]?.Provider}
        error={!!errors?.idProvider}
        errorText={errors?.idProvider && errors?.idProvider.message}
        onSelect={handleComboChange}
        url={Endpoints.Provider}
      />
      <AutocompleteSelect
        name="idProvider"
        selectedValue={comboValues.idProvider}
        placeholder={Contents[language]?.Provider}
        error={!!errors?.idProvider}
        errorText={errors?.idProvider && errors?.idProvider.message}
        onSelect={handleComboChange}
        url={Endpoints.Provider}
      />
    </Box>
  );
};

SaleForm.defaultProps = {
  initialValues: {}
};

export default SaleForm;
