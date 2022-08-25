// @flow
import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { styles } from './styles';

type CustomSkeletonProps = {
  variant: 'text' | 'rect' | 'circular',
  height: number | string,
  width: number | string,
  style: Object,
  color: string,
  radius: number,
  onContainer: boolean
};

const CustomSkeleton = (props: CustomSkeletonProps) => {
  const { variant, height, width, color, radius, style, onContainer } = props;

  const customStyle = {
    backgroundColor: color,
    borderRadius: radius,
    ...style,
    ...(onContainer && styles.onContainer)
  };

  return (
    <Skeleton
      variant={variant}
      width={width}
      height={height}
      style={
        variant === 'rect'
          ? customStyle
          : { ...customStyle, borderRadius: undefined }
      }
    />
  );
};

CustomSkeleton.defaultProps = {
  variant: 'rect',
  height: '',
  width: '',
  color: '',
  style: {},
  radius: 4,
  onContainer: false
};

export default CustomSkeleton;
