// @flow
import React from 'react';
import { useStyles } from './style';

type DateDividerProps = {
  date: string
};

const DateDivider = (props: DateDividerProps) => {
  const { date } = props;
  const classes = useStyles();
  return <div className={classes.date}>{date}</div>;
};

export default DateDivider;
