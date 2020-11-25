// @flow
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@material-ui/core/Box';

// import TextBox from 'UI/components/atoms/TextBox';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { Endpoints } from 'UI/constants/endpoints';

// import { PRODUCT_DESCRIPTION_VALIDATION } from 'UI/utils';
import type { MapType } from 'types';
import InputContainer from 'UI/components/atoms/InputContainer';

import Contents from './strings';
// import { useStyles } from './styles';

type SaleFormProps = {
  initialValues: MapType
};

const SaleForm = (props: SaleFormProps) => {
  const { initialValues } = props;
  const language = localStorage.getItem('language');
  // const classes = useStyles();
  const [comboValues, setComboValues] = useState<MapType>(initialValues);

  const { register, errors, setValue, getValues } = useFormContext();

  useEffect(() => {
    register({ name: 'diaperRacks' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'footwear' }, { required: `${Contents[language]?.RequiredMessage}` });
    register({ name: 'Sabana' }, { required: `${Contents[language]?.RequiredMessage}` });
    // register({ name: 'Ajuar' }, { ...PRODUCT_DESCRIPTION_VALIDATION });
  }, [language, register]);

  const [form, setDiaperRacks] = useState({ DiaperRacks: '', footwear: '', Sabana: '', Ajuar: '' });

  const searchingProductsUrl = `${Endpoints.Inventory}${Endpoints.GetInventory}`.replace(
    ':idStore',
    '1'
  );

  const handleComboChange = (name: string, value: any) => {
    setComboValues((prevState: MapType): MapType => ({ ...prevState, [name]: value }));
    setValue(name, value?.id ? value?.id : value?.title, true);
  };

  return (
    <Box display="flex" flexWrap="wrap" maxWidth={1360} width="100%">
      <InputContainer>
        <AutocompleteSelect
          name="diaperRacks"
          selectedValue={comboValues.diaperRacks}
          value={form.DiaperRacks}
          // onSelect={e => setDiaperRacks({ ...form, DiaperRacks: e.target.value })}
          placeholder={Contents[language]?.diaperRacks}
          error={!!errors?.diaperRacks}
          errorText={errors?.diaperRacks && errors?.diaperRacks?.message}
          onSelect={handleComboChange}
          url={Endpoints.Types}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          // name="footwear" // TODO: Check the real translation os this word
          // selectedValue={comboValues.footwear}

          type="text"
          value={form.footwear}
          onChange={e => setDiaperRacks({ ...form, footwear: e.target.value })}
          placeholder={Contents[language]?.footwear}
          error={!!errors?.footwear}
          errorText={errors?.footwear && errors?.footwear.message}
          // defaultOptions={footwear}
          // onSelect={handleComboChange}
          // url={Endpoints.Types}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          // name="Sabana" // TODO: Check the real translation os this word
          // selectedValue={comboValues.Sabana}

          type="text"
          value={form.Sabana}
          onChange={e => setDiaperRacks({ ...form, Sabana: e.target.value })}
          placeholder={Contents[language]?.Sabana}
          error={!!errors?.Sabana}
          errorText={errors?.Sabana && errors?.Sabana.message}
          // defaultOptions={Sabana}
          // onSelect={handleComboChange}
          // url={Endpoints.Types}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          // name="Ajuar" // TODO: Check the real translation of this word too
          // selectedValue={comboValues.Ajuar}

          type="text"
          value={form.Ajuar}
          onChange={e => setDiaperRacks({ ...form, Ajuar: e.target.value })}
          placeholder={Contents[language]?.Ajuar}
          error={!!errors?.Ajuar}
          errorText={errors?.Ajuar && errors?.Ajuar.message}
          // defaultOptions={Ajuar}
          // onSelect={handleComboChange}
          // url={Endpoints.Types}
        />
      </InputContainer>
    </Box>
  );
};

SaleForm.defaultProps = {
  initialValues: {}
};

export default SaleForm;
