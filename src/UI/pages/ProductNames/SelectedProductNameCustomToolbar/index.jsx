// @flow
import React from 'react';
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import SelectedRowMenu from 'UI/components/organisms/DataTable/SelectedRowMenu';
import { showAlert, confirm as confirmAction } from 'actions/app';
import { getErrorData } from 'UI/utils';
import { connect } from 'react-redux';

export type ProductName = {
  idName: number,
  name: string,
  idProvider: number,
  provide: string,
  status: boolean
};

export type SelectedProductNameProps = {
  onShowAlert: any => void,
  showConfirm: any => void,
  setRefresh: any => void,
  setUiState: any => void,
  productName: ProductName
};

const SelectedProductNameCustomToolbar = (props: SelectedProductNameProps) => {
  const {
    setUiState,
    onShowAlert,
    showConfirm,
    setRefresh,
    productName
  } = props;

  const isActionDelete = productName?.status === 1;

  const onConfirm = async ok => {
    try {
      if (!ok) {
        return;
      }
      const {
        status,
        data: { title, message }
      } = await API.post(
        `${Endpoints.ProductNames}${
          isActionDelete ? Endpoints.DeleteName : Endpoints.RestoreName
        }`,
        {
          idName: productName.idName
        }
      );

      onShowAlert({
        severity: status === 200 ? 'success' : 'warning',
        title,
        body: message
      });
      setRefresh(true); // empty data so it will refresh
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
      isQRCodeEnabled={false}
      onRowEdit={() =>
        setUiState(prevState => ({
          ...prevState,
          isModifyInventoryDrawer: true,
          selectedProductName: productName
        }))
      }
      onRowDeleted={() =>
        showConfirm({
          severity: isActionDelete ? 'error' : 'warning',
          title: `${isActionDelete ? 'Eliminar' : 'Restaurar'}`,
          message: `Seguro(a) que deseas ${
            isActionDelete ? 'Eliminar' : 'Restaurar'
          } el nombre ${productName?.name}?`,
          onConfirm
        })
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

export default connect(
  null,
  mapDispatchToProps
)(SelectedProductNameCustomToolbar);
