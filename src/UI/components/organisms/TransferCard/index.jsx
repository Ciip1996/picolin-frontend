// @flow
import React from 'react';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import { currencyFormatter } from 'UI/utils';
import TextBox from 'UI/components/atoms/TextBox';
import Text from 'UI/components/atoms/Text';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';

import { useStyles } from './styles';

type TransferCardProps = {
  gender: string,
  size: number,
  type: string,
  color: string,
  cost: number,
  description: string,
  characteristic: string
};

const TransferCard = (props: TransferCardProps) => {
  const { gender, size, type, color, cost, description, characteristic } = props;
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CustomIconButton
        tooltipText="Quitar de la lista"
        wrapperStyle={classes.deleteButtonWrapper}
        className={classes.deleteButton}
        aria-label="delete"
      >
        <CloseIcon />
      </CustomIconButton>
      <Box className={classes.header} spacing={2}>
        <Box width={70}>
          <TextBox name="amount" type="number" value="1" />
        </Box>
        <Box width={24} />
        <Text variant="h2" className={classes.title} text={description} />
      </Box>
      <Grid container margin={10} spacing={3}>
        <Grid item xs>
          <Chip
            label={currencyFormatter(cost)}
            style={{ color: '#AD4DFF' }}
            className={classes.Chip}
          />
        </Grid>
        <Grid item xs>
          <Chip label={`Talla ${size}`} className={classes.Chip} />
        </Grid>
        <Grid item xs>
          <Chip label={type} className={classes.Chip} />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs>
          <Chip label={color} className={classes.Chip} />
        </Grid>
        <Grid item xs>
          <Chip label={characteristic} className={classes.Chip} />
        </Grid>
        <Grid item xs>
          <Chip label={gender} className={classes.Chip} />
        </Grid>
      </Grid>
    </Card>
  );
};

TransferCard.defaultProps = {
  gender: 'Unisex',
  size: 24,
  type: 'Ropón',
  color: 'Nacarado',
  cost: 999999.98,
  description: 'Ropón Mini: Ariete Blanco ',
  characteristic: 'Chantung de seda'
};
export default TransferCard;
