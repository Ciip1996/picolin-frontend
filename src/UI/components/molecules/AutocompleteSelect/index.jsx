// @flow
import queryString from 'query-string';
import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ColorIndicator from 'UI/components/atoms/ColorIndicator';
import { showAlert as showAlertAction } from 'actions/app';
import { getErrorData, useLanguage } from 'UI/utils';
import API from 'services/API';
import { type DataResponseFilter } from 'types/app';

import {
  useAutocompleteStyles,
  useAutocompleteStylesDisabled,
  useChipStyles,
  useChipStylesDisabled
} from './styles';
import Contents from './strings';

type AutocompleteSelectProps = {
  name: string,
  placeholder?: string,
  displayKey?: any, // the key value of the json that will be displayed in the list.
  url: string,
  selectedValue?: any,
  defaultOptions?: Array<any>,
  errorText?: string,
  error?: boolean,
  multiple?: boolean,
  typeahead?: boolean,
  typeaheadLimit?: number,
  typeaheadParams: any,
  disabledItemsFocusable?: boolean,
  startAdornment: any,
  dataResponseFilter: DataResponseFilter, // this feature no longer being used, evaluate whether we should keep it or remove it from the component
  onOptionsLoaded?: (options: any[]) => void,
  onSelect?: (name?: string, value: any) => void,
  groupBy?: (option: any) => any,
  getOptionSelected?: (option: any, value: any) => boolean,
  getOptionLabel?: (option: any) => string,
  showAlert: any => void,
  dataFetchKeyName: string,
  disabled: boolean,
  autoFocus: boolean
};

