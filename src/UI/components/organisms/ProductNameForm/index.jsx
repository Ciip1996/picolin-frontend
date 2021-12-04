// @flow
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import TextBox from 'UI/components/atoms/TextBox';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { Endpoints } from 'UI/constants/endpoints';

import { PRODUCT_DESCRIPTION_VALIDATION } from 'UI/utils';
import type { MapType } from 'types';
import InputContainer from 'UI/components/atoms/InputContainer';

import Contents from './strings';

type ProductNameFormProps = {
  initialValues: MapType
};

const Separator = () => <span style={{ width: 20 }} />;

const ProductNameForm = (props: ProductNameFormProps) => {
  const { initialValues } = props;
  const language = localStorage.getItem('language');

  const [comboValues, setComboValues] = useState<MapType>(initialValues);

  const { register, errors, setValue, getValues } = useFormContext();

  useEffect(() => {
    register(
      { name: 'idProvider' },
      { required: `${Contents[language]?.RequiredMessage}` }
    );
    register(
      { name: 'status' },
      { required: `${Contents[language]?.RequiredMessage}` }
    );
    register({ name: 'name' }, { ...PRODUCT_DESCRIPTION_VALIDATION });
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
    const isStatusChecked = event.target.checked;
    setValue('status', isStatusChecked, true);
  };

  return (
    <Box display="flex" flexWrap="wrap" maxWidth={1360} width="100%">
      <InputContainer>
        <TextBox
          inputType="text"
          name="name"
          label={Contents[language]?.Name}
          error={!!errors?.name}
          errorText={errors?.name && errors?.name.message}
          onChange={handleTextChange}
          value={getValues('name') || ''}
        />
      </InputContainer>
      <InputContainer>
        <FormControlLabel
          name="status"
          style={{ height: '100%' }}
          control={<Switch color="primary" />}
          onChange={onSwitcherChange}
          label={Contents[language]?.Status}
          labelPlacement="start"
          error={!!errors.status}
          helperText={errors.status && errors.status.message}
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
    </Box>
  );
};

ProductNameForm.defaultProps = {
  initialValues: {}
};

export default ProductNameForm;
