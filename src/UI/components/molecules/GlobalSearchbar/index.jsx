// @flow
import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import SelectBox from 'UI/components/atoms/SelectBox';
import { SearchBarIcon, colors } from 'UI/res';
import { entityTypes, EntityType } from 'UI/constants/entityTypes';
import API from 'services/API';
import { EntityRoutes } from 'routes/constants';
import { input } from 'UI/constants/dimensions';
import { ThemeProvider } from '@material-ui/core/styles';
import { useStyles, useAutocompleteStyles, themeOverride } from './styles';
import Contents from './strings';

type GlobalSearchbarProps = {
  placeholder?: string,
  width?: string,
  onSelect?: (name?: string, value: any) => void
};

const defaultEntityTypeFilter = EntityType.Candidate;
const limit = 15;

const GlobalSearchbar = (props: GlobalSearchbarProps) => {
  const { width, onSelect } = props;
  const history = useHistory();
  const language = localStorage.getItem('language');

  const classes = useStyles();
  const autoCompleteClasses = useAutocompleteStyles();
  const defaultRenderOption = displayKey => option => (
    <div>
      <strong>{option[displayKey]}</strong>
      <br />
      <span>{option.subtitle}</span>
    </div>
  );

  const searchOptions = {
    [EntityType.Candidate]: {
      inColumns: ['pst.title', 'can.email'],
      placeholder: Contents[language].placeholder1,
      url: EntityRoutes.CandidateProfile,
      renderOption: option => (
        <div>
          <strong>{option.title}</strong>
          <Typography variant="body2" component="span" color="textSecondary">
            {` ${option.email || ''}`}
          </Typography>
          <br />
          <span>{option.subtitle}</span>
        </div>
      )
    },
    [EntityType.Joborder]: {
      inColumns: [],
      placeholder: Contents[language].placeholder2,
      url: EntityRoutes.JobOrderProfile,
      renderOption: defaultRenderOption('title')
    },
    [EntityType.Company]: {
      inColumns: ['spec.title', 'itry.title'],
      placeholder: Contents[language].placeholder2,
      url: EntityRoutes.CompanyProfile,
      renderOption: defaultRenderOption('name')
    },
    [EntityType.Name]: {
      inColumns: [],
      placeholder: Contents[language].placeholder3,
      url: EntityRoutes.NameProfile,
      renderOption: defaultRenderOption('title')
    }
  };

  const [selectedValue, setSelectedValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({ entityType: defaultEntityTypeFilter, keyword: null });
  const [searchOption, setSearchOption] = useState(searchOptions[defaultEntityTypeFilter]);

  useEffect(() => {
    (async () => {
      const { keyword, entityType } = filters;
      const inColumns = searchOption.inColumns.join(',');

      const params = queryString.stringify({ keyword, entityType });

      if (!filters.keyword) {
        setResults([]);
        return;
      }
      await API.get(`search?${params}&inColumns=${encodeURI(inColumns)}&limit=${limit}`)
        .then(response => {
          setResults(response.data);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    })();
  }, [filters, searchOption]);

  const handleSearch = newInputValue => {
    setInputValue(newInputValue);
    setFilters(prevState => ({ ...prevState, keyword: newInputValue }));
  };

  const handleChange = useCallback(
    (event, value) => {
      setSelectedValue(value);
      onSelect && onSelect(value);
      if (!value) {
        return;
      }
      history.push(searchOption.url.replace(':id', value.id));
    },
    [onSelect, searchOption, history]
  );

  const handleSelectBox = entityType => {
    setSearchOption(searchOptions[entityType.id]);

    setFilters({ entityType: entityType.id, keyword: null });
    setInputValue('');
  };

  const customStyle = {
    height: input.height
  };

  return (
    <Paper
      style={customStyle}
      component="form"
      className={classes.root}
      elevation={0}
      variant="outlined"
    >
      <Autocomplete
        autoComplete
        noOptionsText={Contents[language].Nofound}
        placeholder={searchOption.placeholder}
        style={{ width }}
        filterOptions={opts => opts}
        getOptionSelected={(option, value) => option.title === value.title}
        options={results}
        groupBy={option => option.firstLetter}
        onChange={handleChange} // TODO: implement the action after selecting the item.
        value={selectedValue}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          handleSearch(newInputValue);
        }}
        classes={autoCompleteClasses}
        id="free-solo-demo"
        renderInput={params => (
          <ThemeProvider theme={themeOverride}>
            <TextField {...params} label={searchOption.placeholder} variant="outlined" />
          </ThemeProvider>
        )}
        renderOption={searchOption.renderOption}
      />
      <div className={classes.wrapper}>
        <IconButton disabled className={classes.iconButton} type="submit" aria-label="search">
          <SearchBarIcon fill={colors.inactiveSideBarTab} />
        </IconButton>
        <div style={{ width: 192 }}>
          <SelectBox
            isGlobal
            placeholder=""
            onSelect={(event, value) => handleSelectBox(value)}
            showFirstOption
            displayKey="title"
            options={entityTypes}
          />
        </div>
      </div>
    </Paper>
  );
};

GlobalSearchbar.defaultProps = {
  placeholder: Contents[language].Search,
  width: '100%',
  onSelect: undefined
};

export default GlobalSearchbar;
