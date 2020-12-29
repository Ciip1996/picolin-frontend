// @flow
import React, { useState, useEffect, useCallback } from 'react';
// import queryString from 'query-string';
import Box from '@material-ui/core/Box';
import { FormContext, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { showAlert } from 'actions/app';
import Drawer from '@material-ui/core/Drawer';
import { useHistory } from 'react-router-dom';

/** Atoms, Components and Styles */
import ListProductRow from 'UI/components/molecules/ListProductRow';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import SummaryCard from 'UI/components/organisms/SummaryCard';
import SaleCard from 'UI/components/organisms/SaleCard';
import ComboCard from 'UI/components/organisms/ComboCard';
import ActionButton from 'UI/components/atoms/ActionButton';
import AddComboToSaleDrawer from 'UI/components/organisms/AddComboToSaleDrawer';
import { drawerAnchor, PageTitles } from 'UI/constants/defaults';
import { currencyFormatter, sleep, getFeatureFlags } from 'UI/utils';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import { sendToPrintTicket } from 'UI/utils/ticketGenerator';

/** API / EntityRoutes / Endpoints / EntityType */
import API from 'services/API';
import { v4 as uuidv4 } from 'uuid';
import { Endpoints } from 'UI/constants/endpoints';
// import type { MapType } from 'types';
import { AddIcon, colors, EmptyActivityLogs } from 'UI/res';

import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';

import { FeatureFlags } from 'UI/constants/featureFlags';
import Contents from './strings';

const featureFlags = getFeatureFlags();

type NewSaleListProps = {
  onShowAlert: any => void
};

const language = localStorage.getItem('language');

const NewSaleList = (props: NewSaleListProps) => {
  const { onShowAlert } = props;
  const history = useHistory();

  const [productsList, setProductsList] = useState<Array<Object>>([]);

  const [comboPackagesList, setComboPackagesList] = useState<Array<Object>>([]);

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
  const {
    register,
    errors,
    handleSubmit,
    setValue,
    unregister,
    watch,
    getValues,
    clearError
  } = form;

  const watchFields = watch([
    'discount',
    'subtotal',
    'iva',
    'total',
    'change',
    'totalWithDiscount'
  ]); // you can also target specific fields by their names

  const onNewSaleFinished = async idSale => {
    try {
      const response = await API.get(
        `${Endpoints.Sales}${Endpoints.GetSaleDetailsByIdSale}`.replace(':id', idSale)
      );
      if (response?.data && response?.data?.detail?.length > 0) {
        history.push('/newsale');
        sendToPrintTicket(response?.data);
      } else
        onShowAlert({
          severity: 'error',
          title: 'Error al generar Ticket',
          autoHideDuration: 8000,
          body: 'Ocurrio un problema, contacte a soporte técnico.'
        });
    } catch (err) {
      onShowAlert({
        severity: 'error',
        title: 'Error al generar Ticket',
        autoHideDuration: 8000,
        body: 'Ocurrio un problema, contacte a soporte técnico.'
      });
      throw err;
    }
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
        // debugger;
        return { productCode: key, quantity: value, combo: 0 };
      });

      /// TODO: add all the products from the combo and set the value combo: 1

      const params = {
        idPaymentMethod,
        invoice: invoice || false,
        total: totalWithDiscount,
        subtotal,
        iva,
        discount: discount || 0,
        deposit: null,
        saleType: null, // todo maybe remove it in the future
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
        sleep(1000).then(() => {
          response?.data?.idSale && onNewSaleFinished(response?.data?.idSale);
        });
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
    });
    setValue(name, value ? true : undefined, true);
  };

  const onRemoveProduct = (productCode: string) => {
    setProductsList(prevState => {
      const filteredProductList = prevState.filter(
        (each: Object) => each.product.productCode !== productCode
      );
      return [...filteredProductList];
    });
    unregister(productCode);
  };

  const onRemoveCombo = (comboId: string) => {
    setComboPackagesList(prevState => {
      const filteredComboList = prevState.filter((each: Object) => each.id !== comboId);
      return [...filteredComboList];
    });
    // TODO: register or unregister the react hook form: unregister(productCode);
  };

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
            return constraint || `El descuento debe ser menor al 30% de la venta.`;
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
    clearError();
    const { received, discount, invoice, idPaymentMethod } = getValues();

    let saleCostSumatory;
    let combosCostSumatory;

    if (comboPackagesList.length === 0) {
      combosCostSumatory = 0.0;
    } else if (comboPackagesList.length > 0) {
      combosCostSumatory = parseInt(comboPackagesList.length, 10) * 800.0;
    }

    if (productsList.length === 0) {
      saleCostSumatory = 0.0;
    } else if (productsList.length === 1) {
      saleCostSumatory = parseFloat(productsList[0]?.product?.salePrice);
    } else if (productsList.length > 1) {
      saleCostSumatory = productsList.reduce((accumulator: number, currentValue: Object) => {
        // console.log(`${accumulator} + ${currentValue?.product?.salePrice}`);
        return parseFloat(accumulator) + parseFloat(currentValue?.product?.salePrice);
      }, 0.0);
    }

    const subtotal = parseFloat(saleCostSumatory) + parseFloat(combosCostSumatory);

    const iva =
      invoice && featureFlags.includes(FeatureFlags.Taxes)
        ? parseFloat(subtotal || 0.0) * 0.16
        : 0.0;
    const total = parseFloat(subtotal || 0.0) + parseFloat(iva || 0.0);
    const totalWithDiscount =
      parseFloat(subtotal || 0.0) + parseFloat(iva || 0.0) - parseFloat(discount || 0.0);

    const change =
      totalWithDiscount && received && idPaymentMethod !== 1
        ? parseFloat(totalWithDiscount) - parseFloat(received)
        : 0.0;

    setValue('subtotal', `${subtotal}`, false);
    setValue('iva', featureFlags.includes(FeatureFlags.Taxes) ? `${iva}` : 0, false);
    setValue('change', `${change}`, false);
    setValue('total', `${total}`, false);
    setValue('totalWithDiscount', `${totalWithDiscount}`, false);
  }, [clearError, comboPackagesList.length, getValues, productsList, setValue]);

  useEffect(() => {
    if (productsList.length === 0) setValue('products', undefined, false);
    calculateSaleCosts();
  }, [calculateSaleCosts, productsList, setValue]);

  useEffect(() => {
    calculateSaleCosts();
  }, [calculateSaleCosts, comboPackagesList]);

  const onComboAdded = (comboData: Object) => {
    setUiState(prevState => ({ ...prevState, isAddComboToSaleDrawerOpen: false }));
    setComboPackagesList(prevList => [...prevList, { ...comboData, id: uuidv4() }]);
    setValue('products', true, true);
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
                  autoFocus
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
                    return <ListProductRow product={option} />;
                  }}
                />
                <Box
                  flex={1}
                  display={
                    comboPackagesList.length === 0 && productsList.length === 0 ? 'flex' : 'unset'
                  }
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  {/* Render Combos */}
                  {comboPackagesList.length === 0 && productsList.length === 0 && (
                    <EmptyPlaceholder
                      title="Ningun producto en esta venta"
                      subtitle="Para añadir un producto o un paquete escanee el código QR de la etiqueta o escriba el código de producto en la caja de texto ubicada en la parte superior."
                    >
                      <EmptyActivityLogs />
                    </EmptyPlaceholder>
                  )}
                  {comboPackagesList.map((combo: Object) => {
                    const { id } = combo;
                    return (
                      <ComboCard
                        key={id}
                        products={combo}
                        // quantityOfProducts={combo?.quantity}
                        onRemoveItem={onRemoveCombo}
                        // onAmountOfProductsChanged={onModifyAmountOfItem}
                      />
                    );
                  })}
                  {/* Render Products */}
                  {productsList.map((product: Object) => {
                    return (
                      <SaleCard
                        key={uuidv4()}
                        product={product?.product}
                        quantityOfProducts={product?.quantity}
                        onRemoveItem={onRemoveProduct}
                        // onAmountOfProductsChanged={onModifyAmountOfItem}
                      />
                    );
                  })}
                  <div className="push" />
                </Box>
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
