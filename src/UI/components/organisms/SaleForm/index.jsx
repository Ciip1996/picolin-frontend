// @flow
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { Endpoints } from 'UI/constants/endpoints';
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

  console.log(getValues());

  useEffect(() => {
    register({ name: 'diaperRacks' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'footwear' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'blanket' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'ajuar' }, { required: `${Contents[language]?.RequiredMessage}` });
  }, [language, register]);

  const searchingProductsUrl = `${Endpoints.Inventory}${Endpoints.GetInventory}`.replace(
    ':idStore',
    '1'
  );

  const handleComboChange = (name: string, value: any) => {
    setComboValues((prevState: MapType): MapType => ({ ...prevState, [name]: value }));
    setValue(name, value?.productCode ? value?.productCode : value, true);
  };

  const defaultOptionSelectedFn = (option, value) => option.id === value.id;

  return (
    <Box display="flex" flexWrap="wrap" maxWidth={1360} width="100%">
      <InputContainer>
        <AutocompleteSelect
          name="diaperRacks"
          selectedValue={comboValues.diaperRacks}
          placeholder={Contents[language]?.diaperRacks}
          url={searchingProductsUrl}
          displayKey="productCode"
          typeahead
          typeaheadLimit={15}
          onSelect={handleComboChange}
          getOptionSelected={defaultOptionSelectedFn}
          dataFetchKeyName="inventory"
          error={!!errors?.diaperRacks}
          errorText={errors?.diaperRacks && errors?.diaperRacks.message}
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
      <InputContainer>
        <AutocompleteSelect
          name="footwear"
          selectedValue={comboValues.footwear}
          placeholder={Contents[language]?.footwear}
          url={searchingProductsUrl}
          displayKey="productCode"
          typeahead
          typeaheadLimit={15}
          onSelect={handleComboChange}
          getOptionSelected={defaultOptionSelectedFn}
          dataFetchKeyName="inventory"
          error={!!errors?.footwear}
          errorText={errors?.footwear && errors?.footwear.message}
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
      <InputContainer>
        <AutocompleteSelect
          name="blanket"
          selectedValue={comboValues.blanket}
          placeholder={Contents[language]?.blanket}
          url={searchingProductsUrl}
          displayKey="productCode"
          typeahead
          typeaheadLimit={15}
          onSelect={handleComboChange}
          getOptionSelected={defaultOptionSelectedFn}
          dataFetchKeyName="inventory"
          error={!!errors?.blanket}
          errorText={errors?.blanket && errors?.blanket.message}
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
      <InputContainer>
        <AutocompleteSelect
          name="ajuar"
          selectedValue={comboValues.ajuar}
          placeholder={Contents[language]?.ajuar}
          url={searchingProductsUrl}
          displayKey="productCode"
          typeahead
          typeaheadLimit={15}
          onSelect={handleComboChange}
          getOptionSelected={defaultOptionSelectedFn}
          dataFetchKeyName="inventory"
          error={!!errors?.ajuar}
          errorText={errors?.ajuar && errors?.ajuar.message}
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
    </Box>
  );
};

SaleForm.defaultProps = {
  initialValues: {}
};

export default SaleForm;
