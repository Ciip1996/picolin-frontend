// @flow
import { UIState } from 'UI/types';

export type UIStateInventory = UIState & {
  isAddProductDrawerOpen: boolean,
  isQRCodeDrawerOpen: boolean,
  isDeleteModal: boolean,
  isModifyInventoryDrawer: boolean,
  selectedProduct: Object,
  isFeedInventoryDrawerOpen: boolean
};

export interface FilterInventory {
  store_filter: string;
  gender_filter: string;
  material_filter: string;
  type_filter: string;
  color_filter: string;
  stock_filter: {
    numberValue: string
  };
  minSalePrice_filter: {
    numberValue: string
  };
  maxSalePrice_filter: {
    numberValue: string
  };
  minCost_filter: {
    numberValue: string
  };
  maxCost_filter: {
    numberValue: string
  };
  status_filter: string;
}
