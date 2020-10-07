// @flow
import React from 'react';
import Box from '@material-ui/core/Box';
import { newItemPadding, CancelSaveButton } from 'UI/constants/dimensions';

type InputContainerProps = {
  children: any,
  flex?: 'center' | 'start'
};

const InputContainer = (props: InputContainerProps) => {
  const { children, flex } = props;
  return (
    <Box
      mr={newItemPadding}
      my={0.8131}
      width={CancelSaveButton}
      height={61}
      display="flex"
      alignItems={flex === 'start' ? 'flex-start' : 'center'}
    >
      {children}
    </Box>
  );
};

InputContainer.defaultProps = {
  flex: 'start'
};

export default InputContainer;
