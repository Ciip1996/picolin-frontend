// @flow
import React, { useState, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import AddComboForm from 'UI/components/organisms/AddComboForm';
import { globalStyles } from 'GlobalStyles';
import { CloseIcon } from 'UI/res';
import { useStyles } from './styles';

import Contents from './strings';

type AddComboToSaleDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  onComboAdded: any => any
};

const AddComboToSaleDrawer = (props: AddComboToSaleDrawerProps) => {
  const { handleClose, onShowAlert, onComboAdded } = props;
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
    try {
      !!formData?.diaperRacks &&
        !!formData?.footwear &&
        !!formData?.blanket &&
        !!formData?.ajuar &&
        onComboAdded(formData);
    } catch (err) {
      onShowAlert({
        severity: 'error',
        title: 'Error',
        autoHideDuration: 3000,
        body: 'Ocurrio un problema'
      });
      throw err;
    }
  };

  return (
    <>
      <FormContext {...form}>
        <DrawerFormLayout
          title={Contents[language]?.Title}
          onSubmit={handleSubmit(onSubmit)}
          onClose={handleClose}
          onSecondaryButtonClick={handleClose}
          variant="borderless"
          uiState={uiState}
          initialText="Agregar"
          isTopToolbarNeeded
          additionalHeaderButtons={
            <CustomIconButton
              tooltipText="Cerrar"
              wrapperStyle={classes.deleteButtonWrapper}
              // className={classes.deleteButton}
              aria-label="delete"
              onClick={handleClose}
              // onClick={prepareRemoveItem}
            >
              <CloseIcon fill="red" />
            </CustomIconButton>
          }
        >
          <form className={classes.root} noValidate autoComplete="off" />
          <Box>
            <div style={globalStyles.feeDrawerslabel}>
              <Text variant="body1" text={Contents[language]?.Subtitle} fontSize={14} />
              <AddComboForm />
            </div>
          </Box>
          <div />
        </DrawerFormLayout>
      </FormContext>
    </>
  );
};

AddComboToSaleDrawer.defaultProps = {};

export default AddComboToSaleDrawer;