const AutocompleteSelect = (props: AutocompleteSelectProps) => {
  const {
    name,
    placeholder,
    displayKey,
    url,
    selectedValue,
    defaultOptions,
    error,
    errorText,
    multiple,
    typeahead,
    typeaheadLimit,
    typeaheadParams,
    disabledItemsFocusable = false,
    startAdornment,
    dataResponseFilter,
    onSelect,
    groupBy,
    onOptionsLoaded,
    getOptionSelected,
    getOptionLabel,
    showAlert,
    dataFetchKeyName,
    disabled,
    autoFocus,
    ...rest
  } = props;

  const language = useLanguage();

  const [options, setOptions] = useState([]);
  const [keyword, setKeyword] = useState(null);
  const [loading, setLoading] = useState(false);

  const classes = useAutocompleteStyles();
  const chipClasses = useChipStyles();
  const chipClassesDisabled = useChipStylesDisabled();
  const classesDisabled = useAutocompleteStylesDisabled();

  const handleChange = useCallback(
    (event, value) => {
      onSelect && onSelect(name, value);
    },
    [name, onSelect]
  );

  const handleOptionsLoaded = useCallback(
    newOptions => {
      onOptionsLoaded && onOptionsLoaded(newOptions);
    },
    [onOptionsLoaded]
  );

  const handleKeydown = event => {
    if (!typeahead) {
      return;
    }
    setKeyword(event.target.value);
  };

  const handleTypeaheadClose = () => {
    setKeyword('');
    setOptions([]);
  };

  const defaultOptionSelectedFn = (option, value) =>
    option[displayKey] === value[displayKey];
  const defaultOptionLabelFn = option => option[displayKey];

  const typeaheadProps = typeahead
    ? {
        forcePopupIcon: false,
        filterOptions: opts => opts,
        onClose: handleTypeaheadClose
      }
    : null;

  useEffect(() => {
    (async () => {
      if (typeahead) {
        return;
      }

      if (!url) {
        setOptions([]);
        return;
      }

      setLoading(true);
      await API.get(url)
        .then(response => {
          if (dataResponseFilter) {
            // if dataResponseFilter is provided it will filter the response.data array of objects
            // given from the server by specifiying the key value that you want to have.
            // The value must be an array in order to work.
            const filteredData = response.data.filter(itm => {
              return (
                dataResponseFilter.value.indexOf(itm[dataResponseFilter.key]) >
                -1
              );
            });
            setOptions(filteredData);
            handleOptionsLoaded(filteredData);
          } else {
            setOptions(response.data);
            handleOptionsLoaded(response.data);
          }
        })
        .catch(err => {
          const { title, message, severity } = getErrorData(err);
          showAlert({
            severity,
            title,
            autoHideDuration: 8000,
            body: message
          });
        });
      setLoading(false);
    })();
  }, [url, typeahead, handleOptionsLoaded, showAlert, dataResponseFilter]);

  useEffect(() => {
    const search = async () => {
      if (!typeahead || !keyword || !url) {
        return;
      }
      const queryParams = queryString.stringify({
        keyword,
        limit: typeaheadLimit,
        ...typeaheadParams
      });

      setLoading(true);
      await API.get(`${url}?${queryParams}`)
        .then(response => {
          if (response?.data[dataFetchKeyName]) {
            setOptions(response?.data[dataFetchKeyName]);
          } else {
            setOptions(response?.data);
          }
        })
        .catch(err => {
          showAlert({
            severity: 'error',
            title: getErrorData(err)?.title,
            autoHideDuration: 8000,
            body: getErrorData(err)?.message
          });
        });
      setLoading(false);
    };
    search();
  }, [
    dataFetchKeyName,
    keyword,
    showAlert,
    typeahead,
    typeaheadLimit,
    typeaheadParams,
    url
  ]);

  const chipProps = disabledItemsFocusable
    ? { onDelete: null, classes: chipClassesDisabled }
    : { classes: chipClasses };

  return (
    <Autocomplete
      noOptionsText={Contents[language]?.labelResults}
      multiple={!!multiple}
      ChipProps={{ ...chipProps }}
      getOptionSelected={getOptionSelected || defaultOptionSelectedFn}
      getOptionLabel={getOptionLabel || defaultOptionLabelFn}
      options={defaultOptions || options}
      loading={loading}
      groupBy={groupBy}
      onChange={handleChange}
      value={selectedValue}
      disabled={disabled}
      classes={disabled || disabledItemsFocusable ? classesDisabled : classes}
      {...typeaheadProps}
      {...rest}
      renderInput={params => (
        <>
          <TextField
            {...params}
            autoFocus={autoFocus}
            label={placeholder}
            variant="outlined"
            fullWidth
            error={error}
            helperText={errorText}
            onChange={handleKeydown}
            InputProps={{
              ...params.InputProps,
              // workaround for https://github.com/mui-org/material-ui/issues/19479
              startAdornment:
                selectedValue && startAdornment ? (
                  <>
                    {selectedValue && startAdornment}
                    {params.InputProps.startAdornment}
                  </>
                ) : (
                  params.InputProps.startAdornment
                ),
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress
                      style={{ position: 'absolute', right: 42 }}
                      color="inherit"
                      size={25}
                    />
                  ) : null}
                  {!disabledItemsFocusable && params.InputProps.endAdornment}
                </>
              )
            }}
          />
        </>
      )}
    />
  );
};

AutocompleteSelect.defaultProps = {
  placeholder: '',
  displayKey: 'title',
  onSelect: undefined,
  selectedValue: null,
  defaultOptions: null,
  groupBy: undefined,
  error: false,
  errorText: '',
  onOptionsLoaded: undefined,
  multiple: false,
  typeahead: false,
  typeaheadParams: {},
  typeaheadLimit: 15,
  dataResponseFilter: undefined,
  disabledItemsFocusable: false,
  getOptionSelected: undefined,
  getOptionLabel: undefined,
  startAdornment: undefined,
  dataFetchKeyName: 'data',
  autoFocus: false
};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert))
  };
};

const AutocompleteSelectConnected = connect(
  null,
  mapDispatchToProps
)(AutocompleteSelect);

export default AutocompleteSelectConnected;

const renderStatusIndicator = (color: string) => {
  return (
    <ColorIndicator color={color} width={10} height={10} onClick={() => {}} />
  );
};
export const statusRenderOption = (option: any) => (
  <>
    {renderStatusIndicator(option.style_class_name)}
    <Typography noWrap style={{ marginLeft: '4px' }}>
      {option.title}
    </Typography>
  </>
);
export const statusStartAdornment = (color: string) => (
  <Box ml={1}>{renderStatusIndicator(color)}</Box>
);
