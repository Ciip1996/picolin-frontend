// @flow
import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import { Delete as DeleteIcon } from '@material-ui/icons';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import QrCodeIcon from '@mui/icons-material/QrCode';
import VerifiedIcon from '@mui/icons-material/Verified';

import { InventoryIcon } from 'UI/res/icons';

import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

/** Styles components */
import { useLanguage } from 'UI/utils';
import { ToolbarWrapper } from './styles';
import Contents from './strings';

type SelectedRowMenuProps = {
  onRowDeleted?: () => any,
  onQRCodeDownload?: () => any,
  onFeedInventory?: () => any,
  onRowEdit?: () => void,
  onCloneProduct?: () => void,
  onRowEnableDisable: () => any,
  onRowVerify: () => any,
  isQRCodeEnabled: boolean,
  isFeedInventoryEnabled: boolean,
  isCloneProductEnabled: boolean,
  isEditEnabled: boolean,
  isDeleteActionEnabled: boolean,
  isEnableDisableActionEnabled: boolean,
  isVerifyActionEnabled?: boolean,
  isDisable?: boolean,
  isVerified?: boolean
};

const SelectedRowMenu = (props: SelectedRowMenuProps) => {
  const {
    onRowDeleted,
    onQRCodeDownload,
    onFeedInventory,
    onRowEdit,
    onCloneProduct,
    onRowEnableDisable,
    onRowVerify,
    isDisable,
    isVerified,
    isQRCodeEnabled,
    isCloneProductEnabled,
    isEditEnabled,
    isDeleteActionEnabled,
    isFeedInventoryEnabled,
    isEnableDisableActionEnabled,
    isVerifyActionEnabled
  } = props;
  const language = useLanguage();
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
        {isDeleteActionEnabled && (
          <CustomIconButton
            tooltipText={Contents[language]?.delete}
            onClick={onRowDeleted}
          >
            <DeleteIcon color="error" />
          </CustomIconButton>
        )}
        {isEnableDisableActionEnabled && (
          <CustomIconButton
            tooltipText={
              isDisable
                ? Contents[language]?.disable
                : Contents[language]?.enable
            }
            onClick={onRowEnableDisable}
          >
            {isDisable ? (
              <VisibilityOffIcon color="error" />
            ) : (
              <VisibilityIcon color="success" />
            )}
          </CustomIconButton>
        )}

        {isVerifyActionEnabled && (
          <CustomIconButton
            tooltipText={
              isVerified
                ? Contents[language]?.unverify
                : Contents[language]?.verify
            }
            onClick={onRowVerify}
          >
            <VerifiedIcon sx={isVerified ? undefined : { color: '#007fff' }} />
          </CustomIconButton>
        )}
      </TableRow>
    </ToolbarWrapper>
  );
};

SelectedRowMenu.defaultProps = {
  onRowDeleted: () => {},
  onQRCodeDownload: () => {},
  onFeedInventory: () => {},
  onRowEdit: () => {},
  onCloneProduct: () => {},
  onRowEnableDisable: () => {},
  onRowVerify: () => {},
  isQRCodeEnabled: false,
  isFeedInventoryEnabled: false,
  isCloneProductEnabled: false,
  isEditEnabled: false,
  isDeleteActionEnabled: false,
  isDisable: false,
  isEnableDisableActionEnabled: false,
  isVerifyActionEnabled: false,
  isVerified: false
};

export default SelectedRowMenu;
