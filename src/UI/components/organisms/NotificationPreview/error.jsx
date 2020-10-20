// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import { NotificationNotFoundImg } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

const NotificationError = () => {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      style={{ position: 'relative', minHeight: '80vh' }}
    >
      <EmptyPlaceholder
        title="Notifications Not Found"
        subtitle="We experienced some issues while receiving your notifications."
      >
        <NotificationNotFoundImg />
        <EmptyPlaceholder subtitle="Please try again later" />
      </EmptyPlaceholder>
    </Grid>
  );
};

export default NotificationError;
