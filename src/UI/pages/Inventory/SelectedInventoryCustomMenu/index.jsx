// @flow
import React from 'react';
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import SelectedRowMenu from 'UI/components/organisms/DataTable/SelectedRowMenu';
import { showAlert, confirm as confirmAction } from 'actions/app';
import { getErrorData } from 'UI/utils';
import { connect } from 'react-redux';

type SelectedInventoryCustomMenuProps = {
  onShowAlert: any => void,
  showConfirm: any => void,
  setData: any => void,
  idInventory: number,
  setUiState: any => void,
  productCode: number,
  productId: number,
  inventoryStatus: number
};

const SelectedInventoryCustomMenu = (
  props: SelectedInventoryCustomMenuProps
) => {
  const {
    idInventory,
    setUiState,
    onShowAlert,
    showConfirm,
    productCode,
    productId,
    setData,
    inventoryStatus
  } = props;

  const isActionDelete = inventoryStatus === 1;

  const onConfirm = async ok => {
    try {
      if (!ok) {
        return;
      }
      const {
        status,
        data: { title, message }
      } = await API.post(
        `${Endpoints.Inventory}${
          isActionDelete
            ? Endpoints.DeleteInventory
            : Endpoints.RestoreInventory
        }`,
        {
          idInventory
        }
      );

      onShowAlert({
        severity: status === 200 ? 'success' : 'warning',
        title,
        body: message
      });
      setData([]); // empty data so it will refresh
    } catch (err) {
      const { title, message, severity } = getErrorData(err);
      onShowAlert({
        severity,
        title,
        autoHideDuration: 800000,
        body: message
      });
      throw err;
    }
  };

  return (
    <SelectedRowMenu
      onRowEdit={() =>
        setUiState(prevState => ({
          ...prevState,
          isModifyInventoryDrawer: true,
          idInventory
        }))
      }
      onRowDeleted={() =>
        showConfirm({
          severity: isActionDelete ? 'error' : 'warning',
          title: `${isActionDelete ? 'Desactivar' : 'Restaurar'}`,
          message: `Seguro(a) que deseas ${
            isActionDelete ? 'Desactivar' : 'Restaurar'
          } este registro del inventario?`,
          onConfirm
        })
      }
      onQRCodeDownload={() =>
        setUiState(prevState => ({
          ...prevState,
          isQRCodeDrawerOpen: true,
          idInventory,
          productCode,
          productId
        }))
      }
      isActionDelete={isActionDelete}
    />
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert)),
    showConfirm: confirmation => dispatch(confirmAction(confirmation))
  };
};

export default connect(null, mapDispatchToProps)(SelectedInventoryCustomMenu);
