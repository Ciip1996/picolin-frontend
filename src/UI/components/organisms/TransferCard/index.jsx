// @flow
import React, { useEffect } from 'react';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { useFormContext } from 'react-hook-form';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import { currencyFormatter } from 'UI/utils';
import TextBox from 'UI/components/atoms/TextBox';
import Text from 'UI/components/atoms/Text';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';

import { useStyles } from './styles';

type TransferCardProps = {
  product: Object,
  quantityOfProducts: number,
  onRemoveItem: any => any,
  onAmountOfProductsChanged: (Object, any, number) => any
  // errors: any
};

const TransferCard = (props: TransferCardProps) => {
  const {
    product,
    quantityOfProducts,
    onRemoveItem,
    onAmountOfProductsChanged
    // errors
  } = props;

  const { productCode, gender, size, type, color, cost, characteristic, stock } = product;

  const prepareRemoveItem = () => {
    onRemoveItem(productCode);
  };

  const prepareModifyAmountOfItems = (e, quantityString) => {
    const quantityNumber = parseInt(quantityString, 10) || null;
    onAmountOfProductsChanged(productCode, quantityNumber, stock);
  };

  const { register, errors, setValue } = useFormContext({
    defaultValues: {
      [productCode]: 1
    }
  });

  const classes = useStyles({ error: !!errors[productCode] });

  useEffect(() => {
    register(
      {
        name: productCode
      },
      {
        required: 'Cantidad requerida, elija un número menor al de stock en existencia',
        min: {
          value: 1,
          message: 'La cantidad debe ser mayor a 0'
        },
        max: {
          value: stock,
          message: `La cantidad debe ser menor a ${stock}`
        }
      }
    );
    setValue(productCode, 1, true);
  }, [productCode, register, setValue, stock]);

  return (
    <>
      <Card
        style={errors[productCode] ? { borderColor: 'red' } : undefined}
        className={classes.card}
      >
        <FormControl
          component="fieldset"
          className={classes.errorMessage}
          error={!!errors[productCode]}
        >
          <FormHelperText>{errors[productCode] && errors[productCode].message}</FormHelperText>
        </FormControl>
        <CustomIconButton
          tooltipText="Quitar de la lista"
          wrapperStyle={classes.deleteButtonWrapper}
          className={classes.deleteButton}
          aria-label="delete"
          onClick={prepareRemoveItem}
        >
          <CloseIcon />
        </CustomIconButton>
        <Box className={classes.header} spacing={2}>
          <Box width={70}>
            <TextBox
              name={productCode}
              inputType="number"
              value={`${quantityOfProducts}`}
              onChange={prepareModifyAmountOfItems}
              error={!!errors[productCode]}
            />
          </Box>
          <Box width={24} />
          <Text
            variant="h2"
            className={classes.title}
            text={`${productCode} : ${stock} en stock`}
          />
        </Box>
        <Grid container margin={10} spacing={3}>
          <Grid item xs={4}>
            <Chip
              label={currencyFormatter(cost)}
              style={{ color: '#AD4DFF' }}
              className={classes.Chip}
            />
          </Grid>
          <Grid item xs={4}>
            <Chip label={`Talla ${size}`} className={classes.Chip} />
          </Grid>
          <Grid item xs={4}>
            <Chip label={type} className={classes.Chip} />
          </Grid>
          {/* </Grid> */}
          {/* <Grid container spacing={3}> */}
          <Grid item xs={4}>
            <Chip label={color} className={classes.Chip} />
          </Grid>
          <Grid item xs={4}>
            <Chip label={characteristic} className={classes.Chip} />
          </Grid>
          <Grid item xs={4}>
            <Chip label={gender} className={classes.Chip} />
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default TransferCard;
