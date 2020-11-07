// @flow
import React, { useState, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import ProductForm from 'UI/components/organisms/ProductForm';
import { Endpoints } from 'UI/constants/endpoints';

import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
import { useStyles } from './styles';
import Contents from './strings';

type TransferProductsDrawerProps = {
  handleClose: any => any
};

const TransferProductsDrawer = (props: TransferProductsDrawerProps) => {
  const { handleClose } = props;
  const language = localStorage.getItem('language');

  const form = useForm({
    defaultValues: {}
  });

  const { handleSubmit } = form;

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isReadOnly: false,
    isFormDisabled: false,
    isLoading: true
  });

  useEffect(() => {
    setUiState(prevState => ({
      // TODO remove this is only for eslint not to crash
      ...prevState
    }));
  }, []);

  const classes = useStyles();

  const onSubmit = async (formData: Object) => {
    console.log(formData);
    const response = await API.post(`${Endpoints.Inventory}${Endpoints.InsertInventory}`, formData);
    debugger;
    console.log(response);
  };

  return (
    <>
      <FormContext {...form}>
        <DrawerFormLayout
          title={Contents[language].Title}
          onSubmit={handleSubmit(onSubmit)}
          onClose={handleClose}
          onSecondaryButtonClick={handleClose}
          variant="borderless"
          uiState={uiState}
          initialText="Re-Validate"
        >
          <form className={classes.root} noValidate autoComplete="off" />
          <Box>
            <div style={globalStyles.feeDrawerslabel}>
              <Text variant="body1" text={Contents[language].Subtitle} fontSize={14} />
              <ProductForm />
            </div>
          </Box>
          <div />
        </DrawerFormLayout>
      </FormContext>
    </>
  );
};

TransferProductsDrawer.defaultProps = {};

export default TransferProductsDrawer;
