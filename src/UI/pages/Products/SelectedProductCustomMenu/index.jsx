// @flow
import React from 'react';
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import SelectedRowMenu from 'UI/components/organisms/DataTable/SelectedRowMenu';
import { showAlert, confirm as confirmAction } from 'actions/app';
import { getErrorData } from 'UI/utils';
import { connect } from 'react-redux';
import { type Dispatch } from 'types/redux';

type SelectedProductCustomMenuProps = {
  onShowAlert: any => void,
  showConfirm: any => void,
  setData: any => void,
  productStatus: number,
  setUiState: any => any,
  productCode: () => {},
  idProduct: number
};

const SelectedProductCustomMenu = (props: SelectedProductCustomMenuProps) => {
  const {
    setUiState,
    onShowAlert,
    showConfirm,
    productCode,
    idProduct,
    setData,
    productStatus
  } = props;

  const isActionDelete = productStatus === 1;

  const onConfirm = async ok => {
    try {
      if (!ok) {
        return;
      }

      const {
        status,
        data: { title, message }
      } = await API.post(
        `${Endpoints.Products}${
          isActionDelete ? Endpoints.DeleteProduct : Endpoints.RestoreProduct
        }`,
        {
          idProduct
        }
      );

      onShowAlert({
        severity: status === 200 ? 'success' : 'warning',
        title,
        body: message
      });
      setData([]); // remove all data to fetch again
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
          isAddProductDrawerOpen: true,
          isModifyProductDrawerOpen: true
        }))
      }
      onRowDeleted={() =>
        showConfirm({
          severity: isActionDelete ? 'error' : 'warning',
          title: `${isActionDelete ? 'Desactivar' : 'Restaurar'}`,
          message: `Seguro(a) que deseas ${
            isActionDelete ? 'Desactivar' : 'Restaurar'
          } este producto?`,

          onConfirm
        })
      }
      onQRCodeDownload={() =>
        setUiState(prevState => ({
          ...prevState,
          isQRCodeDrawerOpen: true,
          productCode,
          idProduct
        }))
      }
      isActionDelete={isActionDelete}
      onCloneProduct={() => {
        setUiState(prevState => ({
          ...prevState,
          isAddProductDrawerOpen: true
        }));
      }}
    />
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert)),
    showConfirm: confirmation => dispatch(confirmAction(confirmation))
  };
};

export default connect(null, mapDispatchToProps)(SelectedProductCustomMenu);
