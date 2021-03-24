// @flow
import React, { useState, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import InputContainer from 'UI/components/atoms/InputContainer';
import TextBox from 'UI/components/atoms/TextBox';
import { Endpoints } from 'UI/constants/endpoints';
import { DEFAULT_STORE } from 'UI/constants/defaults';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';

import type { MapType } from 'types';
import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
import { getCurrentUser } from 'services/Authentication';
import { currencyFormatter } from 'UI/utils';
import { useStyles } from './styles';
import Contents from './strings';

type PaymentDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  onRegisterPayment: () => any
};

const PaymentDrawer = (props: PaymentDrawerProps) => {
  const { handleClose, onShowAlert, onRegisterPayment } = props;
  const language = localStorage.getItem('language');
  const [comboValues, setComboValues] = useState<MapType>({});

  const classes = useStyles();

  const form = useForm();
  const { register, errors, handleSubmit, setValue } = form;

  const onSubmit = async (formData: Object) => {
    try {
      const { cost, concept, idStorePaymentCategory } = formData;
      const params = {
        cost,
        concept,
        idStore: DEFAULT_STORE.id,
        idStorePaymentCategory
      };
      const response = await API.post(
        `${Endpoints.Cashier}${Endpoints.RegisterStorePayment}`,
        params
      );
      if (response) {
        onShowAlert({
          severity: 'success',
          title: 'Transferencia Exitosa',
          autoHideDuration: 8000,
          body: `Se ha registrado su pago con concepto de "${concept}" por ${currencyFormatter(
            cost
          )} pesos`
        });
        onRegisterPayment();
      }
    } catch (err) {
      onShowAlert({
        severity: 'error',
        title: 'Error al registrar el pago',
        autoHideDuration: 3000,
        body: 'Ocurrió un problema'
      });
      throw err;
    }
  };

  const handleTextChange = (name?: string, value: any) => {
    setValue(name, value, true);
    setComboValues({ ...comboValues });
  };

  const handleComboChange = (name?: string, value: any) => {
    setComboValues((prevState: MapType): MapType => ({ ...prevState, [name]: value }));
    setValue(name, value ? value.id : value, true);
  };

  const registerFormField = () => {
    register(
      { name: 'concept' },
      {
        required: `${Contents[language]?.requiredField}`
      }
    );
    register(
      { name: 'idStorePaymentCategory' },
      {
        required: `${Contents[language]?.requiredField}`
      }
    );

    register(
      { name: 'cost' },
      {
        required: `${Contents[language]?.requiredField}`
      }
    );
  };
  useEffect(() => {
    registerFormField();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register]);

  return (
    <>
      <DrawerFormLayout
        title={Contents[language]?.Title}
        onSubmit={handleSubmit(onSubmit)}
        onClose={handleClose}
        onSecondaryButtonClick={handleClose}
        variant="borderless"
        initialText="Registrar Pago"
      >
        <FormContext {...form}>
          <div className={classes.root}>
            <Box>
              <div style={globalStyles.feeDrawerslabel}>
                <Text variant="h2" text={Contents[language]?.Subtitle} fontSize={14} />
                <br />
                <InputContainer>
                  <TextBox
                    outPutValue
                    name="idUser"
                    value={getCurrentUser().userName}
                    label={Contents[language]?.User}
                    error={!!errors?.idUser}
                    errorText={errors?.idUser && errors?.idUser.message}
                  />
                </InputContainer>
                <InputContainer>
                  <TextBox
                    outPutValue
                    name="idStore"
                    value={DEFAULT_STORE.title}
                    label={Contents[language]?.Store}
                    error={!!errors?.idUser}
                    errorText={errors?.idUser && errors?.idUser.message}
                  />
                </InputContainer>
                <InputContainer>
                  <AutocompleteSelect
                    name="idStorePaymentCategory"
                    selectedValue={comboValues.idStorePaymentCategory}
                    placeholder={Contents[language]?.Category}
                    url={`${Endpoints.StorePaymentCategories}`}
                    onSelect={handleComboChange}
                    getOptionSelected={(option, value) => option.id === value.id}
                    error={!!errors?.idStorePaymentCategory}
                    errorText={
                      errors?.idStorePaymentCategory && errors?.idStorePaymentCategory.message
                    }
                  />
                </InputContainer>
                <InputContainer>
                  <TextBox
                    name="concept"
                    selectedValue={comboValues.concept}
                    label={Contents[language]?.Concept}
                    error={!!errors?.concept}
                    errorText={errors?.concept && errors?.concept.message}
                    onChange={handleTextChange}
                  />
                </InputContainer>
                <InputContainer>
                  <TextBox
                    inputType="currency"
                    name="cost"
                    selectedValue={comboValues.cost}
                    label={Contents[language]?.Cost}
                    error={!!errors?.cost}
                    errorText={errors?.cost && errors?.cost.message}
                    onChange={handleTextChange}
                  />
                </InputContainer>
              </div>
            </Box>
          </div>
        </FormContext>
      </DrawerFormLayout>
    </>
  );
};

PaymentDrawer.defaultProps = {};

export default PaymentDrawer;
