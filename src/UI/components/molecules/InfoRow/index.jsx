// @flow
import React from 'react';
import Text from 'UI/components/atoms/Text';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { currencyFormatter } from 'UI/utils';
import { useStyles } from './styles';

type InfoRowProps = {
  title: string | number,
  value: any,
  isValueCurrency: boolean
};

const InfoRow = (props: InfoRowProps) => {
  const { title, value, isValueCurrency } = props;
  const classes = useStyles();

  return (
    <>
      <Grid container className={classes.row}>
        <Grid item xs={9}>
          <span className={classes.title}>{title}</span>
        </Grid>
        <Grid item xs={3}>
          <Text
            name="display_subtotal"
            className={classes.value}
            variant="body1"
            text={
              value !== null &&
              value !== Number.NaN &&
              value !== '' &&
              value !== false &&
              value !== undefined &&
              !Number.isNaN(value) &&
              isValueCurrency
                ? currencyFormatter(value)
                : '--'
            }
            fontSize={16}
          />
        </Grid>
        <Divider className={classes.divider} />
      </Grid>
    </>
  );
};

InfoRow.defaultProps = {
  title: '--',
  isValueCurrency: false
};

export default InfoRow;
