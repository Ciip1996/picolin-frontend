// @flow
import React from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { SearchBarIcon, colors } from 'UI/res';
import { input } from 'UI/constants/dimensions';
import { useStyles } from './styles';
import Contents from './strings';

const language =
  localStorage.getItem('language') || process.env.REACT_APP_DEFAULT_LANGUAGE;

type SearchbarProps = {
  name: string,
  value?: ?string,
  width?: string,
  placeholder?: string | null,
  onChange: (name: string, value: any) => void,
  onSearch: (name: string, value: any) => any
};

const Searchbar = (props: SearchbarProps) => {
  const language = useLanguage();

  const { name, width, placeholder, onChange, value, onSearch } = props;

  const customStyle = {
    width,
    height: input.height
  };

  const classes = useStyles();

  const handleSearchBoxTextChange = event => {
    const text = event.target.value;
    onChange && onChange(name, text);
  };

  const handleSearchClick = () => {
    onSearch && onSearch(name, value);
  };

  const handleKeydown = event => {
    if (event.keyCode === 13) {
      onSearch && onSearch(name, value);
    }
  };

  const additionalProps = {};
  if (value !== null) {
    additionalProps.value = value;
  }

  return (
    <Paper
      style={customStyle}
      className={classes.root}
      elevation={0}
      variant="outlined"
    >
      <InputBase
        className={classes.input}
        placeholder={placeholder || Contents[language]?.SearchBy}
        inputProps={{
          'aria-label': placeholder || Contents[language]?.SearchBy
        }}
        onChange={handleSearchBoxTextChange}
        onKeyDown={handleKeydown}
        {...additionalProps}
      />
      <IconButton
        type="button"
        className={classes.iconButton}
        aria-label={Contents[language]?.Search}
        onClick={handleSearchClick}
      >
        <SearchBarIcon fill={colors.inactiveSideBarTab} />
      </IconButton>
    </Paper>
  );
};

Searchbar.defaultProps = {
  width: '389px',
  value: null,
  placeholder: null,
  onChange: () => {},
  onSearch: () => {}
};

export default Searchbar;
