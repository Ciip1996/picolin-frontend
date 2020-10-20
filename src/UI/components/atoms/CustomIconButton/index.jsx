// @flow
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { colors, NotificationIcon } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import StyledTooltip from '../StyledTooltip/styles';
import { useStyles } from './styles';

type CustomIconButtonProps = {
  children: any,
  style: Object,
  disabled: boolean,
  tooltipText: string,
  tooltipPosition?: 'left' | 'top' | 'right' | 'bottom',
  onClick: any => any
};

const CustomIconButton = (props: CustomIconButtonProps) => {
  const classes = useStyles();

  const { children, style, disabled, tooltipText, tooltipPosition, onClick, ...rest } = props;

  return (
    <StyledTooltip style={style} title={tooltipText} placement={tooltipPosition}>
      <span>
        <IconButton
          onClick={onClick}
          style={style}
          aria-label="icon button"
          className={classes.margin}
          disabled={disabled}
          {...rest}
        >
          {children}
        </IconButton>
      </span>
    </StyledTooltip>
  );
};
CustomIconButton.defaultProps = {
  children: <NotificationIcon fill={colors.completeBlack} />,
  style: {},
  disabled: false,
  tooltipText: '',
  tooltipPosition: 'bottom',
  onClick: () => {}
};

export default CustomIconButton;
