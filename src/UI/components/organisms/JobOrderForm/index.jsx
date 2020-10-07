// @flow
import React, { useState, useEffect, useCallback } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useFormContext } from 'react-hook-form';

import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';

import TextBox from 'UI/components/atoms/TextBox';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { minWidthTextBox } from 'UI/constants/dimensions';
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import {
  URL_VALIDATION,
  TITLE_VALIDATION,
  industrySpecialtyOptionLabel,
  titleOptionLabel,
  idOptionSelected
} from 'UI/utils';
import type { Map } from 'types';
import InputContainer from 'UI/components/atoms/InputContainer';
import { styles, StyledForm } from './styles';

type JobOrderFormProps = {
  onCompanySelect?: (name: any, value: any) => void,
  companyId: number | null,
  initialValues: Map
};

const chainedSelects = {
  specialty_id: ['subspecialty_id', 'position_id'],
  state_id: ['city_id', 'zip']
};

const JobOrderForm = (props: JobOrderFormProps) => {
  const { onCompanySelect, initialValues, companyId } = props;
  const [uiState, setUiState] = useState({
    isLoadingCompany: false
  });

  const [comboValues, setComboValues] = useState<Map>(initialValues);
  const [hasSubspecialties, setHasSubspecialties] = useState(false);

  const { register, unregister, errors, setValue, reset } = useFormContext();
  const [differentLocation, setDifferentLocation] = useState(
    initialValues.different_location === 1
  );

  const currentCompanyId = comboValues?.company_id?.id || companyId;

  useEffect(() => {
    async function getCompany(id) {
      if (!id || !isEmpty(initialValues)) {
        return;
      }
      setUiState(prevState => ({ ...prevState, isLoadingCompany: true }));
      try {
        const response = await API.get(`${Endpoints.Companies}/${id}?excludeListings=true`);
        const company = response.data;
        if (company) {
          reset({
            company_id: id,
            specialty_id: company.specialty?.id,
            subspecialty_id: company.subspecialty?.id
          });
          setComboValues((prevState: Map): Map => ({
            ...prevState,
            company_id: company,
            specialty_id: company.specialty,
            subspecialty_id: company.subspecialty
          }));
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
      setUiState(prevState => ({ ...prevState, isLoadingCompany: false }));
    }

    getCompany(currentCompanyId);
  }, [currentCompanyId, initialValues, reset]);

  useEffect(() => {
    register({ name: 'company_id' }, { required: 'Company is required' });
    register({ name: 'specialty_id' }, { required: 'Industry: Specialty is required' });
    register({ name: 'position_id' }, { required: 'Functional title is required' });
    register({ name: 'different_location' });
    register({ name: 'state_id' }, { required: 'State is required' });
    register({ name: 'city_id' }, { required: 'City is required' });
    register({ name: 'zip' }, { required: 'Zip code is required' });
  }, [register]);

  useEffect(() => {
    if (hasSubspecialties) {
      register({ name: 'subspecialty_id' }, { required: 'Subspecialty is required' });
    } else {
      register({ name: 'subspecialty_id' });
    }
  }, [register, hasSubspecialties]);

  useEffect(() => {
    if (differentLocation) {
      setValue('different_location', 1);
      register({ name: 'state_id' }, { required: 'State is required' });
      register({ name: 'city_id' }, { required: 'City is required' });
      register({ name: 'zip' }, { required: 'Zip is required' });
    } else {
      setValue('different_location', 0);
      unregister('state_id');
      unregister('city_id');
      unregister('zip');
    }
  }, [differentLocation, register, setValue, unregister]);

  const handleComboChange = (name?: string, value: any) => {
    setComboValues((prevState: Map): Map => ({ ...prevState, [name]: value }));
    setValue(name, value ? value.id : value, true);

    if (name && chainedSelects[name]) {
      chainedSelects[name].forEach(chainedSelect => {
        setComboValues((prevState: Map): Map => ({ ...prevState, [chainedSelect]: null }));
        setValue(chainedSelect, null);
      });
    }

    if (name === 'company_id') onCompanySelect && onCompanySelect(name, value);
  };

  const handleSubspecialtiesLoaded = useCallback((options?: any[]) => {
    setHasSubspecialties(options && options.length);
  }, []);

  const handleCheckChange = e => {
    const { name, checked } = e.target;

    setValue(name, checked ? 1 : 0, checked);
    setDifferentLocation(checked);
  };

  const defaultOptionSelectedFn = (option, value) => option.id === value.id;

  return (
    <Box width="100%">
      <Box display="flex" flexWrap="wrap" maxWidth={1360} width="100%">
        <InputContainer>
          <AutocompleteSelect
            name="company_id"
            selectedValue={comboValues.company_id}
            placeholder="Company *"
            error={!!errors.company_id}
            errorText={errors.company_id && errors.company_id.message}
            url={Endpoints.Search}
            displayKey="name"
            typeahead
            typeaheadLimit={25}
            typeaheadParams={{ entityType: 'company' }}
            onSelect={handleComboChange}
            disabled={!!companyId}
            getOptionSelected={defaultOptionSelectedFn}
            renderOption={option => (
              <div>
                <strong>{option.name}</strong>
                <br />
                <span>{option.subtitle}</span>
              </div>
            )}
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
            name="source"
            label="Job Board Source (URL)"
            inputRef={register(URL_VALIDATION)}
            error={!!errors.source}
            errorText={errors.source && errors.source.message}
            minWidth={minWidthTextBox}
          />
        </InputContainer>
        {uiState.isLoadingCompany && (
          <InputContainer flex="center">
            <CircularProgress size={24} />
          </InputContainer>
        )}
      </Box>
      <Box>
        <hr style={styles.line} />
      </Box>
      <Box display="flex" flexWrap="wrap" maxWidth={1360} width="100%" minHeight={100}>
        <InputContainer>
          <StyledForm
            style={styles.boxCheck}
            control={
              <Checkbox
                style={styles.checkBox}
                checked={differentLocation}
                onChange={handleCheckChange}
                name="different_location"
              />
            }
            label="Use a different location than company"
          />
        </InputContainer>
        {differentLocation && (
          <>
            <InputContainer>
              <AutocompleteSelect
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
                name="city_id"
                placeholder="City *"
                error={!!errors.city_id}
                errorText={errors.city_id && errors.city_id.message}
                url={
                  comboValues.state_id
                    ? `${Endpoints.Cities}?stateId=${comboValues.state_id.id}`
                    : ''
                }
                selectedValue={comboValues.city_id}
                onSelect={handleComboChange}
              />
            </InputContainer>
            <InputContainer>
              <AutocompleteSelect
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
          </>
        )}
      </Box>
    </Box>
  );
};

JobOrderForm.defaultProps = {
  onCompanySelect: undefined,
  companyId: null,
  initialValues: {}
};

export default JobOrderForm;
