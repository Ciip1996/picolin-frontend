// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@material-ui/core/Box';

import TextBox from 'UI/components/atoms/TextBox';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { minWidthTextBox } from 'UI/constants/dimensions';
import { Endpoints } from 'UI/constants/endpoints';

import {
  VALIDATION_REGEXS,
  PHONE_VALIDATION,
  EXT_PHONE_VALIDATION,
  NAME_VALIDATION,
  TITLE_VALIDATION,
  URL_VALIDATION
} from 'UI/utils';
import type { Map } from 'types';
import InputContainer from 'UI/components/atoms/InputContainer';

type NameFormProps = {
  initialValues: Map
};

const chainedSelects = {
  specialty_id: ['subspecialty_id', 'position_id'],
  state_id: ['city_id', 'zip']
};

const NameForm = (props: NameFormProps) => {
  const { initialValues } = props;

  const [comboValues, setComboValues] = useState<Map>(initialValues);
  const [hasSubspecialties, setHasSubspecialties] = useState(false);

  const { register, errors, setValue, getValues } = useFormContext();

  useEffect(() => {
    register({ name: 'specialty_id' }, { required: 'Industry: Specialty is required' });
    register({ name: 'position_id' }, { required: 'Functional title is required' });
    register({ name: 'state_id' });
    register({ name: 'city_id' });
    register({ name: 'zip' });
    register({ name: 'source_type_id' });
    register({ name: 'name_status_id' });
    register({ name: 'phone' }, { ...PHONE_VALIDATION });
    register({ name: 'mobile' }, { ...PHONE_VALIDATION });
  }, [register]);

  useEffect(() => {
    if (hasSubspecialties) {
      register({ name: 'subspecialty_id' }, { required: 'Subspecialty is required' });
    } else {
      register({ name: 'subspecialty_id' });
    }
  }, [register, hasSubspecialties]);

  const handleComboChange = (name?: string, value: any) => {
    setComboValues((prevState: Map): Map => ({ ...prevState, [name]: value }));
    setValue(name, value ? value.id : value, true);

    if (name && chainedSelects[name]) {
      chainedSelects[name].forEach(chainedSelect => {
        setComboValues((prevState: Map): Map => ({
          ...prevState,
          [chainedSelect]: null
        }));
        setValue(chainedSelect, null);
      });
    }
  };

  const handlePhoneChange = (name?: string, value: any) => {
    setValue(name, value, true);
    setComboValues({ ...comboValues }); // TODO check to force a render as form hook doest not fire a render
  };

  const handleSubspecialtiesLoaded = useCallback((options?: any[]) => {
    setHasSubspecialties(options && options.length);
  }, []);

  const NameTypeId = 0;

  return (
    <Box display="flex" flexWrap="wrap" maxWidth={1360} width="100%">
      <InputContainer>
        <TextBox
          name="first_name"
          label="First Name *"
          inputRef={register({
            required: 'First Name is required',
            ...NAME_VALIDATION
          })}
          error={!!errors.first_name}
          errorText={errors.first_name && errors.first_name.message}
          minWidth={minWidthTextBox}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="last_name"
          label="Last Name *"
          inputRef={register({
            required: 'Last Name is required',
            ...NAME_VALIDATION
          })}
          error={!!errors.last_name}
          errorText={errors.last_name && errors.last_name.message}
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
          onSelect={handleComboChange}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
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
          name="position_id"
          selectedValue={comboValues.position_id}
          placeholder="Functional title *"
          error={!!errors.position_id}
          errorText={errors.position_id && errors.position_id.message}
          url={
            comboValues.specialty_id
              ? `${Endpoints.Positions}?specialtyId=${comboValues.specialty_id.id}`
              : ''
          }
          onSelect={handleComboChange}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="title"
          label="Title *"
          inputRef={register({
            required: 'Title is required',
            ...TITLE_VALIDATION
          })}
          error={!!errors.title}
          errorText={errors.title && errors.title.message}
          minWidth={minWidthTextBox}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          name="name_status_id"
          selectedValue={comboValues.name_status_id}
          placeholder="Status"
          url={Endpoints.NameStatus.replace(':id', NameTypeId)}
          onSelect={handleComboChange}
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
          name="phone"
          label="Phone"
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
        <AutocompleteSelect
          name="state_id"
          selectedValue={comboValues.state_id}
          placeholder="State"
          error={!!errors.state_id}
          errorText={errors.state_id && errors.state_id.message}
          url={Endpoints.States}
          onSelect={handleComboChange}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          name="city_id"
          placeholder="City"
          error={!!errors.city_id}
          errorText={errors.city_id && errors.city_id.message}
          url={
            comboValues?.state_id?.id
              ? `${Endpoints.Cities}?stateId=${comboValues?.state_id?.id}`
              : undefined
          }
          selectedValue={comboValues.city_id}
          onSelect={handleComboChange}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          name="zip"
          placeholder="Zip Code"
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
          name="mobile"
          label="Other phone"
          placeholder="(999)-999-9999"
          error={!!errors.mobile}
          errorText={errors.mobile && errors.mobile.message}
          minWidth={minWidthTextBox}
          onChange={handlePhoneChange}
          value={getValues('mobile') || ''}
          inputType="phone"
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="personal_email"
          label="Other email"
          inputRef={register({
            pattern: {
              value: VALIDATION_REGEXS.EMAIL,
              message: 'Email must be valid'
            }
          })}
          error={!!errors.personal_email}
          errorText={errors.personal_email && errors.personal_email.message}
          minWidth={minWidthTextBox}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="current_company"
          label="Current Company"
          inputRef={register({ ...TITLE_VALIDATION })}
          error={!!errors.current_company}
          errorText={errors.current_company && errors.current_company.message}
          minWidth={minWidthTextBox}
        />
      </InputContainer>
      <InputContainer>
        <AutocompleteSelect
          name="source_type_id"
          selectedValue={comboValues.source_type_id}
          placeholder="Source"
          url={Endpoints.SourceTypes}
          onSelect={handleComboChange}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="link_profile"
          label="Source URL"
          inputRef={register(URL_VALIDATION)}
          error={!!errors.link_profile}
          errorText={errors.link_profile && errors.link_profile.message}
          minWidth={minWidthTextBox}
        />
      </InputContainer>
      <input ref={register()} type="hidden" name="status_id" value="1" />
    </Box>
  );
};

NameForm.defaultProps = {
  initialValues: {}
};

export default NameForm;
