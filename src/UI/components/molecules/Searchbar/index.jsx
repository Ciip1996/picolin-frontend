// @flow
import React from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { SearchBarIcon, colors } from 'UI/res';
import { input } from 'UI/constants/dimensions';
import { useStyles } from './styles';

type SearchbarProps = {
  name: string,
  value?: ?string,
  width?: string,
  placeholder?: string,
  onChange: (name: string, value: any) => void,
  onSearch: (name: string, value: any) => any
};

const Searchbar = (props: SearchbarProps) => {
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
    <Paper style={customStyle} className={classes.root} elevation={0} variant="outlined">
      <InputBase
        className={classes.input}
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
        onChange={handleSearchBoxTextChange}
        onKeyDown={handleKeydown}
        {...additionalProps}
      />
      <IconButton
        type="button"
        className={classes.iconButton}
        aria-label="Search"
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
  placeholder: 'Search by',
  onChange: () => {},
  onSearch: () => {}
};

export default Searchbar;