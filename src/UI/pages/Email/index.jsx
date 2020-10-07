// @flow
import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import BulkEmailLayout from 'UI/components/templates/BulkEmailLayout';
import BulkEmailModal from 'UI/components/organisms/BulkEmailModal';

const Email = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ContentPageLayout>
      <BulkEmailLayout isBulk={false} onClick={handleOpen} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <BulkEmailModal variant="email" onClose={handleClose} />
      </Modal>
    </ContentPageLayout>
  );
};

export default Email;
