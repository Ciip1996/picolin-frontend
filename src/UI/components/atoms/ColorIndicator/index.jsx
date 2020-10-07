// @flow
import React from 'react';
import { StatusColor, useStyles } from './styles';

type ColorIndicatorProps = {
  width: number,
  height: number,
  color: string,
  onClick?: (info: any) => void,
  onMouseEnter?: (info: any) => void,
  info: any,
  status: string,
  customStyle: Object
};

const ColorIndicator = (props: ColorIndicatorProps) => {
  const { color, height, width, onClick, onMouseEnter, info, status, customStyle } = props;
  const classes = useStyles();

  const style = {
    width,
    height,
    backgroundColor: color || StatusColor[status],
    ...customStyle
  };

  const handleMouseEnter = () => onMouseEnter && onMouseEnter(info);
  const handleClick = () => {
    onClick && onClick(info);
  };

  return (
    <button
      aria-label="Show details"
      type="button"
      className={classes.root}
      style={style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      status={status}
    />
  );
};

ColorIndicator.defaultProps = {
  width: 50,
  height: 50,
  color: undefined,
  info: undefined,
  status: '',
  onClick: undefined,
  onMouseEnter: undefined,
  customStyle: undefined
};

export default ColorIndicator;
