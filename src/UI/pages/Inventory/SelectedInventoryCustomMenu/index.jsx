// @flow
import React from 'react';
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import SelectedRowMenu from 'UI/components/organisms/DataTable/SelectedRowMenu';
import { showAlert, confirm as confirmAction } from 'actions/app';
import { getErrorData } from 'UI/utils';
import { connect } from 'react-redux';
import { InventoryStatus, VerifyStatus } from 'UI/constants/status';
import { userHasAdminOrManagerPermissions } from 'services/Authorization';

type SelectedInventoryCustomMenuProps = {
  onShowAlert: any => void,
  showConfirm: any => void,
  idInventory: number,
  setUiState: any => void,
  productCode: number,
  productId: number,
  inventoryStatus: number,
  verifyStatus: number,
  setRefresh: any => void
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
    inventoryStatus,
    verifyStatus,
    setRefresh
  } = props;

  const isActionDisable = inventoryStatus === InventoryStatus.enabled.id;
  const isActionVerify = verifyStatus === VerifyStatus.unverified.id;

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
      setRefresh(true);
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

  const onConfirmVerifyAction = async ok => {
    try {
      if (!ok) {
        return;
      }
      const {
        status,
        data: { title, message }
      } = await API.post(
        `${Endpoints.Inventory}${
          isActionVerify
            ? Endpoints.VerifyInventory
            : Endpoints.UnverifyInventory
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
      setRefresh(true);
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
      setRefresh(true); // refersh data again
    } catch (err) {
      const { title, message, severity } = getErrorData(err);
      onShowAlert({
        severity,
        title,
        autoHideDuration: 8000,
        body: message || JSON.stringify(err)
      });
      throw err;
    }
  };

  const isUserAdmin: boolean = userHasAdminOrManagerPermissions();

  return (
    <SelectedRowMenu
      isEditEnabled={isUserAdmin}
      isVerifyActionEnabled={isUserAdmin}
      isEnableDisableActionEnabled={isUserAdmin}
      isDeleteActionEnabled={isUserAdmin}
      isActionDisable={isActionDisable}
      isQRCodeEnabled
      isVerified={!!verifyStatus}
      isDisable={!!inventoryStatus}
      onRowEdit={() =>
        setUiState(prevState => ({
          ...prevState,
          isModifyInventoryDrawer: true
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
          severity: 'warning',
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
      onRowVerify={() =>
        showConfirm({
          severity: 'warning',
          title: `${isActionVerify ? 'Verificar' : 'Quitar Verificación'}`,
          message: `Seguro(a) que deseas ${
            isActionVerify ? 'Verificar' : 'Quitar Verificación'
          } este registro del inventario? ${
            isActionVerify
              ? 'Con esta acción verificas que lo que dice este registro de inventario es veridico.'
              : 'Con esta acción quitas la verificación y confirmas que lo que dice este registro de inventario es erróneo.'
          }`,
          onConfirm: onConfirmVerifyAction
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
