// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useStyles } from './styles';

type EmptyPlaceholderProps = {
  children: any,
  title?: string,
  subtitle?: string
};

const EmptyPlaceholder = (props: EmptyPlaceholderProps) => {
  const { children, title, subtitle } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <>
        <Typography variant="h1" component="div">
          <Box className={classes.title}>{title}</Box>
        </Typography>
        <Typography variant="body2" component="div">
          <Box className={classes.subtitle}>{subtitle}</Box>
        </Typography>
      </>
      <div className={classes.children}>{children}</div>
    </div>
  );
};
EmptyPlaceholder.defaultProps = {
  children: undefined,
  title: '',
  subtitle: ''
};

export default EmptyPlaceholder;
