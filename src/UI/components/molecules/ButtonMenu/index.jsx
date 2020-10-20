// @flow
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import ActionButton from 'UI/components/atoms/ActionButton';
import { Box } from '@material-ui/core';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import { styles } from './styles';

type ButtonMenuProps = {
  text: string,
  color?: string,
  width?: string,
  fontSize?: number,
  children?: any,
  MenuItems: Array<any>,
  style?: Object,
  isIconButton: boolean,
  onClick: () => any,
  tooltipText?: string
};

const ButtonMenu = (props: ButtonMenuProps) => {
  const {
    text,
    children,
    color,
    width,
    fontSize,
    style,
    onClick,
    MenuItems,
    isIconButton,
    tooltipText,
    ...rest
  } = props;
  const history = useHistory();
  const [emptyMenu, setEmptyMenu] = useState(true);
  const customStyle = {
    ...style,
    ...styles.buttonLayout,
    fontSize,
    width
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = link => {
    setAnchorEl(null);
    history.push(link);
  };

  useEffect(() => {
    setEmptyMenu(
      MenuItems.every(item => {
        return item.visible === false || item.visible === null || item.visible === undefined;
      })
    );
  }, [MenuItems]);

  return (
    !emptyMenu && (
      <>
        {isIconButton ? (
          <CustomIconButton
            onClick={handleClick}
            tooltipText={tooltipText}
            tooltipPosition="bottom"
            aria-controls="simple-menu"
            aria-haspopup="true"
            text={text}
            {...rest}
          >
            {children}
          </CustomIconButton>
        ) : (
          <ActionButton
            disabled={emptyMenu}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
            style={customStyle}
            backgroundColor="black"
            text={text}
            {...rest}
          >
            {children}
          </ActionButton>
        )}
        {!emptyMenu && (
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {MenuItems.map((item, index) => {
              return (
                item.visible && (
                  <MenuItem
                    aria-label={item.title}
                    key={index.toString()}
                    style={styles.menuCreateItemText}
                    onClick={
                      item.link
                        ? () => {
                            handleClose(item.link);
                          }
                        : item.action
                    }
                  >
                    <Box mr={1}>{item.icon}</Box>
                    {item.title}
                  </MenuItem>
                )
              );
            })}
          </Menu>
        )}
      </>
    )
  );
};

ButtonMenu.defaultProps = {
  text: '',
  color: colors.white,
  width: '200px',
  children: undefined,
  MenuItems: [],
  style: {},
  fontSize: 16,
  onClick: () => {},
  isIconButton: false,
  tooltipText: 'Menu'
};

export default ButtonMenu;
