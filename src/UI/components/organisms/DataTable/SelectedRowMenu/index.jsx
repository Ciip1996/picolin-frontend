// @flow
import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import { Delete as DeleteIcon } from '@material-ui/icons';
import QrCodeIcon from '@mui/icons-material/QrCode';
import EditIcon from '@mui/icons-material/Edit';
/** Styles components */
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import { ToolbarWrapper } from './styles';
import Contents from './strings';

const language = localStorage.getItem('language');

type SelectedRowMenuProps = {
  onRowDeleted: any => any,
  onQRCodeDownload: any => any,
  onRowEdit: () => void,
  isActionDelete: boolean
};

const SelectedRowMenu = (props: SelectedRowMenuProps) => {
  const { onRowDeleted, onQRCodeDownload, onRowEdit, isActionDelete } = props;

  return (
    <ToolbarWrapper>
      <TableRow>
        <CustomIconButton
          tooltipText={Contents[language]?.qrcode}
          onClick={onQRCodeDownload}
        >
          <QrCodeIcon />
        </CustomIconButton>
        <CustomIconButton
          tooltipText={Contents[language]?.edit}
          onClick={onRowEdit}
        >
          <EditIcon />
        </CustomIconButton>
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
      </TableRow>
    </ToolbarWrapper>
  );
};

SelectedRowMenu.defaultProps = {
  onRowDeleted: undefined,
  onQRCodeDownload: undefined,
  isActionDelete: true
};

export default SelectedRowMenu;
