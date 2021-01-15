// @flow
import React from 'react';
import Text from 'UI/components/atoms/Text';
import Box from '@material-ui/core/Box';
import { currencyFormatter } from 'UI/utils';
import { useStyles } from './styles';

type InfoRowTotalProps = {
  title: string | number,
  value: any,
  isValueCurrency: boolean
};

const InfoRowTotal = (props: InfoRowTotalProps) => {
  const { title, value, isValueCurrency } = props;
  const classes = useStyles({ value });

  return (
    <Box>
      <Box display="flex" flexDirection="row" justify="right" alignItems="center">
        <span className={classes.title}>{title}</span>
        <Text
          name="diaplay_total"
          className={classes.value}
          variant="body1"
          text={value && isValueCurrency ? currencyFormatter(value) : '--'}
          fontSize={18}
        />
      </Box>
    </Box>
  );
};

InfoRowTotal.defaultProps = {
  title: '--',
  isValueCurrency: false
};

export default InfoRowTotal;
