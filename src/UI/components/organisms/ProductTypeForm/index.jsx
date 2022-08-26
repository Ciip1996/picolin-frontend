// @flow
import React, { useState, useEffect, useRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextBox from 'UI/components/atoms/TextBox';
import {
  useLanguage,
  PRODUCT_DESCRIPTION_VALIDATION,
  normalizeStrToNFD
} from 'UI/utils';

import type { MapType } from 'types';
import InputContainer from 'UI/components/atoms/InputContainer';
import Contents from './strings';

export const UpperCaseTextBox = styled(TextBox)`
  input {
    text-transform: uppercase;
  }
`;

type ProducttypeFormProps = {
  initialComboValues: MapType,
  showStatus: boolean,
  showId: boolean
};

const Separator = () => <span style={{ width: 20 }} />;

const ProductTypeForm = (props: ProducttypeFormProps) => {
  const { initialComboValues, showStatus, showId } = props;
  const language = useLanguage();

  const [comboValues, setComboValues] = useState<MapType>(initialComboValues);

  const { register, errors, setValue, getValues, control } = useFormContext();

  useEffect(() => {
    register(
      { name: 'idProvider' },
      { required: `${Contents[language]?.RequiredMessage}` }
    );
    register({ name: 'type' }, { ...PRODUCT_DESCRIPTION_VALIDATION });
  }, [language, register]);

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
                  name="idType"
                  InputProps={{
                    readOnly: true
                  }}
                  inputRef={inputRef}
                  label="ID"
                  variant="outlined"
                />
              }
              name="idType"
              onFocus={() => inputRef.current.focus()}
              control={control}
              rules={{ required: true }}
            />
          </>
        )}
        <Separator />
        <UpperCaseTextBox
          inputType="text"
          name="type"
          label={Contents[language]?.Type}
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
      </InputContainer>
    </Box>
  );
};

ProductTypeForm.defaultProps = {
  initialComboValues: {},
  showStatus: false,
  showId: false
};

export default ProductTypeForm;
