// @flow
import React, { useState } from 'react';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import ActionButton from 'UI/components/atoms/ActionButton';

/** Material Assets and Components */
import Drawer from '@material-ui/core/Drawer';
import FeeAgreementReValidateDrawer from 'UI/components/organisms/FeeAgreementReValidateDrawer';
import FeeAgreementValidationDrawer from 'UI/components/organisms/FeeAgreementValidationDrawer';
import FeeAgreementDeclineDrawer from 'UI/components/organisms/FeeAgreementDeclineDrawer';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import FeeAgreementPreviewModal from 'UI/components/molecules/FeeAgreementPreviewModal';
import { drawerAnchor } from 'UI/constants/defaults';

const FeeAgreementDrawers = () => {
  const [mode, setMode] = useState(['fee']);
  const [uiState, setUiState] = useState({
    isReValidationOpen: false,
    isValidationOpen: false,
    isDeclineOpen: false
  });

  const [openModal, setOpenModal] = React.useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const toggleDrawer = (drawer: string, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setUiState(prevState => ({ ...prevState, [drawer]: open }));
  };

  const handleFAValClick = () => {
    setUiState(prevState => ({ ...prevState, isValidationOpen: true }));
    // only for test purposes
    // To do set proper event to SetMode
    setMode(['fee', 'verbiage']);
  };

  const handleFAValClose = () => {
    setUiState(prevState => ({ ...prevState, isValidationOpen: false }));
  };

  const handleFAReValClick = () => {
    setUiState(prevState => ({ ...prevState, isReValidationOpen: true }));
  };

  const handleFAReValClose = () => {
    setUiState(prevState => ({ ...prevState, isReValidationOpen: false }));
  };

  const handleFADeclineClick = () => {
    setUiState(prevState => ({ ...prevState, isDeclineOpen: true }));
  };

  const handleFADeclineClose = () => {
    setUiState(prevState => ({ ...prevState, isDeclineOpen: false }));
  };
  return (
    <ContentPageLayout>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Box display="flex">
          <ActionButton text="Validate" onClick={handleFAValClick} />
          <Box mx={2}>
            <ActionButton text="Decline" onClick={handleFADeclineClick} />
          </Box>
          <ActionButton text="Re-Validate" onClick={handleFAReValClick} />
        </Box>
        <Box mx={2} mt={2}>
          <ActionButton
            isWithLargeContent
            text="Modal Preview Fee Agreement"
            onClick={handleOpen}
          />
        </Box>
      </Box>

      <Drawer
        anchor={drawerAnchor}
        open={uiState.isValidationOpen}
        onClose={toggleDrawer('isValidationOpen', false)}
      >
        <div role="presentation">
          <FeeAgreementValidationDrawer mode={mode} onFeeAgreementValidation={handleFAValClose} />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isDeclineOpen}
        onClose={toggleDrawer('isDeclineOpen', false)}
      >
        <div role="presentation">
          <FeeAgreementDeclineDrawer
            feeAgreement={{}}
            feeAgreementId="110"
            handleClose={handleFADeclineClose}
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isReValidationOpen}
        onClose={toggleDrawer('isReValidationOpen', false)}
      >
        <div role="presentation">
          <FeeAgreementReValidateDrawer
            feeAgreement={{}}
            handleClose={() => {}}
            mode={mode}
            handleFeeAgreementRevalidation={handleFAReValClose}
          />
        </div>
      </Drawer>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <FeeAgreementPreviewModal url="" handleAlert={() => {}} closeModal={handleClose} />
      </Modal>
    </ContentPageLayout>
  );
};

export default FeeAgreementDrawers;
