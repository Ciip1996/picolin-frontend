// @flow
import React, { useState, useEffect, useRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import styled from 'styled-components';

import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';

import FormControlLabel from '@material-ui/core/FormControlLabel';

import TextBox from 'UI/components/atoms/TextBox';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { Endpoints } from 'UI/constants/endpoints';

import { PRODUCT_DESCRIPTION_VALIDATION, normalizeStrToNFD } from 'UI/utils';
import type { MapType } from 'types';
import InputContainer from 'UI/components/atoms/InputContainer';

import Contents from './strings';

export const UpperCaseTextBox = styled(TextBox)`
  input {
    text-transform: uppercase;
  }
`;

type ProductNameFormProps = {
  initialComboValues: MapType,
  showStatus: boolean,
  showId: boolean
};

const Separator = () => <span style={{ width: 20 }} />;

const ProductNameForm = (props: ProductNameFormProps) => {
  const { initialComboValues, showStatus, showId } = props;
  const language = localStorage.getItem('language');

  const [comboValues, setComboValues] = useState<MapType>(initialComboValues);

  const { register, errors, setValue, getValues, control } = useFormContext();

  useEffect(() => {
    register(
      { name: 'idProvider' },
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
    if (name === 'name') {
      setValue(name, normalizeStrToNFD(value || ''), true);
    } else setValue(name, value, true);
    setComboValues({ ...comboValues });
  };

  const inputRef = useRef();

  return (
    <Box display="flex" flexWrap="wrap" maxWidth={1360} width="100%">
      <InputContainer>
        {showId && (
          <>
            <Controller
              as={
                <TextBox
                  inputType="text"
                  name="idName"
                  InputProps={{
                    readOnly: true
                  }}
                  inputRef={inputRef}
                  label="ID"
                  variant="outlined"
                />
              }
              name="idName"
              onFocus={() => inputRef.current.focus()}
              control={control}
              rules={{ required: true }}
            />
          </>
        )}
        <Separator />
        <UpperCaseTextBox
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
          style={{
            height: '100%',
            display: showStatus ? 'inherit' : 'none'
          }}
          control={
            <Controller
              as={<Switch inputRef={inputRef} color="primary" />}
              name="status"
              onFocus={() => inputRef.current.focus()}
              control={control}
              rules={{ required: false }}
              style={{ height: '100%' }}
            />
          }
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
  initialComboValues: {},
  showStatus: false,
  showId: false
};

export default ProductNameForm;
