// @flow
import React, { useEffect } from 'react';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { useFormContext } from 'react-hook-form';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import { currencyFormatter } from 'UI/utils';
import Text from 'UI/components/atoms/Text';

import { useStyles } from './styles';

type ProductCardProps = {
  product: Object
};

const ProductCard = (props: ProductCardProps) => {
  const { product } = props;

  const {
    productCode,
    gender,
    pSize,
    type,
    color,
    salePrice,
    material,
    stock,
    name
  } = product;

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
        required:
          'Cantidad requerida, elija un número menor al de stock en existencia',
        min: {
          value: 1,
          message: 'La cantidad debe ser mayor a 0'
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
          <FormHelperText>
            {errors[productCode] && errors[productCode].message}
          </FormHelperText>
        </FormControl>
        <Box className={classes.header} spacing={2}>
          <Box className={classes.amountOfProducts} />
          <Box width={24} />
          <Text
            variant="h2"
            className={classes.title}
            text={`${productCode}`}
          />
          <Text
            variant="h2"
            className={classes.salePrice}
            text={`${currencyFormatter(salePrice)}`}
          />
          <Box width={24} />
        </Box>
        <Text variant="subtitle1" className={classes.name} text={`${name}`} />
        <Grid container marginTop={6} spacing={2}>
          <Grid item xs={4} lg={2}>
            <Chip label={`Talla ${pSize}`} className={classes.Chip} />
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

export default ProductCard;
