// @flow
import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import { Delete as DeleteIcon } from '@material-ui/icons';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { InventoryIcon } from 'UI/res/icons';

import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
/** Styles components */
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import { ToolbarWrapper } from './styles';
import Contents from './strings';

const language = localStorage.getItem('language');

type SelectedRowMenuProps = {
  onRowDeleted: any => any,
  onQRCodeDownload?: any => any,
  onFeedInventory?: any => any,
  onRowEdit: () => void,
  isActionDelete: boolean,
  isQRCodeEnabled: boolean,
  isFeedInventoryEnabled: boolean,
  isCloneProductEnabled: boolean,
  isEditEnabled: boolean,
  isActionDeleteEnabled: boolean,
  onCloneProduct?: () => void
};

const SelectedRowMenu = (props: SelectedRowMenuProps) => {
  const {
    onRowDeleted,
    onQRCodeDownload,
    onFeedInventory,
    onRowEdit,
    onCloneProduct,
    isActionDelete,
    isQRCodeEnabled,
    isCloneProductEnabled,
    isEditEnabled,
    isActionDeleteEnabled,
    isFeedInventoryEnabled
  } = props;

  return (
    <ToolbarWrapper>
      <TableRow>
        {isQRCodeEnabled && (
          <CustomIconButton
            tooltipText={Contents[language]?.qrcode}
            onClick={onQRCodeDownload}
          >
            <QrCodeIcon />
          </CustomIconButton>
        )}
        {isFeedInventoryEnabled && (
          <CustomIconButton
            tooltipText={Contents[language]?.feedInventory}
            onClick={onFeedInventory}
          >
            <InventoryIcon fill="rgba(0, 0, 0, 0.54)" />
          </CustomIconButton>
        )}

        {isCloneProductEnabled && (
          <CustomIconButton
            tooltipText={Contents[language]?.clone}
            onClick={onCloneProduct}
          >
            <ContentCopyIcon />
          </CustomIconButton>
        )}
        {isEditEnabled && (
          <CustomIconButton
            tooltipText={Contents[language]?.edit}
            onClick={onRowEdit}
          >
            <EditIcon />
          </CustomIconButton>
        )}
        {isActionDeleteEnabled && (
          <CustomIconButton
            tooltipText={
              isActionDelete
                ? Contents[language]?.delete
                : Contents[language]?.restore
            }
            onClick={onRowDeleted}
          >
            {isActionDelete ? (
              <DeleteIcon color="error" />
            ) : (
              <RestoreFromTrashIcon color="success" />
            )}
          </CustomIconButton>
        )}
      </TableRow>
    </ToolbarWrapper>
  );
};

SelectedRowMenu.defaultProps = {
  onRowDeleted: undefined,
  onQRCodeDownload: undefined,
  isActionDelete: true,
  isQRCodeEnabled: false,
  isFeedInventoryEnabled: false,
  isCloneProductEnabled: false,
  isEditEnabled: false,
  isActionDeleteEnabled: false,
  onFeedInventory: () => {},
  onCloneProduct: () => {}
};

export default SelectedRowMenu;
