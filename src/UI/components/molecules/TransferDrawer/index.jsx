// @flow
import React, { useState } from 'react';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Box from '@material-ui/core/Box';
import Text from 'UI/components/atoms/Text';

import { globalStyles } from 'GlobalStyles';

const TransferProductsDrawer = props => {
  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isReadOnly: false,
    isFormDisabled: false,
    isLoading: true
  });

  return (
    <>
      {/* <FormContext {...form}> */}
      <DrawerFormLayout
        // onSubmit={null}
        // onClose={handleClose}
        // onSecondaryButtonClick={handleClose}
        variant="borderless"
        uiState={uiState}
        title="Transferencias "
        initialText="Re-Validate"
      >
        <div>contendio aqui</div>
        <Box>
          <div style={globalStyles.feeDrawerslabel}>
            <Text variant="subtitle1" text="Modify The Declined Fields" fontSize={16} />
          </div>
        </Box>
        <div />
      </DrawerFormLayout>
      {/* </FormContext> */}
    </>
  );
};

TransferProductsDrawer.defaultProps = {
  onResponse: () => {}
};

export default TransferProductsDrawer;
