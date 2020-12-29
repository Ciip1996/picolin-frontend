// @flow
import React from 'react';
import { useStyles } from './styles';

// TODO: this layout template has been removed from the project.

type DataTableLayoutProps = {
  children: any
};

const DataTableLayout = (props: DataTableLayoutProps) => {
  const { children } = props;
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>{children}</div>
    </>
  );
};
export default DataTableLayout;
