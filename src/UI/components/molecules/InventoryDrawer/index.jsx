// @flow
import React from 'react';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Box from '@material-ui/core/Box';
import Text from 'UI/components/atoms/Text';
import TextField from '@material-ui/core/TextField';
// import fetch from 'cross-fetch';

import { globalStyles } from 'GlobalStyles';
import { useStyles } from './styles';
import Contents from './strings';

const TransferProductsDrawer = () => {
  // const [uiState, setUiState] = useState({
  //   isSaving: false,
  //   isSuccess: false,
  //   isReadOnly: false,
  //   isFormDisabled: false,
  //   isLoading: true
  // });
  const language = localStorage.getItem('language');

  const inventoryvalues = [
    {
      value: Contents[language].Store,
      label: Contents[language].Store
    },
    {
      value: Contents[language].Warehouse,
      label: Contents[language].Warehouse
    }
  ];
  const destinyvalues = [
    {
      value: Contents[language].Store,
      label: Contents[language].Store
    },
    {
      value: Contents[language].Warehouse,
      label: Contents[language].Warehouse
    }
  ];

  const [inventory, setinventory] = React.useState(Contents[language].Store);
  const [destiny, setdestiny] = React.useState(Contents[language].Store);

  const handleChange = event => {
    setinventory(event.target.value);
  };
  const handleChange2 = event => {
    setdestiny(event.target.value);
  };

  const classes = useStyles();
  return (
    <>
      {/* <FormContext {...form}> */}
      <DrawerFormLayout
        title="title here"
        // onSubmit={null}
        // onClose={handleClose}
        // onSecondaryButtonClick={handleClose}
        variant="borderless"
        // uiState={uiState}
        initialText="Re-Validate"
      >
        <form className={classes.root} noValidate autoComplete="off">
          <div>
            <h1 className={classes.title}>{Contents[language].TransProducts}</h1>
            <TextField
              id="outlined-select-inventory-native"
              select
              label={Contents[language].Origin}
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
              label={Contents[language].Destiny}
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
            label={Contents[language].Products}
            type="text"
            InputLabelProps={{
              shrink: true
            }}
            variant="outlined"
            className={classes.textProducts}
            size="small"
            placeholder={Contents[language].Placeholder}
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

TransferProductsDrawer.defaultProps = {
  onResponse: () => {}
};

export default TransferProductsDrawer;
