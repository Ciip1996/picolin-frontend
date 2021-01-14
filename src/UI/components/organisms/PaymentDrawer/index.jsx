// @flow
import React, { useState, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import InputContainer from 'UI/components/atoms/InputContainer';
import TextBox from 'UI/components/atoms/TextBox';
import { Endpoints } from 'UI/constants/endpoints';

import type { MapType } from 'types';
import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
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
  const { register, errors, handleSubmit, setValue, watch } = form;

  // const vals = getValues();
  // console.log(vals);

  const onSubmit = async (formData: Object) => {
    try {
      const { idCost, idConcept, products: isProductsAvailable, ...rest } = formData;
      const products = Object.entries(rest).map(([key, value]) => {
        return { productCode: key, quantity: value };
      });
      const params = {
        idCost,
        idConcept,
        products
      };
      const response = await API.post(`${Endpoints.Transfers}${Endpoints.InsertTransfer}`, params);
      if (response) {
        onShowAlert({
          severity: 'success',
          title: 'Transferencia Exitosa',
          autoHideDuration: 3000,
          body: `Se ha registrado un pago con concepto de ${comboValues.idConcept.title} por ${comboValues.idCost.title} pesos`
        });
        onRegisterPayment();
      }
    } catch (err) {
      onShowAlert({
        severity: 'error',
        title: 'Error al registrar el pago',
        autoHideDuration: 3000,
        body: 'Ocurrio un problema'
      });
      throw err;
    }
  };

  const handleComboChange = (name?: string, value: any) => {
    setComboValues((prevState: MapType): MapType => ({ ...prevState, [name]: value }));
    setValue(name, value ? value.id : value, true);
  };

  const registerFormField = () => {
    register(
      { name: 'idConcept' },
      {
        required: `${Contents[language]?.requiredField}`,
        validate: value => {
          return value !== watch('idCost') || `${Contents[language]?.sameStore}`;
        }
      }
    );
    register(
      { name: 'idCost' },
      {
        required: `${Contents[language]?.requiredField}`,
        validate: value => {
          return value !== watch('idConcept') || `${Contents[language]?.sameStore}`;
        }
      }
    );
  };
  useEffect(() => {
    registerFormField();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register]);

  // useEffect(() => {
  //   if (comboValues.idConcept && comboValues.idCost) setValue('products', undefined, true);
  // }, [comboValues.idCost, comboValues.idConcept, setValue]);

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
                    autoFocus
                    name="idConcept"
                    selectedValue={comboValues.idConcept}
                    label={Contents[language]?.Concept}
                    error={!!errors?.idConcept}
                    errorText={errors?.idConcept && errors?.idConcept.message}
                    onChange={handleComboChange}
                  />
                </InputContainer>
                <InputContainer>
                  <TextBox
                    inputType="currency"
                    name="idCost"
                    selectedValue={comboValues.idCost}
                    label={Contents[language]?.Cost}
                    error={!!errors?.idCost}
                    errorText={errors?.idCost && errors?.idCost.message}
                    onChange={handleComboChange}
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
