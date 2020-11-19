// @flow
import React, { useState, useEffect, useCallback } from 'react';
// import queryString from 'query-string';
import Box from '@material-ui/core/Box';
import { FormContext, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { showAlert } from 'actions/app';

/** Atoms, Components and Styles */

/** Components */
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import SummaryCard from 'UI/components/organisms/SummaryCard';
import TransferCard from 'UI/components/organisms/TransferCard';

/** API / EntityRoutes / Endpoints / EntityType */
import API from 'services/API';
import { v4 as uuidv4 } from 'uuid';
import { Endpoints } from 'UI/constants/endpoints';
import type { MapType } from 'types';

import { PageTitles } from 'UI/constants/defaults';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import Contents from './strings';

type NewSaleListProps = {
  onShowAlert: any => void
};

const NewSaleList = (props: NewSaleListProps) => {
  const { onShowAlert } = props;
  const language = localStorage.getItem('language');
  const [loading, setLoading] = useState(false);

  const [comboValues, setComboValues] = useState<MapType>({});
  const [productsList, setProductsList] = useState([]);

  const form = useForm();
  const { register, errors, handleSubmit, setValue, unregister, getValues } = form;

  const onNewSaleFinished = () => {
    debugger;
  };
  const vals = getValues();
  console.log('vals', vals);

  useEffect(() => {
    document.title = PageTitles.NewSale;
    debugger;
  }, []);

  const onSubmit = async (formData: Object) => {
    try {
      debugger;

      const {
        idPaymentMethod,
        invoice,
        total,
        subtotal,
        iva,
        discount,
        deposit,
        saleType,
        idStore = 1,
        products: isProductsAvailable,
        ...rest
      } = formData;

      const products = Object.entries(rest).map(([key, value]) => {
        return { productCode: key, quantity: value };
      });

      const params = {
        idPaymentMethod,
        invoice,
        total,
        subtotal,
        iva,
        discount,
        deposit,
        saleType,
        idStore,
        products
      };
      const response = await API.post(`${Endpoints.Sales}${Endpoints.NewSale}`, params);
      if (response) {
        onShowAlert({
          severity: 'success',
          title: 'Venta Exitosa',
          autoHideDuration: 3000,
          body: `Se han transferido los productos de ${comboValues.idOrigin.title} a ${comboValues.idDestination.title}`
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

  // const handleComboChange = (name?: string, value: any) => {
  //   if (productsList.length > 0) {
  //     // reset the form if there is a change in the selects
  //     setProductsList([]);
  //     setComboValues({});
  //     reset();
  //     registerFormField();
  //   }
  //   setComboValues((prevState: MapType): MapType => ({ ...prevState, [name]: value }));
  //   setValue(name, value ? value.id : value, true);
  // };

  const handleAddProduct = (name: string, value: any) => {
    debugger;

    setProductsList(prevState => {
      // validate that the item has not been added already (removes duplicates)
      if (prevState.length === 0) {
        return [...prevState, { product: { ...value }, quantity: 1 }];
      }
      const doesNotExistInArray = prevState.some(
        each => each.product.productCode === value.productCode
      );
      if (doesNotExistInArray) return prevState;
      return [...prevState, { product: { ...value }, quantity: 1 }];
    });

    setValue(name, value ? true : undefined, true);
  };

  const defaultOptionSelectedFn = (option, value) => option.id === value.id;

  const searchingProductsUrl = `${Endpoints.Inventory}${Endpoints.GetInventory}`.replace(
    ':idStore',
    '1'
  );

  const onRemoveProduct = (productCode: string) => {
    debugger;

    setProductsList(prevState => {
      // remove item with productCode
      const filteredArray = prevState.filter(
        (each: Object) => each.product.productCode !== productCode
      );
      return [...filteredArray];
    });
    unregister(productCode);
  };

  const onModifyAmountOfItem = (productCode: Object, quantity: any, stock: number) => {
    debugger;

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
  };

  const registerFormField = useCallback(() => {
    register(
      { name: 'idPaymentMethod' },
      {
        required: `Tipo de pago requerido`
      }
    );
    register({ name: 'discount' });
    register({ name: 'invoice' });
    register(
      { name: 'products' },
      {
        required: `Al menos un producto es necesario para realizar la venta.`
      }
    );
  }, [register]);

  useEffect(() => {
    registerFormField();
  }, [register, registerFormField]);

  useEffect(() => {
    if (productsList.length === 0) setValue('products', undefined, false);
  }, [productsList, setValue]);

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={loading} // loading
        title={Contents[language]?.pageTitle}
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
                  {productsList.map(each => {
                    return (
                      <TransferCard
                        key={uuidv4()}
                        product={each?.product}
                        quantityOfProducts={each?.quantity}
                        onRemoveItem={onRemoveProduct}
                        onAmountOfProductsChanged={onModifyAmountOfItem}
                      />
                    );
                  })}
                  <div className="push" />
                </div>
              </Box>
              <Box style={{ display: 'flex' }}>
                <SummaryCard />
              </Box>
            </Box>
          </form>
        </FormContext>
      </ListPageLayout>
    </ContentPageLayout>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(NewSaleList);
