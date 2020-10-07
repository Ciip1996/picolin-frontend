// @flow
import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import BulkEmailLayout from 'UI/components/templates/BulkEmailLayout';
import BulkEmailModal from 'UI/components/organisms/BulkEmailModal';
import AddEmailModal from 'UI/components/organisms/AddEmailModal';

const BulkEmail = () => {
  const [open, setOpen] = useState(false);
  const [openAddEmail, setOpenAddEmail] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenAddEmail = () => {
    setOpenAddEmail(true);
  };

  const handleCloseAddEmail = () => {
    setOpenAddEmail(false);
  };
  return (
    <ContentPageLayout>
      <BulkEmailLayout isBulk onClick={handleOpen} handleAddEmailModal={handleOpenAddEmail} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <BulkEmailModal variant="bulk" onClose={handleClose} />
      </Modal>
      <Modal
        open={openAddEmail}
        onClose={handleCloseAddEmail}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <AddEmailModal onClose={handleCloseAddEmail} />
      </Modal>
    </ContentPageLayout>
  );
};

export default BulkEmail;
