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
// import TextBox from 'UI/components/atoms/TextBox';
import Text from 'UI/components/atoms/Text';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';

import { useStyles } from './styles';

type SaleCardProps = {
  product: Object,
  quantityOfProducts: number,
  onRemoveItem: any => any
  // onAmountOfProductsChanged: (Object, any, number) => any
  // errors: any
};

const SaleCard = (props: SaleCardProps) => {
  const {
    product,
    quantityOfProducts,
    onRemoveItem
    // onAmountOfProductsChanged
    // errors
  } = props;

  const {
    productCode,
    gender,
    size,
    type,
    color,
    salePrice,
    material,
    stock,
    description
  } = product;

  const prepareRemoveItem = () => {
    onRemoveItem(productCode);
  };

  // const prepareModifyAmountOfItems = (e, quantityString) => {
  //   const quantityNumber = parseInt(quantityString, 10) || null;
  //   onAmountOfProductsChanged(productCode, quantityNumber, stock);
  // };

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
        <Box className={classes.header} spacing={2}>
          <Box className={classes.amountOfProducts}>
            <Text
              variant="h2"
              name={productCode}
              // inputType="number"
              text={`${quantityOfProducts}`}
              // onChange={prepareModifyAmountOfItems}
              // error={!!errors[productCode]}
            />
          </Box>
          <Box width={24} />
          <Text variant="h2" className={classes.title} text={`${productCode}`} />
          <Text
            variant="h2"
            className={classes.salePrice}
            text={`${currencyFormatter(salePrice)}`}
          />
          <Box width={24} />
          <CustomIconButton
            tooltipText="Quitar de la venta"
            className={classes.deleteButton}
            aria-label="delete"
            onClick={prepareRemoveItem}
          >
            <CloseIcon />
          </CustomIconButton>
        </Box>
        <Text variant="subtitle1" className={classes.description} text={`${description}`} />
        <Grid container marginTop={6} spacing={2}>
          <Grid item xs={4} lg={2}>
            <Chip label={`${stock} en stock`} className={classes.Chip} />
          </Grid>
          <Grid item xs={4} lg={2}>
            <Chip label={`Talla ${size}`} className={classes.Chip} />
          </Grid>
          <Grid item xs={4} lg={2}>
            <Chip label={type} className={classes.Chip} />
          </Grid>
          <Grid item xs={4} lg={2}>
            <Chip label={color} className={classes.Chip} />
          </Grid>
          <Grid item xs={4} lg={2}>
            <Chip label={material} className={classes.Chip} />
          </Grid>
          <Grid item xs={4} lg={2}>
            <Chip label={gender} className={classes.Chip} />
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default SaleCard;
