// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './styles';

type TextProps = {
  text: string,
  fontWeight: number | null,
  cropped: boolean,
  fontSize: number | null,
  customStyle: Object,
  variant: 'h1' | 'h2' | 'subtitle1' | 'body1' | 'body2'
};

export default function Text(props: TextProps) {
  const {
    text,
    fontWeight,
    cropped,
    fontSize,
    customStyle,
    variant,
    ...rest
  } = props;
  const classes = useStyles();
  return (
    <Typography
      style={{ fontWeight, fontSize, ...customStyle }}
      className={cropped ? classes.cropped : classes.regular}
      variant={variant}
      {...rest}
    >
      {text}
    </Typography>
  );
}
Text.defaultProps = {
  fontWeight: null,
  fontSize: null,
  cropped: false,
  customStyle: {}
};
