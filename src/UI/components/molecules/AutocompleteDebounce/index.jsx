// @flow
import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import queryString from 'query-string';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormHelperText from '@material-ui/core/FormHelperText';

import API from 'services/API';
import ListProductRow from 'UI/components/molecules/ListProductRow';
import { Wrapper, Input, Ul, Li, SuggestContainer } from './styles';
import Contents from './strings';

type AutocompleteDebounceProps = {
  url: string | null,
  placeholder: string,
  onSelectItem: Object => any,
  handleError: string => any,
  dataFetchKeyName: string,
  displayKey: string,
  maxOptions: number,
  error: boolean,
  errorText: string
};

const AutocompleteDebounce = (props: AutocompleteDebounceProps) => {
  const {
    url,
    maxOptions,
    placeholder,
    onSelectItem,
    handleError,
    dataFetchKeyName,
    displayKey,
    error,
    errorText,
    ...rest
  } = props;
  const language = localStorage.getItem('language');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const getSuggestions = async keyword => {
    try {
      if (keyword && url) {
        setLoading(true);
        const queryParams = queryString.stringify({
          keyword,
          limit: maxOptions
        });
        const response = await API.get(`${url}?${queryParams}`);
        if (response.status === 200 && response?.data[dataFetchKeyName]) {
          const options = dataFetchKeyName
            ? response?.data[dataFetchKeyName]
            : response?.data;
          setData(options);
        } else {
          setData([]);
        }
        setLoading(false);
      } else if (!keyword) {
        setLoading(false);
        setData([]);
      }
    } catch (catchError) {
      const { message } = catchError;
      handleError(message);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(newValue => getSuggestions(newValue), 1000),
    [url]
  );

  const updateValue = newValue => {
    setInputValue(newValue);
    debouncedSave(newValue);
  };

  return (
    <Wrapper>
      <Input
        onBlur={() => {
          setData(null);
          setLoading(false);
          setInputValue('');
        }}
        value={inputValue}
        onChange={input => updateValue(input.target.value)}
        onKeyDown={() => setLoading(true)}
        placeholder={placeholder}
        {...rest}
      />
      <FormHelperText error={error}>{error && errorText}</FormHelperText>
      <SuggestContainer>
        <Ul>
          {loading && (
            <Li>
              <CircularProgress size={20} /> {` ${Contents[language]?.loading}`}
            </Li>
          )}
          {!loading && data && data.length === 0 && (
            <Li key={`${0}`}>No se encontraron resultados</Li>
          )}
          {!loading &&
            data &&
            data.length > 0 &&
            data.map(option => {
              return (
                <Li
                  key={`${option?.id}`}
                  onMouseDown={() => {
                    onSelectItem(option);
                    setData(null);
                  }}
                >
                  <ListProductRow product={option} />
                </Li>
              );
            })}
        </Ul>
      </SuggestContainer>
    </Wrapper>
  );
};

export default AutocompleteDebounce;
