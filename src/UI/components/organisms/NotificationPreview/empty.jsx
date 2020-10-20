// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import { NotificationEmptyImg } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

const NotificationEmpty = () => {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      style={{ position: 'relative', minHeight: '80vh' }}
    >
      <EmptyPlaceholder
        title="Nothing to show here"
        subtitle="Your notifications will appear here."
      >
        <NotificationEmptyImg />
        <EmptyPlaceholder subtitle="Please check back later" />
      </EmptyPlaceholder>
    </Grid>
  );
};

export default NotificationEmpty;
