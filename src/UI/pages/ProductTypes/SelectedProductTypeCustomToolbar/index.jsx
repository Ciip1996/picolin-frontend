// @flow
import React from 'react';
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import SelectedRowMenu from 'UI/components/organisms/DataTable/SelectedRowMenu';
import { showAlert, confirm as confirmAction } from 'actions/app';
import { getErrorData, useLanguage } from 'UI/utils';
import { connect } from 'react-redux';
import { userHasAdminOrManagerPermissions } from 'services/Authorization';
import { InventoryStatus } from 'UI/constants/status';
import Contents from './strings';

export type ProductType = {
  idType: number,
  type: string,
  status: boolean,
  registerDate: string,
  user: string
};

export type SelectedProductTypeProps = {
  onShowAlert: any => void,
  showConfirm: any => void,
  setRefresh: any => void,
  setUiState: any => void,
  productType: ProductType
};

const SelectedProductTypeCustomToolbar = (props: SelectedProductTypeProps) => {
  const {
    setUiState,
    onShowAlert,
    showConfirm,
    setRefresh,
    productType
  } = props;

  const language = useLanguage();

  const isDisable = productType?.status === InventoryStatus.enabled.id;

  const onConfirmEnableDisableAction = async ok => {
    try {
      if (!ok) {
        return;
      }
      const {
        status,
        data: { title, message }
      } = await API.post(
        `${Endpoints.ProductTypes}${
          isDisable ? Endpoints.DisableType : Endpoints.EnableType
        }`,
        {
          idType: productType?.idType
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
  const isUserAdmin: boolean = userHasAdminOrManagerPermissions();

  return (
    <SelectedRowMenu
      isEnableDisableActionEnabled={isUserAdmin}
      isEditEnabled={isUserAdmin}
      isDisable={isDisable}
      onRowEdit={() =>
        setUiState(prevState => ({
          ...prevState,
          isModifyInventoryDrawer: true,
          selectedProductType: productType
        }))
      }
      onRowEnableDisable={() =>
        showConfirm({
          severity: `${isDisable ? 'error' : 'warning'}`,
          title: isDisable
            ? Contents[language]?.disable
            : Contents[language]?.enable,
          message: `${Contents[language]?.confirmation} ${
            isDisable ? Contents[language]?.disable : Contents[language]?.enable
          } ${
            isDisable
              ? Contents[language]?.disableMessage
              : Contents[language]?.enableMessage
          }`,
          onConfirm: onConfirmEnableDisableAction
        })
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

export default connect(
  null,
  mapDispatchToProps
)(SelectedProductTypeCustomToolbar);
