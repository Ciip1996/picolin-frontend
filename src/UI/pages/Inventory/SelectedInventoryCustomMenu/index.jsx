// @flow
import React from 'react';
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import SelectedRowMenu from 'UI/components/organisms/DataTable/SelectedRowMenu';
import { showAlert, confirm as confirmAction } from 'actions/app';
import { getErrorData } from 'UI/utils';
import { connect } from 'react-redux';
import { InventoryStatus } from 'UI/constants/status';

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

  const isActionDisable = inventoryStatus === InventoryStatus.enabled.id;

  const onConfirmEnableDisableAction = async ok => {
    try {
      if (!ok) {
        return;
      }
      const {
        status,
        data: { title, message }
      } = await API.post(
        `${Endpoints.Inventory}${
          isActionDisable
            ? Endpoints.DisableInventory
            : Endpoints.EnableInventory
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
        autoHideDuration: 8000,
        body: message
      });
      throw err;
    }
  };

  const onConfirmDeleteAction = async ok => {
    try {
      if (!ok) {
        return;
      }
      const {
        status,
        data: { title, message }
      } = await API.post(`${Endpoints.Inventory}${Endpoints.DeleteInventory}`, {
        idInventory
      });
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
        autoHideDuration: 8000,
        body: message
      });
      throw err;
    }
  };

  return (
    <SelectedRowMenu
      isDisableActionEnabled
      isActionDeleteEnabled
      isQRCodeEnabled
      onRowEdit={() =>
        setUiState(prevState => ({
          ...prevState,
          isModifyInventoryDrawer: true,
          idInventory
        }))
      }
      onRowDeleted={() =>
        showConfirm({
          severity: 'error',
          title: `Eliminar`,
          message: `Seguro(a) que deseas Eliminar este registro del inventario? Esta accion es permanente y no puede deshacerse.`,
          onConfirm: onConfirmDeleteAction
        })
      }
      onRowEnableDisable={() =>
        showConfirm({
          severity: isActionDisable ? 'error' : 'warning',
          title: `${
            isActionDisable ? 'Desactivar / Ocultar' : 'Activar / Mostrar'
          }`,
          message: `Seguro(a) que deseas ${
            isActionDisable ? 'Desactivar / Ocultar' : 'Activar / Mostrar'
          } este registro del inventario? ${
            isActionDisable
              ? 'Si lo haces ningun empleado podra ver este registro de inventario y sera como si no existiera.'
              : 'Si lo haces los empleado podrán ver este registro de inventario nuevamente.'
          }`,
          onConfirm: onConfirmEnableDisableAction
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
      isActionDisable={isActionDisable}
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
