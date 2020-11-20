// @flow
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Card from '@material-ui/core/Card';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import Text from 'UI/components/atoms/Text';
import TextBox from 'UI/components/atoms/TextBox';
import ActionButton from 'UI/components/atoms/ActionButton';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { AddIcon, colors } from 'UI/res';
import { Endpoints } from 'UI/constants/endpoints';
import { currencyFormatter } from 'UI/utils';
import type { MapType } from 'types';
import { isEmpty } from 'lodash';
import Contents from './strings';
import { useStyles } from './styles';

const language = localStorage.getItem('language');

type SummaryCardProps = {
  watchFields: Object,
  onNewItemAdded: any => any
};

const SummaryCard = (props: SummaryCardProps) => {
  const { watchFields, onNewItemAdded } = props;
  const [comboValues, setComboValues] = useState<MapType>({});

  const { register, unregister, setValue, errors, getValues, triggerValidation } = useFormContext();
  const classes = useStyles();

  const onSelectionChange = (name: string, value: any) => {
    setComboValues((prevState: MapType): MapType => ({ ...prevState, [name]: value }));
    setValue(name, value?.id ? value.id : value, true);
    onNewItemAdded();
  };

  const onSwitcherChange = (event: Object) => {
    setValue([event.target.name], event.target.checked, false);
    onNewItemAdded();
  };

  useEffect(() => {
    // This hook validates if the field received is going to be required or not depending if the payment method is cash or not
    if (comboValues?.idPaymentMethod?.id === 2 && !comboValues.received) {
      unregister('received');
      register(
        { name: 'received' },
        {
          required: Contents[language]?.receivedRequired,
          validate: value => {
            return (
              parseFloat(value) >= parseFloat(watchFields.total) ||
              `Debe ser mayor o igual que el total`
            );
          }
        }
      );
    } else if (!comboValues?.idPaymentMethod || comboValues?.idPaymentMethod?.id !== 2) {
      unregister('received');
      triggerValidation();
    }
  }, [comboValues, register, triggerValidation, unregister, watchFields.total]);

  const hasAnImportantError = !!errors?.received || !!errors?.discount;
  // console.log('hasAnImportantError', hasAnImportantError);
  console.log(errors);
  return (
    <Card className={classes.card}>
      <h1 className={classes.title}>{Contents[language]?.HeaderTitle}</h1>
      <AutocompleteSelect
        className={classes.formulary}
        name="idPaymentMethod"
        selectedValue={comboValues.idPaymentMethod}
        placeholder={Contents[language]?.Payment}
        error={!!errors?.idPaymentMethod}
        errorText={errors?.idPaymentMethod && errors?.idPaymentMethod.message}
        url={Endpoints.PaymentMethods}
        onSelect={onSelectionChange}
      />
      <TextBox
        className={classes.formulary}
        disabled={!!(comboValues?.idPaymentMethod?.id !== 2)}
        inputType="currency"
        name="received"
        label={Contents[language]?.received}
        error={!!errors?.received}
        errorText={errors?.received && errors?.received.message}
        onChange={onSelectionChange}
        value={getValues('received') || ''}
      />
      <TextBox
        className={classes.formulary}
        inputType="currency"
        name="discount"
        label={Contents[language]?.Discount}
        error={!!errors?.discount}
        errorText={errors?.discount && errors?.discount.message}
        onChange={onSelectionChange}
        value={getValues('discount') || ''}
      />
      {/* <TextBox
        outPutValue
        className={classes.formulary}
        name="apart"
        label={Contents[language]?.Apart}
        inputType="text"
        inputRef={register}
        error={!!errors.discount}
        helperText={errors.discount && errors.discount.message}
        onChange={handleTextChange}
      /> */}
      <FormControlLabel
        name="invoice"
        control={<Switch color="primary" />}
        className={classes.invoice}
        checked={getValues('invoice') || false}
        onChange={onSwitcherChange}
        label={Contents[language]?.invoice}
        labelPlacement="start"
        error={!!errors.invoice}
        helperText={errors.invoice && errors.invoice.message}
      />
      <List component="nav" className={classes.List}>
        {/* <ListItem divider className={classes.Item}>
          <ListItemText
            primary={<span className={classes.Description}>{Contents[language]?.Deposit}</span>}
          />
          <ListItemText
            secondary={
              <Text
                className={classes.currencyValue}
                name="deposit"
                variant="body1"
                text={watchFields.deposit ? currencyFormatter(watchFields.deposit) : 'N/A'}
                fontSize={16}
              />
            }
          />
        </ListItem> */}
        <ListItem divider className={classes.Item}>
          <ListItemText
            primary={<span className={classes.Description}>{Contents[language]?.Subtotal}</span>}
          />
          <ListItemText
            secondary={
              <Text
                name="display_subtotal"
                className={classes.currencyValue}
                variant="body1"
                text={watchFields.subtotal ? currencyFormatter(watchFields.subtotal) : '--'}
                fontSize={16}
              />
            }
          />
        </ListItem>
        <ListItem divider className={classes.Item}>
          <ListItemText
            primary={<span className={classes.Description}>{Contents[language]?.Taxes}</span>}
          />
          <ListItemText
            secondary={
              <Text
                name="display_taxes"
                className={classes.currencyValue}
                variant="body1"
                text={watchFields.iva ? currencyFormatter(watchFields.iva) : 'N/A'}
                fontSize={16}
              />
            }
          />
        </ListItem>
        <ListItem divider className={classes.Item}>
          <ListItemText
            primary={<span className={classes.Description}>{Contents[language]?.Discount}</span>}
          />
          <ListItemText
            secondary={
              <Text
                className={[classes.currencyValue, classes.discount]}
                name="display_discount"
                variant="body1"
                text={
                  watchFields?.discount && !hasAnImportantError
                    ? currencyFormatter(watchFields.discount * -1)
                    : '--'
                }
                fontSize={16}
              />
            }
          />
        </ListItem>

        <ListItem divider className={classes.Item}>
          <ListItemText
            primary={<span className={classes.Description}>{Contents[language]?.change}</span>}
          />
          <ListItemText
            secondary={
              <Text
                className={classes.currencyValue}
                name="display_change"
                variant="body1"
                text={
                  watchFields?.change && !hasAnImportantError
                    ? currencyFormatter(watchFields?.change)
                    : '--'
                }
                fontSize={16}
              />
            }
          />
        </ListItem>
        <br />
      </List>
      <Box className={classes.List}>
        <ListItem className={classes.Item}>
          <ListItemText primary={<span className={classes.Total}>TOTAL</span>} />
          <ListItemText
            secondary={
              <Text
                name="diaplay_total"
                className={classes.TotalCost}
                variant="body1"
                text={
                  watchFields?.totalWithDiscount
                    ? currencyFormatter(watchFields.totalWithDiscount)
                    : '--'
                }
                fontSize={18}
              />
            }
          />
        </ListItem>
        <FormControl component="fieldset" className={classes.errorMessage} error={!isEmpty(errors)}>
          <FormHelperText>
            {isEmpty(errors)
              ? 'Revise el formulario antes de finalizar.'
              : 'Corrija los errores antes de finalizar.'}
          </FormHelperText>
        </FormControl>

        <Box display="flex" flex={1} justifyContent="flex-end" alignItems="center">
          <ActionButton
            type="submit"
            status="success"
            className={classes.submitButton}
            text={Contents[language]?.Conclude}
          >
            <AddIcon fill={colors.white} size={18} />
          </ActionButton>
        </Box>
      </Box>
    </Card>
  );
};

export default SummaryCard;
