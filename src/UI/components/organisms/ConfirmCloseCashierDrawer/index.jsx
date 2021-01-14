// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import moment from 'moment';
import queryString from 'query-string';

import Grid from '@material-ui/core/Grid';

import Box from '@material-ui/core/Box';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import { Endpoints } from 'UI/constants/endpoints';
import { DEFAULT_STORE, DateFormats } from 'UI/constants/defaults';

import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
import { currencyFormatter } from 'UI/utils';
import { useStyles } from './styles';
import Contents from './strings';

type CloseCashierDrawerProps = {
  cashierData: Object,
  handleClose: any => any,
  onShowAlert: any => any,
  onConfirmedCloseCashier: () => any
};

const ConfirmCloseCashierDrawer = (props: CloseCashierDrawerProps) => {
  const { cashierData, handleClose, onShowAlert, onConfirmedCloseCashier } = props;
  const language = localStorage.getItem('language');

  const classes = useStyles();

  const form = useForm();
  const { register, handleSubmit } = form;
  const [todaysPayments, setTodaysPayments] = useState([]);
  const [income, setIncome] = useState({
    cash: null,
    card: null
  });

  const onSubmit = async (formData: Object) => {
    try {
      const { cash, card } = formData;
      const params = {
        cash,
        card,
        idStore: DEFAULT_STORE.id
      };
      const response = await API.post(`${Endpoints.Cashier}${Endpoints.CloseCashier}`, params);
      if (response) {
        onShowAlert({
          severity: 'success',
          title: 'Confirmación de Corte de Caja Exitoso',
          autoHideDuration: 8000,
          body: `Se ha confirmado su corte de caja de forma exitosa.`
        });
        onConfirmedCloseCashier();
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

  const getLstOfTodaysPayments = useCallback(async () => {
    try {
      const queryParams = queryString.stringify({
        date: moment(Date.now()).format(DateFormats.SQL)
      });
      const url = `${Endpoints.Cashier}${Endpoints.StorePayments}?`.replace(
        ':idStore',
        DEFAULT_STORE.id.toString()
      );
      const response = await API.get(`${url}${queryParams}`);
      if (response) {
        setTodaysPayments(response?.data?.payments);
        // onConfirmedCloseCashier();
      }
    } catch (err) {
      onShowAlert({
        severity: 'error',
        title: 'Error al Obtener lista de pagos del día',
        autoHideDuration: 3000,
        body: 'Ocurrio un problema'
      });
      throw err;
    }
  }, [onShowAlert]);

  const getIncomeData = useCallback(async () => {
    try {
      const queryParams = queryString.stringify({
        idStore: DEFAULT_STORE.id
      });
      const response = await API.get(`${Endpoints.GetDayIncome}?${queryParams}`);
      if (response) {
        setIncome({
          card: response.data.find(each => each.paymentMethod === 'Tarjeta')?.value,
          cash: response.data.find(each => each.paymentMethod === 'Efectivo')?.value
        });
      }
    } catch (err) {
      console.log(err);
      // showAlert({
      //   severity: 'error',
      //   title: getErrorData(err)?.title || 'Error en conexión',
      //   autoHideDuration: 800000,
      //   body: JSON.stringify(getErrorData(err)?.message) || 'Contacte a soporte técnico'
      // });
      throw err;
    }
  }, []);

  const registerFormField = useCallback(async () => {
    register(
      { name: 'card' },
      {
        required: `${Contents[language]?.requiredField}`
      }
    );

    register(
      { name: 'cash' },
      {
        required: `${Contents[language]?.requiredField}`
      }
    );
  }, [language, register]);

  useEffect(() => {
    getLstOfTodaysPayments();
    registerFormField();
    getIncomeData();
  }, [getIncomeData, getLstOfTodaysPayments, registerFormField]);

  const data2 = [
    {
      title: 'Fondo Inicial',
      cost: 1000.0
    },
    {
      title: 'Total de Ventas en Efectivo',
      cost: income?.cash
    },
    {
      title: 'Total de Ventas con Tarjeta',
      cost: income?.card
    },
    {
      title: 'Efectivo en Caja',
      cost: cashierData?.cash
    },
    {
      title: 'Corte en Terminal',
      cost: cashierData?.card
    },
    {
      title: 'Total de Pagos con efectivo',
      cost: todaysPayments.reduce((total, obj) => obj.cost + total, 0)
    }
  ];

  return (
    <>
      <DrawerFormLayout
        title={Contents[language]?.Title}
        onSubmit={handleSubmit(onSubmit)}
        onClose={handleClose}
        onSecondaryButtonClick={handleClose}
        variant="borderless"
        initialText="Confirmar Corte"
      >
        <FormContext {...form}>
          <div className={classes.root}>
            <Box>
              <div style={globalStyles.feeDrawerslabel}>
                <Text
                  variant="subtitle1"
                  text={Contents[language]?.PaymentsSubtitle}
                  fontSize={13}
                />
                <Grid component="nav" className={classes.List}>
                  {todaysPayments.map((each: Object) => {
                    return (
                      <Grid container spacing={3} className={classes.Item}>
                        <Grid item xs={9}>
                          <span className={classes.Description}>{each.concept}</span>
                        </Grid>
                        <Grid item xs={3}>
                          <Text
                            name="display_subtotal"
                            className={classes.currencyValue}
                            variant="body1"
                            text={each.cost ? currencyFormatter(each.cost) : '--'}
                            fontSize={16}
                          />
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
                <br />
                <Grid component="nav" className={classes.List}>
                  {data2.map((each: Object) => {
                    return (
                      <Grid container spacing={3} className={classes.Item}>
                        <Grid item xs={9}>
                          <Text
                            // name="display_subtotal"
                            className={classes.Description}
                            variant="body1"
                            text={each.title}
                            fontSize={16}
                          />
                        </Grid>
                        <Grid flex={1}>
                          <Text
                            // name="display_subtotal"
                            className={classes.currencyValue}
                            variant="body1"
                            text={each?.cost ? currencyFormatter(each.cost) : '--'}
                            fontSize={16}
                          />
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
              </div>
            </Box>
          </div>
        </FormContext>
      </DrawerFormLayout>
    </>
  );
};

ConfirmCloseCashierDrawer.defaultProps = {};

export default ConfirmCloseCashierDrawer;
