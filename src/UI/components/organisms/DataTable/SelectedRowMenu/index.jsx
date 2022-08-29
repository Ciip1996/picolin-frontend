// @flow
import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import { Delete as DeleteIcon } from '@material-ui/icons';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import QrCodeIcon from '@mui/icons-material/QrCode';
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
  isQRCodeEnabled: boolean,
  isFeedInventoryEnabled: boolean,
  isCloneProductEnabled: boolean,
  isEditEnabled: boolean,
  isDeleteActionEnabled: boolean,
  isEnableDisableActionEnabled: boolean,
  isDisable?: boolean
};

const SelectedRowMenu = (props: SelectedRowMenuProps) => {
  const {
    onRowDeleted,
    onQRCodeDownload,
    onFeedInventory,
    onRowEdit,
    onCloneProduct,
    onRowEnableDisable,
    isDisable,
    isQRCodeEnabled,
    isCloneProductEnabled,
    isEditEnabled,
    isDeleteActionEnabled,
    isFeedInventoryEnabled,
    isEnableDisableActionEnabled
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
  isQRCodeEnabled: false,
  isFeedInventoryEnabled: false,
  isCloneProductEnabled: false,
  isEditEnabled: false,
  isDeleteActionEnabled: false,
  isDisable: false,
  isEnableDisableActionEnabled: false
};

export default SelectedRowMenu;
