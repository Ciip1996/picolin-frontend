// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import { fuseStyles, nestTernary } from 'UI/utils';
import { styles, useStyles } from './styles';

type ActionButtonProps = {
  status: 'success' | 'error' | 'default',
  variant: 'contained' | 'outlined' | 'important',
  type: 'button' | 'submit',
  text: string,
  isResponsive: boolean,
  iconPosition?: 'left' | 'right' | 'none',
  children: any,
  style: Object,
  onClick: any => any,
  isWithLargeContent: boolean,
  isWithoutText: boolean,
  ...
};

const ActionButton = (props: ActionButtonProps) => {
  const {
    status,
    text,
    children,
    iconPosition,
    variant,
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
    status === 'error' && styles.error,
    variant === 'outlined' && status === 'success' && styles.outlineSuccess,
    { ...style }
  ]);

  const classes = useStyles(props);

  const getIconForPosition = (position: string) => {
    return iconPosition === position && !!children
      ? children
      : nestTernary(
          iconPosition !== 'none',
          <div
            style={
              iconPosition === 'left' && isWithoutText
                ? styles.noDiv
                : styles.emptyDiv
            }
          />,
          undefined
        );
  };

  return (
    <Button
      variant={variant}
      classes={classes}
      onClick={onClick}
      style={customStyle}
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
  isResponsive: false,
  isWithLargeContent: false,
  isWithoutText: false,
  text: '',
  children: undefined,
  style: {},
  onClick: () => {}
};

export default ActionButton;
