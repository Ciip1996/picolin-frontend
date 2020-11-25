// @flow
import React, { useState, useEffect, useCallback } from 'react';
// import queryString from 'query-string';
import Box from '@material-ui/core/Box';
import { FormContext, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { showAlert } from 'actions/app';
import Drawer from '@material-ui/core/Drawer';

/** Atoms, Components and Styles */

/** Components */
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import SummaryCard from 'UI/components/organisms/SummaryCard';
import SaleCard from 'UI/components/organisms/SaleCard';
import ActionButton from 'UI/components/atoms/ActionButton';
import AddComboToSaleDrawer from 'UI/components/organisms/AddComboToSaleDrawer';
import { drawerAnchor, PageTitles } from 'UI/constants/defaults';
import { currencyFormatter, sleep } from 'UI/utils';

/** API / EntityRoutes / Endpoints / EntityType */
import API from 'services/API';
import { v4 as uuidv4 } from 'uuid';
import { Endpoints } from 'UI/constants/endpoints';
// import type { MapType } from 'types';
import { AddIcon, colors } from 'UI/res';

import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';

import Contents from './strings';

type NewSaleListProps = {
  onShowAlert: any => void
};

const language = localStorage.getItem('language');

const NewSaleList = (props: NewSaleListProps) => {
  const { onShowAlert } = props;

  const [productsList, setProductsList] = useState<Array<Object>>([]);

  const [loading, setLoading] = useState(true);

  const [uiState, setUiState] = useState({
    isAddComboToSaleDrawerOpen: false
  });

  const defaultOptionSelectedFn = (option, value) => option.id === value.id;

  const searchingProductsUrl = `${Endpoints.Inventory}${Endpoints.GetInventory}`.replace(
    ':idStore',
    '1'
  );

  const toggleDrawer = (drawer: string, open: boolean) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setUiState(prevState => ({ ...prevState, [drawer]: open }));
  };

  const form = useForm();
  const { register, errors, handleSubmit, setValue, unregister, watch, getValues } = form;

  const watchFields = watch([
    'discount',
    'subtotal',
    'iva',
    'total',
    'change',
    'totalWithDiscount'
  ]); // you can also target specific fields by their names

  const onNewSaleFinished = () => {
    // debugger;
  };

  useEffect(() => {
    document.title = PageTitles.NewSale;
    sleep(1000).then(() => {
      setLoading(false);
    });
  }, []);

  const onSubmit = async (formData: Object) => {
    try {
      const {
        idPaymentMethod,
        invoice,
        total,
        subtotal,
        iva,
        discount,
        deposit,
        saleType,
        received,
        idStore = 1,
        totalWithDiscount,
        change,
        products: isProductsAvailable,
        ...rest
      } = formData;

      const saleDetail = Object.entries(rest).map(([key, value]) => {
        return { productCode: key, quantity: value };
      });

      const params = {
        idPaymentMethod,
        invoice: invoice || false,
        total,
        subtotal,
        iva,
        discount: discount || 0,
        deposit: null,
        saleType: '{PAQUETE COMPLETO}', // todo change with combos
        idStore,
        saleDetail,
        received: received || null
      };

      const response = await API.post(`${Endpoints.Sales}${Endpoints.NewSale}`, params);
      if (response) {
        onShowAlert({
          severity: 'success',
          title: 'Venta Exitosa',
          autoHideDuration: 3000,
          body: `Su venta de ${currencyFormatter(total)} fue realizada con exito!`
        });
        onNewSaleFinished();
      }
    } catch (err) {
      onShowAlert({
        severity: 'error',
        title: 'Error en venta',
        autoHideDuration: 3000,
        body: 'Ocurrio un problema'
      });
      throw err;
    }
  };

  const handleAddProduct = (name: string, value: any) => {
    setProductsList(prevList => {
      return [...prevList, { product: { ...value }, quantity: 1 }];
      // #region
      /*  
      The following code validates if it has already been added and adds one to the quanitity

      let addedProductIndex = 0;

      const productAlreadyAdded = prevList.find((each, index) => {
        if (each.product.productCode === value.productCode) {
          addedProductIndex = index;
          return true;
        }
        return false;
      });

      if (productAlreadyAdded) {
        const newproduct = {
          ...productAlreadyAdded,
          quantity: productAlreadyAdded.quantity + 1
        };
        const updatedListOfProducts = prevList;
        updatedListOfProducts[addedProductIndex] = newproduct;
        return [...updatedListOfProducts];
      } */
      // #endregion
    });
    setValue(name, value ? true : undefined, true);
  };

  const onRemoveProduct = (productCode: string) => {
    setProductsList(prevState => {
      const filteredArray = prevState.filter(
        (each: Object) => each.product.productCode !== productCode
      );
      return [...filteredArray];
    });
    unregister(productCode);
  };

  // #region modify amount of item
  /*   const onModifyAmountOfItem = (productCode: Object, quantity: any, stock: number) => {
    // TODO: check why is not taking the stock validation
    const updatedProducts = productsList.map((each: Object) => {
      if (each?.product?.productCode === productCode) {
        const isStockUnavailable = quantity ? stock < quantity : stock < 0;
        if (isStockUnavailable) {
          setValue(productCode, quantity, true);
        } else {
          setValue(productCode, quantity || 0, true);
        }
        return { ...each, quantity: parseInt(quantity, 10) };
      }
      return each;
    });
    setProductsList(updatedProducts);
  }; */
  // #endregion

  const registerFormField = useCallback(() => {
    register(
      { name: 'idPaymentMethod' },
      {
        required: `Tipo de pago requerido`
      }
    );
    register({ name: 'received' });
    register({ name: 'subtotal' });
    register({ name: 'total' });
    register({ name: 'totalWithDiscount' });
    register({ name: 'change' });
    register({ name: 'iva' });
    register(
      { name: 'discount' },
      {
        min: { value: 0, message: Contents[language]?.discountMin },
        validate: value => {
          if (value) {
            const total = parseFloat(watch('total'));
            const constraint = parseFloat(value) <= total * 0.3;
            return constraint || `El descuento debe ser menor al 30% del total`;
          }
          return true;
        }
      }
    );
    register({ name: 'invoice' });
    register(
      { name: 'products' },
      {
        required: `Al menos un producto es necesario para realizar la venta.`
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register]);

  useEffect(() => {
    registerFormField();
  }, [register, registerFormField]);

  const calculateSaleCosts = useCallback(() => {
    const { received, discount, invoice } = getValues();

    let saleCostSumatory;
    if (productsList.length === 0) {
      saleCostSumatory = 0.0;
    } else if (productsList.length === 1) {
      saleCostSumatory = parseFloat(productsList[0]?.product?.salePrice);
    } else if (productsList.length > 1) {
      saleCostSumatory = productsList.reduce((accumulator: Object, currentValue: Object) => {
        return (
          parseFloat(accumulator?.product?.salePrice) + parseFloat(currentValue?.product?.salePrice)
        );
      });
    }

    const subtotal = parseFloat(saleCostSumatory);
    const iva = invoice ? parseFloat(subtotal || 0.0) * 0.16 : 0.0;
    const total = parseFloat(subtotal || 0.0) + parseFloat(iva || 0.0);
    const totalWithDiscount =
      parseFloat(subtotal || 0.0) + parseFloat(iva || 0.0) - parseFloat(discount || 0.0);

    const change =
      totalWithDiscount && received ? parseFloat(totalWithDiscount) - parseFloat(received) : 0.0;

    setValue('subtotal', `${subtotal}`, false);
    setValue('iva', `${iva}`, false);
    setValue('change', `${change}`, false);
    setValue('total', `${total}`, false);
    setValue('totalWithDiscount', `${totalWithDiscount}`, false);
  }, [getValues, productsList, setValue]);

  useEffect(() => {
    if (productsList.length === 0) setValue('products', undefined, false);
    calculateSaleCosts();
  }, [calculateSaleCosts, productsList, setValue]);

  const onComboAdded = (comboData: Object) => {
    // TODO: add logic
    console.log(comboData);
    toggleDrawer('isAddComboToSaleDrawerOpen', !uiState.isAddComboToSaleDrawerOpen); // close the drawer
    debugger;
  };

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={loading}
        title={Contents[language]?.pageTitle}
        selector={
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="center"
            flexWrap="wrap"
            minWidth={238}
          >
            <ActionButton
              text={Contents[language]?.addCombo}
              onClick={toggleDrawer(
                'isAddComboToSaleDrawerOpen',
                !uiState.isAddComboToSaleDrawerOpen
              )}
            >
              <AddIcon fill={colors.white} size={18} />
            </ActionButton>
          </Box>
        }
      >
        <FormContext {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              // container
              direction="row"
              display="flex"
              justify="space-between"
              alignItems="stretch"
              spacing={4}
            >
              <Box
                spacing={12}
                flexDirection="column"
                flex={1}
                margin="0px 24px 0px 0px"
                display="flex"
                minWidth={472}
              >
                <AutocompleteSelect
                  name="products"
                  // selectedValue={comboValues.producto}
                  // disabled={!isProductFieldEnabled}
                  placeholder="Escriba un Producto"
                  url={searchingProductsUrl}
                  displayKey="name"
                  typeahead
                  typeaheadLimit={15}
                  onSelect={handleAddProduct}
                  getOptionSelected={defaultOptionSelectedFn}
                  dataFetchKeyName="inventory"
                  error={!!errors?.products}
                  errorText={errors?.products && errors?.products.message}
                  renderOption={option => {
                    return (
                      <div>
                        <strong>{option.productCode}</strong>
                        <br />
                        <span>{option.type}</span> | <span>{option.gender}</span> |
                        <span>{option.characteristic}</span>| <span>{option.color}</span>
                      </div>
                    );
                  }}
                />
                <div>
                  {productsList.map((each: Object) => {
                    return (
                      <SaleCard
                        key={uuidv4()}
                        product={each?.product}
                        quantityOfProducts={each?.quantity}
                        onRemoveItem={onRemoveProduct}
                        // onAmountOfProductsChanged={onModifyAmountOfItem}
                      />
                    );
                  })}
                  <div className="push" />
                </div>
              </Box>
              <Box style={{ display: 'flex' }}>
                <SummaryCard onNewItemAdded={calculateSaleCosts} watchFields={watchFields} />
              </Box>
            </Box>
          </form>
        </FormContext>
      </ListPageLayout>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isAddComboToSaleDrawerOpen}
        onClose={toggleDrawer('isAddComboToSaleDrawerOpen', false)}
      >
        <div role="presentation">
          <AddComboToSaleDrawer
            onComboAdded={onComboAdded}
            onShowAlert={onShowAlert}
            handleClose={toggleDrawer('isAddComboToSaleDrawerOpen', false)}
          />
        </div>
      </Drawer>
    </ContentPageLayout>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(NewSaleList);
