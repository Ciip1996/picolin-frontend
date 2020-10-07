// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@material-ui/core/Box';

import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { Endpoints } from 'UI/constants/endpoints';
import type { Map } from 'types';
import { EntityType } from 'UI/constants/entityTypes';
import { globalStyles } from 'GlobalStyles';

type HiringAuthorityCreateFormProps = {
  joborderId: number,
  type: 'company' | 'joborder'
};

const chainedSelects = {
  hiring_authority_id: ['specialty_id', 'subspecialty_id', 'position_id'],
  specialty_id: ['subspecialty_id', 'position_id']
};

const HiringAuthoritySelectForm = (props: HiringAuthorityCreateFormProps) => {
  const { joborderId, type } = props;

  const [comboValues, setComboValues] = useState<Map>({});
  const [hasSubspecialties, setHasSubspecialties] = useState(false);

  const { register, unregister, errors, reset, setValue, clearError } = useFormContext();

  useEffect(() => {
    reset({
      specialty_id: null,
      subspecialty_id: null,
      position_id: null
    });
  }, [reset]);

  useEffect(() => {
    setValue('specialty', comboValues.specialty_id);
    setValue('subspecialty', comboValues.subspecialty_id);
    setValue('position', comboValues.position_id);
  }, [comboValues, setValue]);

  useEffect(() => {
    register({ name: 'hiring_authority_id' }, { required: 'Hiring Authority is required' });
    register({ name: 'existingHiringAuthority' });
  }, [register]);

  useEffect(() => {
    if (hasSubspecialties) {
      register({ name: 'subspecialty_id' }, { required: 'Subspecialty is required' });
    } else {
      register({ name: 'subspecialty_id' });
    }
  }, [register, hasSubspecialties]);

  useEffect(() => {
    if (!comboValues.hiring_authority_id?.specialty_id) {
      register({ name: 'specialty' });
      register({ name: 'subspecialty' });
      register({ name: 'position' });

      register({ name: 'specialty_id' }, { required: 'Industry: Specialty is required' });
      register({ name: 'position_id' }, { required: 'Functional title is required' });
    } else {
      unregister('specialty_id');
      unregister('subspecialty_id');
      unregister('position_id');
    }
  }, [register, unregister, comboValues.hiring_authority_id]);

  const handleComboChange = (name?: string, value: any) => {
    setComboValues((prevState: Map): Map => ({ ...prevState, [name]: value }));
    setValue(name, value ? value.id : value, true);

    if (name && chainedSelects[name]) {
      chainedSelects[name].forEach(chainedSelect => {
        setComboValues((prevState: Map): Map => ({ ...prevState, [chainedSelect]: null }));
        setValue(chainedSelect, null);
        clearError(chainedSelect);
      });
    }
  };

  const handleHASelect = (name?: string, value: any) => {
    setValue('existingHiringAuthority', value);
    handleComboChange(name, value);
  };

  const handleSubspecialtiesLoaded = useCallback((options?: any[]) => {
    setHasSubspecialties(options && options.length);
  }, []);

  const hiringAuthorityComboProps =
    type === EntityType.Joborder
      ? {
          placeholder: 'Hiring Authority *',
          url: `${Endpoints.JobOrders}/${joborderId}/${Endpoints.AvailableHiringAuthorities}`,
          noOptionsText: 'No hiring authorities found for this joborder',
          onSelect: handleComboChange,
          getOptionLabel: option => option.full_name
        }
      : {
          placeholder: 'Search a Hiring Authority by name or email *',
          url: `${Endpoints.Search}`,
          displayKey: 'full_name',
          typeahead: true,
          typeaheadLimit: 20,
          typeaheadParams: {
            entityType: EntityType.HiringAuthority,
            inColumns: ['ha.work_email']
          },
          onSelect: handleHASelect,
          renderOption: option => (
            <div>
              <strong>{option.full_name}</strong>
              <br />
              <span>{option.subtitle}</span>
            </div>
          )
        };

  return (
    <Box style={globalStyles.inputMinSpacing}>
      <Box>
        <AutocompleteSelect
          name="hiring_authority_id"
          selectedValue={comboValues.hiring_authority_id}
          error={!!errors.hiring_authority_id}
          errorText={errors.hiring_authority_id && errors.hiring_authority_id.message}
          {...hiringAuthorityComboProps}
        />
      </Box>
      {comboValues.hiring_authority_id && !comboValues.hiring_authority_id.specialty_id && (
        <>
          <p>Register the required data to add this Hiring Authority</p>
          <Box mt={4}>
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
          </Box>
          <Box mt={4}>
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
          </Box>
          <Box mt={4}>
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
          </Box>
        </>
      )}
    </Box>
  );
};

HiringAuthoritySelectForm.defaultProps = {
  joborderId: null
};

export default HiringAuthoritySelectForm;
