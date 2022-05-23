// @flow
import { UIState, type Maybe } from 'UI/types';

export type UIStateProduct = UIState & {
  isAddProductDrawerOpen: boolean,
  isQRCodeDrawerOpen: boolean,
  selectedProduct: Maybe<Object>,
  isDeleteModal: boolean,
  isModifyProductDrawerOpen: boolean,
  isFeedInventoryDrawerOpen: boolean,
  preloadedProduct?: Object | null,
  rowsSelected: any[] | typeof undefined
};

export interface FilterProduct {
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
