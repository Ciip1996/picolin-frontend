// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import { fuseStyles, nestTernary } from 'UI/utils';
import { styles, useStyles } from './styles';

// I erase the variant text and floating boolean because I don't see any implementation, check if functionality works across the system
type ActionButtonProps = {
  status: 'success' | 'error' | 'default',
  variant: 'contained' | 'outlined',
  type?: 'button' | 'submit',
  text: string,
  isResponsive: boolean,
  iconPosition?: 'left' | 'right' | 'none',
  children?: any,
  backgroundColor?: string,
  style?: Object,
  onClick: any => any,
  isWithLargeContent?: boolean,
  isWithoutText: boolean
};

const ActionButton = (props: ActionButtonProps) => {
  const {
    status,
    text,
    children,
    iconPosition,
    variant,
    backgroundColor,
    style,
    onClick,
    isResponsive,
    isWithLargeContent,
    isWithoutText,
    ...rest
  } = props;

  const customStyle = fuseStyles([
    children && styles.withIcon,
    children && isResponsive && styles.buttonResponsive,
    isWithLargeContent && styles.largeContent,
    { ...style, backgroundColor },
    status === 'error' && styles.error,
    variant === 'outlined' && status === 'success' && styles.outlineSuccess
  ]);

  const classes = useStyles(props);
  const getIconForPosition = (position: string) => {
    return iconPosition === position && !!children
      ? children
      : nestTernary(
          iconPosition !== 'none',
          <div style={iconPosition === 'left' && isWithoutText ? styles.noDiv : styles.emptyDiv} />,
          undefined
        );
  };

  return (
    <Button
      variant={variant}
      classes={classes}
      onClick={onClick}
      style={customStyle}
      isResponsive={isResponsive}
      status={status}
      endIcon={getIconForPosition('right')}
      startIcon={getIconForPosition('left')}
      {...rest}
    >
      {!isWithoutText && <>{text}</>}
    </Button>
  );
};

ActionButton.defaultProps = {
  variant: 'contained',
  status: 'default',
  type: 'button',
  iconPosition: 'left',
  children: undefined,
  backgroundColor: undefined,
  style: {},
  onClick: () => {},
  isResponsive: false,
  isWithLargeContent: false,
  text: '',
  isWithoutText: false
};

export default ActionButton;
