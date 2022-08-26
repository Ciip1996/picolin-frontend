// @flow
import React from 'react';
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import SelectedRowMenu from 'UI/components/organisms/DataTable/SelectedRowMenu';
import { showAlert, confirm as confirmAction } from 'actions/app';
import { getErrorData } from 'UI/utils';
import { connect } from 'react-redux';

export type ProductType = {
  idType: number,
  name: string,
  idProvider: number,
  provide: string,
  status: boolean
};

export type SelectedProductTypeProps = {
  onShowAlert: any => void,
  showConfirm: any => void,
  setRefresh: any => void,
  setUiState: any => void,
  productName: ProductType
};

const SelectedProductTypeCustomToolbar = (props: SelectedProductTypeProps) => {
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
        `${Endpoints.ProductTypes}${
          isActionDelete ? Endpoints.DeleteName : Endpoints.RestoreName
        }`,
        {
          idType: productName.idType
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
        autoHideDuration: 8000,
        body: message
      });
      throw err;
    }
  };

  return (
    <SelectedRowMenu
      isActionDeleteEnabled
      isEditEnabled
      onRowEdit={() =>
        setUiState(prevState => ({
          ...prevState,
          isModifyInventoryDrawer: true,
          selectedProductType: productName
        }))
      }
      onRowDeleted={() =>
        showConfirm({
          severity: isActionDelete ? 'error' : 'warning',
          title: `${isActionDelete ? 'Desactivar' : 'Restaurar'}`,
          message: `Seguro(a) que deseas ${
            isActionDelete ? 'Desactivar' : 'Restaurar'
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
)(SelectedProductTypeCustomToolbar);
