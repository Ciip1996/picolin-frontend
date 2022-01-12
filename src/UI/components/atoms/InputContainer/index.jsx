// @flow
import React from 'react';
import Box from '@material-ui/core/Box';
import { newItemPadding } from 'UI/constants/dimensions';

type InputContainerProps = {
  children: any,
  flex?: 'center' | 'start'
};

const InputContainer = (props: InputContainerProps) => {
  const { children, flex, ...rest } = props;
  return (
    <Box
      mr={newItemPadding}
      my={0.8131}
      width="100%"
      height={61}
      display="flex"
      alignItems={flex === 'start' ? 'flex-start' : 'center'}
      {...rest}
      marginRight={0}
    >
      {children}
    </Box>
  );
};

InputContainer.defaultProps = {
  flex: 'start'
};

export default InputContainer;
