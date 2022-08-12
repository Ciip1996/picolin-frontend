// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { FormContext, useFormContext } from 'react-hook-form';
import moment from 'moment-timezone';
import queryString from 'query-string';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import { getErrorData, useLanguage } from 'UI/utils';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import InfoRow from 'UI/components/molecules/InfoRow';
import InfoRowTotal from 'UI/components/molecules/InfoRowTotal';

import { Endpoints } from 'UI/constants/endpoints';
import { DEFAULT_STORE, DateFormats } from 'UI/constants/defaults';

import API from 'services/API';
import { globalStyles } from 'GlobalStyles';
import { sendToPrintAndDownloadCashierTicket } from 'UI/utils/ticketGenerator';
import { useStyles } from './styles';
import Contents from './strings';

type CloseCashierDrawerProps = {
  cashierData: Object,
  handleClose: any => any,
  onShowAlert: any => void,
  onConfirmedCloseCashier: () => any
};

const ConfirmCloseCashierDrawer = (props: CloseCashierDrawerProps) => {
  const { handleClose, onShowAlert, onConfirmedCloseCashier } = props;
  const language = useLanguage();

  const classes = useStyles();

  const form = useFormContext();
  const { handleSubmit, getValues } = form;
  const [todaysPayments, setTodaysPayments] = useState([]);
  const [income, setIncome] = useState({
    cash: null,
    card: null
  });

  const [cashier, setCashier] = useState({});
  const [difference, setDifference] = useState(Number(0.0));

  const [cashierInformation, setCashierInformation] = useState([]);

  const onSubmit = async () => {
    try {
      const params = {
        idStore: DEFAULT_STORE.id,
        payments:
          todaysPayments && todaysPayments?.length > 0
            ? todaysPayments.map(each => each.idpayment)
            : [],
        difference,
        cashInCashier: cashier?.cashInCashier,
        terminalAmountRegistered: cashier?.terminalAmountRegistered
      };
      const response = await API.post(
        `${Endpoints.Cashier}${Endpoints.CloseCashier}`,
        params
      );
      if (response) {
        onShowAlert({
          severity: 'success',
          title: 'Confirmación de Corte de Caja Exitoso',
          autoHideDuration: 8000,
          body: `Se ha confirmado su corte de caja de forma exitosa.`
        });
        onConfirmedCloseCashier();
        sendToPrintAndDownloadCashierTicket(
          {
            cashierInformation,
            ticket: response?.data?.closeCashierId,
            date: undefined,
            idSale: response?.data?.closeCashierId,
            difference
          },
          `corte_de_caja_#${response?.data?.closeCashierId}.pdf`
        );
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

  const getListOfTodaysPayments = useCallback(async () => {
    try {
      const queryParams = queryString.stringify({
        date: moment().format(DateFormats.SQL)
      });
      const url = `${Endpoints.Cashier}${Endpoints.StorePayments}?`.replace(
        ':idStore',
        DEFAULT_STORE.id.toString()
      );
      const response = await API.get(`${url}${queryParams}`);
      if (response) {
        setTodaysPayments(response?.data?.payments);
      }
    } catch (err) {
      onShowAlert({
        severity: 'error',
        title: 'Error al Obtener lista de pagos del día',
        autoHideDuration: 3000,
        body: 'Ocurrió un problema'
      });
      throw err;
    }
  }, [onShowAlert]);

  const getIncomeData = useCallback(async () => {
    try {
      const queryParams = queryString.stringify({
        idStore: DEFAULT_STORE.id
      });
      const response = await API.get(
        `${Endpoints.GetDayIncome}?${queryParams}`
      );
      if (response) {
        setIncome({
          card: response.data.find(each => each.paymentMethod === 'Tarjeta')
            ?.value,
          cash: response.data.find(each => each.paymentMethod === 'Efectivo')
            ?.value
        });
      }
    } catch (err) {
      const { title, message, severity } = getErrorData(err);
      onShowAlert({
        severity,
        title,
        autoHideDuration: 8000,
        body: message
      });
      throw err;
    }
  }, [onShowAlert]);

  useEffect(() => {
    getListOfTodaysPayments();
    getIncomeData();
  }, [getIncomeData, getListOfTodaysPayments]);

  useEffect(() => {
    const { card, cash } = income;
    const totalOfCashPayments =
      todaysPayments?.length > 0
        ? Number(
            todaysPayments.reduce(
              (total, obj) => obj.cost && Number(obj.cost) + total,
              0
            )
          ) * -1
        : Number(0.0);
    setCashier({
      initial: Number(1000.0),
      cashSales: cash ? Number(cash) : 0.0,
      cardSales: card ? Number(card) : 0.0,
      cashInCashier: Number(getValues('cash')),
      terminalAmountRegistered: Number(getValues('card')),
      totalOfCashPayments
    });
  }, [
    getIncomeData,
    getListOfTodaysPayments,
    getValues,
    income,
    todaysPayments
  ]);

  useEffect(() => {
    setCashierInformation([
      {
        title: 'Fondo Inicial de Caja:',
        cost: cashier.initial
      },
      {
        title: 'Ventas Regist. Efectivo:',
        cost: cashier.cashSales
      },
      {
        title: 'Ventas Regist. Tarjeta:',
        cost: cashier.cardSales
      },
      {
        title: 'Efectivo en Caja:',
        cost: cashier.cashInCashier
      },
      {
        title: 'Corte en Terminal:',
        cost: cashier.terminalAmountRegistered
      },
      {
        title: 'Total de Pagos con efectivo:',
        cost: cashier.totalOfCashPayments
      }
    ]);
  }, [cashier]);

  useEffect(() => {
    // calculate the difference if existing
    const totalInCashier = cashier.initial + cashier.cashSales;
    const totalAmountValid =
      cashier.cashInCashier - cashier.totalOfCashPayments;
    const newDiff = -totalInCashier + totalAmountValid;
    setDifference(newDiff);
  }, [
    cashier.cashInCashier,
    cashier.cashSales,
    cashier.initial,
    cashier.totalOfCashPayments
  ]);

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
                  <Text
                    variant="body2"
                    text={Contents[language]?.PaymentsSubtitle}
                    fontSize={13}
                  />
                  <br />
                  {todaysPayments ? (
                    todaysPayments.map((each: Object) => {
                      return (
                        <InfoRow
                          title={each.concept}
                          value={each.cost}
                          isValueCurrency
                        />
                      );
                    })
                  ) : (
                    <InfoRow
                      title="No se registró ningún pago hoy"
                      value={null}
                    />
                  )}
                </Grid>
                <br />
                <Text
                  variant="body2"
                  text={Contents[language]?.SummarySubtitle}
                  fontSize={13}
                />
                <br />
                <Grid component="nav">
                  {cashierInformation.map((each: Object) => {
                    return (
                      <InfoRow
                        title={each?.title}
                        value={each.cost}
                        isValueCurrency
                      />
                    );
                  })}
                  <Box>
                    <InfoRowTotal
                      title="Diferencia: "
                      value={difference}
                      isValueCurrency
                    />
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
