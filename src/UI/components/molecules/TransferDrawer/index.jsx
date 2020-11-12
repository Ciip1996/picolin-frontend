// @flow
import React, { useState, useEffect } from 'react';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Box from '@material-ui/core/Box';
import Text from 'UI/components/atoms/Text';
import TextField from '@material-ui/core/TextField';
// import fetch from 'cross-fetch';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import CircularProgress from '@material-ui/core/CircularProgress';

import { globalStyles } from 'GlobalStyles';
import { useStyles } from './styles';
import Contents from './strings';

type TransferProductsDrawerProps = {
  handleClose: any => any
};

const TransferProductsDrawer = (props: TransferProductsDrawerProps) => {
  const { handleClose } = props;
  const language = localStorage.getItem('language');

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isReadOnly: false,
    isFormDisabled: false,
    isLoading: true
  });
  const inventoryvalues = [
    {
      value: Contents[language]?.Store,
      label: Contents[language]?.Store
    },
    {
      value: Contents[language]?.Warehouse,
      label: Contents[language]?.Warehouse
    }
  ];
  const destinyvalues = [
    {
      value: Contents[language]?.Store,
      label: Contents[language]?.Store
    },
    {
      value: Contents[language]?.Warehouse,
      label: Contents[language]?.Warehouse
    }
  ];

  const [inventory, setinventory] = React.useState('Tienda');
  const [destiny, setdestiny] = React.useState('Tienda');

  const handleChange = event => {
    setinventory(event.target.value);
  };
  const handleChange2 = event => {
    setdestiny(event.target.value);
  };

  useEffect(() => {
    setUiState(prevState => ({
      // TODO remove this is only for eslint not to crash
      ...prevState
    }));
  }, []);

  const classes = useStyles();
  return (
    <>
      {/* <FormContext {...form}> */}
      <DrawerFormLayout
        title="title here"
        onSubmit={() => {}}
        onClose={handleClose}
        // onSecondaryButtonClick={handleClose}
        variant="borderless"
        uiState={uiState}
        initialText="Re-Validate"
      >
        <form className={classes.root} noValidate autoComplete="off">
          <div>
            <h1 className={classes.title}>TRANSFERIR PRODUCTOS</h1>
            <TextField
              id="outlined-select-inventory-native"
              select
              label={Contents[language]?.Origin}
              value={inventory}
              onChange={handleChange}
              SelectProps={{
                native: true
              }}
              variant="outlined"
              className={classes.textOrigin}
              size="small"
            >
              {inventoryvalues.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
            <TextField
              id="outlined-select-inventory-native"
              select
              label={Contents[language]?.Destiny}
              value={destiny}
              onChange={handleChange2}
              SelectProps={{
                native: true
              }}
              variant="outlined"
              className={classes.textDestiny}
              size="small"
            >
              {destinyvalues.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </div>
          <TextField
            id="outlined-number"
            label={Contents[language]?.Products}
            type="text"
            InputLabelProps={{
              shrink: true
            }}
            variant="outlined"
            className={classes.textProducts}
            size="small"
            placeholder={Contents[language]?.Placeholder}
          />
        </form>
        <div>contendio aqui</div>
        <Box>
          <div style={globalStyles.feeDrawerslabel}>
            <Text variant="subtitle1" text="Modify The Declined Fields" fontSize={16} />
          </div>
        </Box>
        <div />
      </DrawerFormLayout>
      {/* </FormContext> */}
    </>
  );
};

TransferProductsDrawer.defaultProps = {};

export default TransferProductsDrawer;
