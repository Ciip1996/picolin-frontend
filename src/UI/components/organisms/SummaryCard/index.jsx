// @flow
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Card from '@material-ui/core/Card';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Text from 'UI/components/atoms/Text';
import TextBox from 'UI/components/atoms/TextBox';
import ActionButton from 'UI/components/atoms/ActionButton';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { AddIcon, colors } from 'UI/res';
import { Endpoints } from 'UI/constants/endpoints';
import { currencyFormatter } from 'UI/utils';
import type { MapType } from 'types';
import Contents from './strings';
import { useStyles } from './styles';

const language = localStorage.getItem('language');

// type SummaryCardProps = {
//   defaultValues: Object
// };

const SummaryCard = () => {
  // const { defaultValues } = props;
  // console.log('defaultValues', defaultValues);
  const classes = useStyles();
  const [comboValues, setComboValues] = useState<MapType>({});

  const { setValue, watch, errors, getValues } = useFormContext();
  // const watchFields = watch(); // when pass nothing as argument, you are watching everything
  // const values = getValues();
  // console.log('useFormContext values:', values);

  const onSelectionChange = (name: string, value: any) => {
    setComboValues((prevState: MapType): MapType => ({ ...prevState, [name]: value }));
    setValue(name, value?.id ? value.id : value, true);
  };

  const onSwitcherChange = (event: Object) => {
    setValue([event.target.name], event.target.checked, true);
    calculateCosts();
  };

  const calculateCosts = () => {
    // TODO
    debugger;
  };

  // const handleTextChange = (name: string, value: any) => {
  //   setValue(name, value, true);
  //   setFormValues(prevState => ({ ...prevState, [name]: value }));
  // };

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
        inputType="text"
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
                className={classes.currencyValue}
                variant="body1"
                // text={watchFields.subtotal ? currencyFormatter(watchFields.subtotal) : 'N/A'}
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
                className={classes.currencyValue}
                variant="body1"
                // text={watchFields.vat ? currencyFormatter(watchFields.vat) : 'N/A'}
                fontSize={16}
              />
            }
          />
        </ListItem>
        <ListItem divider className={classes.Item}>
          <ListItemText
            primary={<span className={classes.Description}>{Contents[language]?.lblDiscount}</span>}
          />
          <ListItemText
            secondary={
              <Text
                className={classes.currencyValue}
                name="display_discount"
                variant="body1"
                // text={watchFields.discount ? currencyFormatter(watchFields.discount) : '--'}
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
                // text={watchFields.total ? currencyFormatter(watchFields.total) : '--'}
                fontSize={18}
              />
            }
          />
        </ListItem>
        <Box display="flex" flex={1} justifyContent="flex-end" alignItems="center">
          <ActionButton
            type="submit"
            status="success"
            className={classes.submitButton}
            text={Contents[language]?.Conclude}
            // onClick={toggleDrawer('isAddProductDrawerOpen', !uiState.isAddProductDrawerOpen)}
          >
            <AddIcon fill={colors.white} size={18} />
          </ActionButton>
        </Box>
      </Box>
    </Card>
  );
};

export default SummaryCard;
