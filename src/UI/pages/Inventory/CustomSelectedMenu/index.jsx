// @flow
import React from 'react';
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import SelectedRowMenu from 'UI/components/organisms/DataTable/SelectedRowMenu';
import { showAlert, confirm as confirmAction } from 'actions/app';
import { getErrorData } from 'UI/utils';
import { connect } from 'react-redux';

type CustomSelectedMenuProps = {
  onShowAlert: any => void,
  showConfirm: any => void,
  setData: any => void,
  selectedRowIndex: number,
  idInventory: number,
  setUiState: any => void,
  productCode: number,
  productId: number
};

const CustomSelectedMenu = (props: CustomSelectedMenuProps) => {
  const {
    idInventory,
    setUiState,
    onShowAlert,
    showConfirm,
    productCode,
    productId,
    setData,
    selectedRowIndex
  } = props;

  const deleteInventory = async id => {
    const {
      status,
      data: { title, message }
    } = await API.post(`${Endpoints.Inventory}${Endpoints.DeleteInventory}`, {
      idInventory: id
    });
    onShowAlert({
      severity: status === 200 ? 'success' : 'warning',
      title,
      body: message
    });
  };

  const onConfirm = ok => {
    try {
      // consume the logic deletion api by idInventory
      ok && deleteInventory(idInventory);
      ok &&
        setData(prevState =>
          prevState.filter((e, i) => i !== selectedRowIndex)
        );
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
          severity: 'error',
          title: 'Eliminar registros de inventario',
          message: `Seguro(a) que deseas eliminar esto del inventario?`,
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
    />
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert)),
    showConfirm: confirmation => dispatch(confirmAction(confirmation))
  };
};

export default connect(null, mapDispatchToProps)(CustomSelectedMenu);
