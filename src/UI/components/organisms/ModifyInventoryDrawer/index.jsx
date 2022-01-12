// @flow
import React, { useState, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import { Endpoints } from 'UI/constants/endpoints';
import InputContainer from 'UI/components/atoms/InputContainer';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { type MapType } from 'types/index';
import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
import { getErrorData } from 'UI/utils';
import { useStyles } from './styles';
import Contents from './strings';

type ModifyInventoryDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  onProductInserted: (number, string, number) => any
};

const Separator = () => <span style={{ width: 20 }} />;

const ModifyInventoryDrawer = (props: ModifyInventoryDrawerProps) => {
  const { handleClose, onShowAlert, onProductInserted } = props;
  const language = localStorage.getItem('language');

  const form = useForm({
    defaultValues: {}
  });

  const { errors, handleSubmit, setValue } = form;

  const [comboValues, setComboValues] = useState<MapType>({});

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isReadOnly: false,
    isFormDisabled: false,
    isLoading: true
  });

  useEffect(() => {
    setUiState(prevState => ({
      ...prevState
    }));
  }, []);

  const classes = useStyles();

  const onSubmit = async (formData: Object) => {
    try {
      const response = await API.post(
        `${Endpoints.Inventory}${Endpoints.ModifyInventory}`,
        formData
      );
      if (response) {
        const { productCode, name, idProduct, message, title } = response?.data;
        onShowAlert({
          severity: 'success',
          title,
          autoHideDuration: 3000,
          body: message
        });
        productCode &&
          name &&
          idProduct &&
          onProductInserted(productCode, name, idProduct);
      }
    } catch (err) {
      const { message, title } = getErrorData(err);
      onShowAlert({
        severity: 'error',
        title,
        autoHideDuration: 800000,
        body: message
      });
      throw err;
    }
  };
  const handleComboChange = (name: string, value: any) => {
    setComboValues((prevState: MapType): MapType => ({
      ...prevState,
      [name]: value
    }));
    setValue(name, value?.id ? value?.id : value?.title, true);
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
        >
          <form className={classes.root} noValidate autoComplete="off" />
          <Box>
            <div style={globalStyles.feeDrawerslabel}>
              <Text
                variant="body1"
                text={Contents[language]?.Subtitle}
                fontSize={14}
              />
              <Box display="flex" flexWrap="wrap" maxWidth={1360} width="100%">
                <InputContainer>
                  <AutocompleteSelect
                    noOptionsText="No existe este nombre, solicite al administrador que lo agregue."
                    name="name"
                    selectedValue={comboValues.name}
                    placeholder={Contents[language]?.Name}
                    error={!!errors?.name}
                    errorText={errors?.name && errors?.name?.message}
                    onSelect={handleComboChange}
                    url={Endpoints.GetNames}
                    autoFocus
                  />
                </InputContainer>
                <InputContainer>
                  <AutocompleteSelect
                    name="idType"
                    selectedValue={comboValues.idType}
                    placeholder={Contents[language]?.ProductType}
                    error={!!errors?.idType}
                    errorText={errors?.idType && errors?.idType?.message}
                    onSelect={handleComboChange}
                    url={Endpoints.GetTypes}
                    autoFocus
                  />
                  <Separator />
                  <AutocompleteSelect
                    name="idMaterial"
                    selectedValue={comboValues.idMaterial}
                    placeholder={Contents[language]?.Material}
                    error={!!errors?.idMaterial}
                    errorText={errors?.idMaterial && errors?.idMaterial.message}
                    onSelect={handleComboChange}
                    url={Endpoints.Materials}
                  />
                </InputContainer>
                <InputContainer>
                  <AutocompleteSelect
                    name="idGender"
                    placeholder={Contents[language]?.Gender}
                    selectedValue={comboValues.idGender}
                    error={!!errors?.idGender}
                    errorText={errors?.idGender && errors?.idGender.message}
                    onSelect={handleComboChange}
                    url={Endpoints.Genders}
                  />

                  <Separator />
                  <AutocompleteSelect
                    name="idColor"
                    selectedValue={comboValues.idColor}
                    placeholder={Contents[language]?.Color}
                    error={!!errors?.idColor}
                    errorText={errors?.idColor && errors?.idColor.message}
                    onSelect={handleComboChange}
                    url={Endpoints.Colors}
                  />
                </InputContainer>
              </Box>
            </div>
          </Box>
          <div />
        </DrawerFormLayout>
      </FormContext>
    </>
  );
};

ModifyInventoryDrawer.defaultProps = {};

export default ModifyInventoryDrawer;
