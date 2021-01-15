// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { FormContext, useFormContext } from 'react-hook-form';
import moment from 'moment';
import queryString from 'query-string';

import Grid from '@material-ui/core/Grid';

import Box from '@material-ui/core/Box';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import InfoRow from 'UI/components/molecules/InfoRow';
import InfoRowTotal from 'UI/components/molecules/InfoRowTotal';

import { Endpoints } from 'UI/constants/endpoints';
import { DEFAULT_STORE, DateFormats } from 'UI/constants/defaults';

import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
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

  const form = useFormContext();
  const { register, handleSubmit, getValues } = form;
  const [todaysPayments, setTodaysPayments] = useState([]);
  const [income, setIncome] = useState({
    cash: null,
    card: null
  });

  const [cashier, setCashier] = useState({});
  const [diff, setDiff] = useState(0);

  const [cashierInformation, setCashierInformation] = useState([]);

  const vals = getValues();
  console.log(vals);

  const onSubmit = async (formData: Object) => {
    try {
      const { cash, card } = formData;
      const params = {
        cash,
        card,
        idStore: DEFAULT_STORE.id
      };
      debugger;
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
      debugger;
      // showAlert({
      //   severity: 'error',
      //   title: getErrorData(err)?.title || 'Error en conexión',
      //   autoHideDuration: 800000,
      //   body: JSON.stringify(getErrorData(err)?.message) || 'Contacte a soporte técnico'
      // });
      throw err;
    }
  }, []);

  useEffect(() => {
    getLstOfTodaysPayments();
    getIncomeData();

    const totalOfCashPayments =
      Number(todaysPayments.reduce((total, obj) => obj.cost && Number(obj.cost) + total, 0)) * -1;
    setCashier({
      initial: 1000.0,
      cashSales: income?.cash ? Number(income?.cash) : 0.0,
      cardSales: income?.card ? Number(income?.card) : 0.0,
      cashInCashier: getValues('cash'),
      terminalAmountRegistered: getValues('card'),
      totalOfCashPayments
    });
  }, [
    getIncomeData,
    getLstOfTodaysPayments,
    getValues,
    income?.card,
    income?.cash,
    todaysPayments
  ]);

  useEffect(() => {
    setCashierInformation([
      {
        title: 'Fondo Inicial',
        cost: cashier.initial
      },
      {
        title: 'Total de Ventas Registradas en Efectivo',
        cost: cashier.cashSales
      },
      {
        title: 'Total de Ventas Registradas con Tarjeta',
        cost: cashier.cardSales
      },
      {
        title: 'Efectivo en Caja',
        cost: cashier.cashInCashier
      },
      {
        title: 'Corte en Terminal',
        cost: cashier.terminalAmountRegistered
      },
      {
        title: 'Total de Pagos con efectivo',
        cost: cashier.totalOfCashPayments
      }
    ]);
  }, [cashier]);

  useEffect(() => {
    const newDiff = cashierInformation.reduce(
      (total, obj) => obj.cost && Number(obj.cost) + total,
      0
    );
    debugger;
    setDiff(newDiff);
  }, [cashierInformation]);

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
                <Grid component="nav">
                  <Text variant="body2" text={Contents[language]?.PaymentsSubtitle} fontSize={13} />
                  <br />
                  {todaysPayments.map((each: Object) => {
                    return <InfoRow title={each.concept} value={each.cost} isValueCurrency />;
                  })}
                </Grid>
                <br />
                <Text variant="body2" text={Contents[language]?.SummarySubtitle} fontSize={13} />
                <br />
                <Grid component="nav">
                  {cashierInformation.map((each: Object) => {
                    return <InfoRow title={each?.title} value={each.cost} isValueCurrency />;
                  })}
                  <Box>
                    <InfoRowTotal title="Diferencia: " value={diff} isValueCurrency />
                  </Box>
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
