// @flow
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Card from '@material-ui/core/Card';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Text from 'UI/components/atoms/Text';
import TextBox from 'UI/components/atoms/TextBox';
import ActionButton from 'UI/components/atoms/ActionButton';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { AddIcon, colors } from 'UI/res';
import { Endpoints } from 'UI/constants/endpoints';
import Contents from './strings';
import { useStyles } from './styles';

const language = localStorage.getItem('language');

type SummaryCardProps = {
  initialValues: Object
};

const SummaryCard = (props: SummaryCardProps) => {
  const { initialValues } = props;
  const classes = useStyles();

  const [comboValues, setComboValues] = useState({});

  const { register, errors, setValue, getValues } = useFormContext();

  const values = getValues();
  console.log(values);

  useEffect(() => {
    register({ name: 'idPaymentMethod' }, { required: `El tipo de pago es requerido` });
    // register({ name: 'discount' }, { ...PRODUCT_DESCRIPTION_VALIDATION });
  }, [register]);

  const onSelectChanged = (name: string, value: any) => {
    setComboValues(prevState => ({ ...prevState, [name]: value }));
    setValue(name, value?.id ? value?.id : value?.title, true);
  };

  const handleTextChange = (name?: string, value: any) => {
    setValue(name, value, true);
    setComboValues({ ...comboValues });
  };

  return (
    <Card className={classes.card}>
      <h1 className={classes.title}>{Contents[language]?.HeaderTitle}</h1>
      <AutocompleteSelect
        className={classes.Payment}
        name="idPaymentMethod"
        placeholder={Contents[language]?.Payment}
        url={Endpoints.PaymentMethods}
        error={!!errors.idPaymentMethod}
        errorText={errors.idPaymentMethod && errors.idPaymentMethod.message}
        onSelect={onSelectChanged}
      />
      <TextBox
        className={classes.Formulary}
        name="discount"
        label={Contents[language]?.Discount}
        inputType="currency"
        inputRef={register}
        error={!!errors.discount}
        helperText={errors.discount && errors.discount.message}
        onChange={handleTextChange}
      />
      <TextBox
        outPutValue
        className={classes.Formulary}
        name="apart"
        label={Contents[language]?.Apart}
        inputType="text"
        inputRef={register}
        error={!!errors.discount}
        helperText={errors.discount && errors.discount.message}
        onChange={handleTextChange}
      />
      <FormControlLabel
        name="invoice"
        control={<Switch color="primary" />}
        className={classes.Invoice}
        // checked={}
        label={Contents[language]?.invoice}
        labelPlacement="start"
        inputRef={register}
        error={!!errors.invoice}
        helperText={errors.invoice && errors.invoice.message}
      />
      <List component="nav" className={classes.List}>
        <ListItem divider className={classes.Item}>
          <ListItemText
            primary={<span className={classes.Description}>{Contents[language]?.Deposit}</span>}
          />
          <Text
            name="deposit"
            inputRef={register}
            variant="body1"
            text={Contents[language]?.Subtitle}
            fontSize={14}
          />
          {/* <ListItemText
            secondary={<span className={classes.CostDescription}>{deposit || 'N/A'}</span>}
          /> */}
        </ListItem>
        {/* <ListItem divider className={classes.Item}>
          <ListItemText
            primary={<span className={classes.Description}>{Contents[language]?.Subtotal}</span>}
          />
          <ListItemText
            secondary={<span className={classes.CostDescription}>{subtotal || '--'}</span>}
          />
        </ListItem>
        <ListItem divider className={classes.Item}>
          <ListItemText
            primary={<span className={classes.Description}>{Contents[language]?.Taxes}</span>}
          />
          <ListItemText
            secondary={<span className={classes.CostDescription}>{vat || '--'}</span>}
          />
        </ListItem>
        <ListItem divider className={classes.Item}>
          <ListItemText
            primary={<span className={classes.Description}>{Contents[language]?.lblDiscount}</span>}
          />
          <ListItemText
            secondary={<span className={classes.CostDescription}>{discount || '--'}</span>}
          />
        </ListItem>
        <br />
        <ListItem className={classes.Item}>
          <ListItemText primary={<span className={classes.Total}>TOTAL</span>} />
          <ListItemText secondary={<span className={classes.TotalCost}>{total || '--'}</span>} />
        </ListItem> */}
      </List>
      <ActionButton
        type="submit"
        status="success"
        className={classes.Finish}
        text={Contents[language]?.Conclude}
        // onClick={toggleDrawer('isAddProductDrawerOpen', !uiState.isAddProductDrawerOpen)}
      >
        <AddIcon fill={colors.white} size={18} />
      </ActionButton>
    </Card>
  );
};

SummaryCard.defaultProps = {
  deposit: 'N/A',
  subtotal: '$1,299.00',
  vat: '$207.84',
  discount: '$0.00',
  total: '$1506.84'
};

export default SummaryCard;
