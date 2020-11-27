// @flow
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import { currencyFormatter } from 'UI/utils';
import { Tooltip } from '@material-ui/core';

import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import Text from 'UI/components/atoms/Text';
import { useStyles } from './styles';

type ComboCardProps = {
  product: Object,
  onRemoveItem: string => any
};

const ComboCard = (props: ComboCardProps) => {
  // debugger;
  const { product, onRemoveItem } = props;
  const { productCode, gender, size, type, color, cost, description, characteristic } = product;
  const classes = useStyles();

  const prepareRemoveItem = () => {
    onRemoveItem(productCode);
  };

  const { register, setValue } = useFormContext();

  useEffect(() => {
    register({
      name: productCode
    });
    setValue(productCode, 1, true);
  }, [productCode, register, setValue]);

  return (
    <Card className={classes.card}>
      <input name={productCode} ref={register} style={{ display: 'none' }} />
      <Box className={classes.header} spacing={2}>
        <Tooltip title={`${currencyFormatter(cost)}`}>
          <span>
            <Text variant="h2" className={classes.price} text={`${currencyFormatter(cost)}`} />
          </span>
        </Tooltip>
        <Tooltip title={`${productCode}: ${description}`} placement="top">
          <span>
            <Text variant="h2" className={classes.title} text={`${productCode}: ${description}`} />
          </span>
        </Tooltip>
        <Box width={24} />
        <CustomIconButton
          tooltipText="Quitar de la venta"
          wrapperStyle={classes.deleteButtonWrapper}
          className={classes.deleteButton}
          aria-label="delete"
          onClick={prepareRemoveItem}
        >
          <CloseIcon />
        </CustomIconButton>
      </Box>
      <Box height={10} />
      <Grid container>
        <Grid item xs={2}>
          <Tooltip title={gender}>
            <Chip label={gender} className={classes.chip} />
          </Tooltip>
        </Grid>
        <Grid item xs={3}>
          <Tooltip title={`Talla ${size}`}>
            <Chip label={`Talla ${size}`} className={classes.chip} />
          </Tooltip>
        </Grid>
        <Grid item xs={2}>
          <Tooltip title={type}>
            <Chip label={type} className={classes.chip} />
          </Tooltip>
        </Grid>
        <Grid item xs={2}>
          <Tooltip title={color}>
            <Chip label={color} className={classes.chip} />
          </Tooltip>
        </Grid>
        <Grid item xs={3}>
          <Tooltip title={characteristic}>
            <Chip label={characteristic} className={classes.chip} />
          </Tooltip>
        </Grid>
      </Grid>
    </Card>
  );
};

ComboCard.defaultProps = {
  product: {
    productCode: 'PASDF2141241',
    gender: 'Niña',
    size: 1,
    type: 'Ropón',
    color: 'Blanco',
    cost: 999999.98,
    description:
      'Ropón Mini con cosAS QUE TENGO QUEE EXPLICAR AQUI GGGG adfa sdf adsf asdfdasf aGG',
    characteristic: ' Shantung de seda '
  }
};
export default ComboCard;
