// @flow
import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import queryString from 'query-string';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  maxOptions: number
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
          keyword
        });
        const response = await API.get(`${url}?${queryParams}`);
        if (response.status === 200 && response?.data[dataFetchKeyName]) {
          const options = dataFetchKeyName ? response?.data[dataFetchKeyName] : response?.data;
          const limitedOptions = maxOptions && options.slice(0, options);
          setData(options || limitedOptions);
        } else {
          setData([]);
        }
        setLoading(false);
      } else if (!keyword) {
        setLoading(false);
        setData([]);
      }
    } catch (error) {
      const { message } = error;
      handleError(message);
    }
  };

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
        }}
        value={inputValue}
        onChange={input => updateValue(input.target.value)}
        onKeyDown={() => setLoading(true)}
        placeholder={placeholder}
        {...rest}
      />
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
