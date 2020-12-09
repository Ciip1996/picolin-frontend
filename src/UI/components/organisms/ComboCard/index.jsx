// @flow
import React from 'react';
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
import ListProductRow from 'UI/components/molecules/ListProductRow';
import { useStyles } from './styles';

type ComboCardProps = {
  products: Object,
  onRemoveItem: string => any
};

const ComboCard = (props: ComboCardProps) => {
  const { products = {}, onRemoveItem } = props;

  const { id, ajuar, blanket, diaperRacks, footwear } = products;

  const classes = useStyles();

  const prepareRemoveItem = () => {
    onRemoveItem(id);
  };

  const { register } = useFormContext();

  // useEffect(() => {
  // register({
  //   name: productCode
  // });
  // setValue(productCode, 1, true);
  // }, [register, setValue]);

  return (
    <Card className={classes.card}>
      <input name="combo 1 productCode" ref={register} style={{ display: 'none' }} />
      <Box className={classes.header} spacing={2}>
        {/* <Tooltip title={`${1}`}>
          <span>
            <Text variant="h2" className={classes.amount} text={`${1}`} />
          </span>
        </Tooltip> */}
        <Tooltip title="Paquete Bautizo" placement="top">
          <span style={{ width: '100%' }}>
            <Text variant="h2" className={classes.title} text="Paquete Bautizo" />
          </span>
        </Tooltip>
        <Tooltip title={`${currencyFormatter(800)}`}>
          <span>
            <Text variant="h2" className={classes.price} text={`${currencyFormatter(800)}`} />
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
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} lg={3}>
          <Tooltip
            // avatar={<Avatar>C</Avatar>}
            arrow
            title={<ListProductRow product={footwear} />}
            classes={{ tooltip: classes.noMaxWidth }}
          >
            <Chip label={`Calzado: ${footwear?.productCode}`} className={classes.chip} />
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Tooltip
            // avatar={<Avatar>Ajuar</Avatar>}
            arrow
            title={<ListProductRow product={ajuar} />}
            classes={{ tooltip: classes.noMaxWidth }}
          >
            <Chip label={`Ajuar: ${ajuar?.productCode}`} className={classes.chip} />
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Tooltip
            arrow
            // avatar={<Avatar>S</Avatar>}
            title={<ListProductRow product={blanket} />}
            classes={{ tooltip: classes.noMaxWidth }}
          >
            <Chip label={`Sabana: ${blanket?.productCode}`} className={classes.chip} />
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Tooltip
            // avatar={<Avatar>P</Avatar>}
            arrow
            title={<ListProductRow product={diaperRacks} />}
            classes={{ tooltip: classes.noMaxWidth }}
          >
            <Chip label={`Pañalero: ${diaperRacks?.productCode}`} className={classes.chip} />
          </Tooltip>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ComboCard;
