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
  EXT_PHONE_VALIDATION,
  NAME_VALIDATION,
  TITLE_VALIDATION,
  PHONE_VALIDATION,
  industrySpecialtyOptionLabel,
  titleOptionLabel,
  idOptionSelected
} from 'UI/utils';
import type { Map } from 'types';
import InputContainer from 'UI/components/atoms/InputContainer';

type HiringAuthorityCreateFormProps = {
  initialValues: Map
};

const chainedSelects = {
  specialty_id: ['subspecialty_id', 'position_id']
};

const HiringAuthorityForm = (props: HiringAuthorityCreateFormProps) => {
  const { initialValues } = props;

  const [comboValues, setComboValues] = useState<Map>(initialValues);
  const [hasSubspecialties, setHasSubspecialties] = useState(false);

  const { register, errors, setValue, getValues } = useFormContext();

  useEffect(() => {
    setValue('specialty', comboValues.specialty_id);
    setValue('subspecialty', comboValues.subspecialty_id);
    setValue('position', comboValues.position_id);
  }, [comboValues, setValue]);

  useEffect(() => {
    if (hasSubspecialties) {
      register({ name: 'subspecialty_id' }, { required: 'Subspecialty is required' });
    } else {
      register({ name: 'subspecialty_id' });
      setValue('subspecialty_id', null, { shouldValidate: true, shouldDirty: true });
    }
  }, [register, hasSubspecialties, setValue]);

  useEffect(() => {
    register({ name: 'specialty' });
    register({ name: 'subspecialty' });
    register({ name: 'position' });

    register({ name: 'specialty_id' }, { required: 'Industry: Specialty is required' });
    register({ name: 'position_id' }, { required: 'Functional title is required' });
    register({ name: 'work_phone' }, { required: 'Phone is required', ...PHONE_VALIDATION });
    register({ name: 'personal_phone' }, { ...PHONE_VALIDATION });
  }, [register]);

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

  const handlePhoneChange = (name?: string, value: any) => {
    setValue(name, value, true);
    setComboValues({ ...comboValues }); // TODO check to force a render as form hook doest not fire a render
  };

  return (
    <Box display="flex" flexWrap="wrap" maxWidth={1360} width="100%">
      <InputContainer>
        <TextBox
          name="first_name"
          label="First Name *"
          inputRef={register({ required: 'First Name is required', ...NAME_VALIDATION })}
          error={!!errors.first_name}
          errorText={errors.first_name && errors.first_name.message}
          minWidth={minWidthTextBox}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="last_name"
          label="Last Name *"
          inputRef={register({ required: 'Last Name is required', ...NAME_VALIDATION })}
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
          getOptionLabel={industrySpecialtyOptionLabel}
          renderOption={titleOptionLabel}
          getOptionSelected={idOptionSelected}
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
          inputRef={register({ required: 'Title is required', ...TITLE_VALIDATION })}
          error={!!errors.title}
          errorText={errors.title && errors.title.message}
          minWidth={minWidthTextBox}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="work_email"
          label="Email *"
          inputRef={register({
            required: 'Email is required',
            pattern: {
              value: VALIDATION_REGEXS.EMAIL,
              message: 'Email must be valid'
            }
          })}
          error={!!errors.work_email}
          errorText={errors.work_email && errors.work_email.message}
          minWidth={minWidthTextBox}
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="work_phone"
          label="Phone *"
          placeholder="(999)-999-9999"
          error={!!errors.work_phone}
          errorText={errors.work_phone && errors.work_phone.message}
          minWidth={minWidthTextBox}
          onChange={handlePhoneChange}
          value={getValues('work_phone') || ''}
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
          error={!!errors.other_ext}
          errorText={errors.other_ext && errors.other_ext.message}
          minWidth={minWidthTextBox}
        />
      </InputContainer>

      <InputContainer>
        <TextBox
          name="personal_email"
          label="Other Email"
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
          name="personal_phone"
          label="Other Phone"
          placeholder="(999)-999-9999"
          error={!!errors.personal_phone}
          errorText={errors.personal_phone && errors.personal_phone.message}
          minWidth={minWidthTextBox}
          onChange={handlePhoneChange}
          value={getValues('personal_phone') || ''}
          inputType="phone"
        />
      </InputContainer>
      <InputContainer>
        <TextBox
          name="other_ext"
          label="Ext"
          inputType="number"
          placeholder="999"
          inputRef={register({ ...EXT_PHONE_VALIDATION })}
          error={!!errors.ext}
          errorText={errors.ext && errors.ext.message}
          minWidth={minWidthTextBox}
        />
      </InputContainer>
      {/* <input ref={register()} type="hidden" /> */}
    </Box>
  );
};

HiringAuthorityForm.defaultProps = {
  initialValues: {}
};

export default HiringAuthorityForm;
