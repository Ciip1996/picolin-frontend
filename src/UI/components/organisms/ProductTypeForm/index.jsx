// @flow
import React, { useEffect, useRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextBox from 'UI/components/atoms/TextBox';
import { useLanguage } from 'UI/utils';

import InputContainer from 'UI/components/atoms/InputContainer';
import Contents from './strings';

export const UpperCaseTextBox = styled(TextBox)`
  input {
    text-transform: uppercase;
  }
`;

type ProducttypeFormProps = {
  showStatus: boolean,
  showId: boolean
};

const Separator = () => <span style={{ width: 20 }} />;

const ProductTypeForm = (props: ProducttypeFormProps) => {
  const { showStatus, showId } = props;
  const language = useLanguage();

  const { register, errors, setValue, getValues, control } = useFormContext();

  useEffect(() => {
    register({ name: 'type' }, { required: 'required message' });
  }, [language, register]);

  const handleTextChange = (name?: string, value: string) => {
    setValue(name, value || '', false);
  };

  const values = getValues();

  const inputRef = useRef(null);

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
              onFocus={() =>
                inputRef.current instanceof HTMLInputElement &&
                inputRef.current.focus()
              }
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
          error={!!errors?.type}
          errorText={errors?.type && errors?.type.message}
          onChange={handleTextChange}
          value={getValues('type') || ''}
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
              onFocus={() =>
                inputRef.current instanceof HTMLInputElement &&
                inputRef.current.focus()
              }
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
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <pre>
          <p>Errors:</p>
          {JSON.stringify(errors, null, '\t')}
        </pre>
        <pre>
          <p>Values:</p>
          {JSON.stringify(values, null, '\t')}
        </pre>
      </div>
    </Box>
  );
};

ProductTypeForm.defaultProps = {
  showStatus: false,
  showId: false
};

export default ProductTypeForm;
