// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import TextBox from 'UI/components/atoms/TextBox';
import InputContainer from 'UI/components/atoms/InputContainer';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { minWidthTextBox } from 'UI/constants/dimensions';
import { Endpoints } from 'UI/constants/endpoints';
import {
  PHONE_VALIDATION,
  VALIDATION_REGEXS,
  EXT_PHONE_VALIDATION,
  TITLE_VALIDATION,
  URL_VALIDATION,
  industrySpecialtyOptionLabel,
  titleOptionLabel,
  idOptionSelected
} from 'UI/utils';
import type { Map } from 'types';

const chainedSelects = {
  specialty_id: ['subspecialty_id'],
  state_id: ['city_id', 'zip']
};

type CompanyFormProps = {
  initialValues: Map
};

const CompanyForm = (props: CompanyFormProps) => {
  const { initialValues } = props;

  const [comboValues, setComboValues] = useState<Map>(initialValues);
  const [hasSubspecialties, setHasSubspecialties] = useState(false);
  const { register, errors, setValue, getValues } = useFormContext();

  useEffect(() => {
    setValue('specialty', comboValues.specialty_id);
    setValue('subspecialty', comboValues.subspecialty_id);
  }, [comboValues, setValue]);

  useEffect(() => {
    register({ name: 'specialty' });
    register({ name: 'subspecialty' });

    register({ name: 'specialty_id' }, { required: 'Industry: Specialty is required' });
    register({ name: 'state_id' }, { required: 'State is required' });
    register({ name: 'city_id' }, { required: 'City is required' });
    register({ name: 'zip' }, { required: 'Zip code is required' });
    register({ name: 'phone' }, { required: 'Phone is required', ...PHONE_VALIDATION });
  }, [register]);

  useEffect(() => {
    if (hasSubspecialties) {
      register({ name: 'subspecialty_id' }, { required: 'Subspecialty is required' });
    } else {
      register({ name: 'subspecialty_id' });
    }
  }, [register, hasSubspecialties]);

  const handlePhoneChange = (name?: string, value: any) => {
    setValue(name, value, true);
    setComboValues({ ...comboValues }); // TODO check to force a render as form hook doest not fire a render
  };

  const handleComboChange = (name?: string, value: any) => {
    setComboValues((prevState: Map): Map => ({ ...prevState, [name]: value }));
    setValue(name, value ? value.id : value, true);

    if (name && chainedSelects[name]) {
      chainedSelects[name].forEach(chainedSelect => {
        setComboValues((prevState: Map): Map => ({ ...prevState, [chainedSelect]: null }));
        setValue(chainedSelect, null);
      });
    }
  };

  const handleSubspecialtiesLoaded = useCallback((options?: any[]) => {
    setHasSubspecialties(options && options.length);
  }, []);

  return (
    <Box display="flex" flexWrap="wrap" maxWidth={1360} width="100%">
      <InputContainer>
        <TextBox
          name="name"
          label="Company Name *"
          inputRef={register({ required: 'Company Name is required', ...TITLE_VALIDATION })}
          error={!!errors.name}
          errorText={errors.name && errors.name.message}
          width="100%"
          minWidth={minWidthTextBox}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          name="specialty_id"
          selectedValue={comboValues.specialty_id}
          placeholder="Industry: Specialty *"
          error={!!errors.specialty_id}
          errorText={errors.specialty_id && errors.specialty_id.message}
          url={Endpoints.Specialties}
          groupBy={option => option.industry_title}
          getOptionLabel={industrySpecialtyOptionLabel}
          renderOption={titleOptionLabel}
          getOptionSelected={idOptionSelected}
          onSelect={handleComboChange}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          width="100%"
          name="subspecialty_id"
          selectedValue={comboValues.subspecialty_id}
          placeholder={`Subspecialty ${hasSubspecialties ? '*' : ''}`}
          error={!!errors.subspecialty_id}
          errorText={errors.subspecialty_id && errors.subspecialty_id.message}
          url={
            comboValues.specialty_id
              ? `${Endpoints.Specialties}/${comboValues.specialty_id.id}/subspecialties`
              : ''
          }
          onSelect={handleComboChange}
          onOptionsLoaded={handleSubspecialtiesLoaded}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          width="100%"
          name="state_id"
          selectedValue={comboValues.state_id}
          placeholder="State *"
          error={!!errors.state_id}
          errorText={errors.state_id && errors.state_id.message}
          url={Endpoints.States}
          onSelect={handleComboChange}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          width="100%"
          name="city_id"
          placeholder="City *"
          error={!!errors.city_id}
          errorText={errors.city_id && errors.city_id.message}
          url={comboValues.state_id ? `${Endpoints.Cities}?stateId=${comboValues.state_id.id}` : ''}
          selectedValue={comboValues.city_id}
          onSelect={handleComboChange}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          width="100%"
          name="zip"
          placeholder="Zip Code *"
          error={!!errors.zip}
          errorText={errors.zip && errors.zip.message}
          url={
            comboValues.city_id
              ? `${Endpoints.Cities}/${comboValues.city_id.id}/${Endpoints.Zips}`
              : ''
          }
          selectedValue={comboValues.zip}
          onSelect={handleComboChange}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="phone"
          label="Phone *"
          placeholder="(999)-999-9999"
          error={!!errors.phone}
          errorText={errors.phone && errors.phone.message}
          minWidth={minWidthTextBox}
          onChange={handlePhoneChange}
          value={getValues('phone') || ''}
          inputType="phone"
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="ext"
          label="Ext"
          inputType="number"
          placeholder="999"
          inputRef={register({ ...EXT_PHONE_VALIDATION })}
          error={!!errors.ext}
          errorText={errors.ext && errors.ext.message}
          minWidth={minWidthTextBox}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="email"
          label="Email"
          inputRef={register({
            pattern: {
              value: VALIDATION_REGEXS.EMAIL,
              message: 'Email must be valid'
            }
          })}
          error={!!errors.email}
          errorText={errors.email && errors.email.message}
          minWidth={minWidthTextBox}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="address"
          label="Address *"
          inputRef={register({
            required: 'Address is required',
            maxLength: {
              value: 250,
              message: `Max length is 250`
            }
          })}
          error={!!errors.address}
          errorText={errors.address && errors.address.message}
          minWidth={minWidthTextBox}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="website"
          label="Website"
          inputRef={register(URL_VALIDATION)}
          error={!!errors.website}
          errorText={errors.website && errors.website.message}
          minWidth={minWidthTextBox}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="link_profile"
          label="Linkedin URL"
          inputRef={register(URL_VALIDATION)}
          error={!!errors.link_profile}
          errorText={errors.link_profile && errors.link_profile.message}
          minWidth={minWidthTextBox}
        />
      </InputContainer>
    </Box>
  );
};

CompanyForm.defaultProps = {
  initialValues: {}
};

export default CompanyForm;
