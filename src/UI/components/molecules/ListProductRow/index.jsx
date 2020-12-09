// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Tooltip } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';

import { useStyles } from './styles';

type ListProductRowProps = {
  product: Object
};

const ListProductRow = (props: ListProductRowProps) => {
  const { product = {} } = props;
  const { productCode, type, gender, color, characteristic } = product;

  const classes = useStyles();

  return (
    <Grid container>
      <strong>{productCode || ''}</strong>
      <br />
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Tooltip title={`${type}`}>
            <Chip label={`${type}`} className={classes.chip} />
          </Tooltip>
        </Grid>
        <Grid item xs={3}>
          <Tooltip title={`${gender}`}>
            <Chip label={`${gender}`} className={classes.chip} />
          </Tooltip>
        </Grid>
        <Grid item xs={3}>
          <Tooltip title={`${color}`}>
            <Chip label={`${color}`} className={classes.chip} />
          </Tooltip>
        </Grid>
        <Grid item xs={3}>
          <Tooltip title={`${characteristic}`}>
            <Chip label={`${characteristic}`} className={classes.chip} />
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ListProductRow;
