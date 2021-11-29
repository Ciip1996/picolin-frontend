// @flow
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { fuseStyles } from 'UI/utils';
import { styles } from './styles';

type CustomAvatarProps = {
  acron?: string,
  mode?: 'acron' | 'image',
  variant?: 'circle' | 'rounded' | 'square',
  backgroundColor?: string,
  style?: Object,
  children?: any,
  rest: Object
};

const CustomAvatar = (props: CustomAvatarProps) => {
  const {
    acron,
    variant,
    style,
    backgroundColor,
    children,
    mode,
    rest
  } = props;

  const customStyle = fuseStyles([
    styles.Avatar,
    { ...style, backgroundColor }
  ]);

  return (
    <Avatar style={customStyle} variant={variant} {...rest}>
      {mode === 'acron' ? (
        <span>{acron || 'N/A'}</span>
      ) : (
        <span>{children}</span>
      )}
    </Avatar>
  );
};

CustomAvatar.defaultProps = {
  variant: 'circle',
  acron: 'N/A',
  backgroundColor: '',
  style: {},
  children: undefined,
  mode: 'acron',
  rest: {}
};

export default CustomAvatar;
