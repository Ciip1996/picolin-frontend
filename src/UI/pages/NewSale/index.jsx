// @flow
import React, { useState, useEffect } from 'react';
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
import { v4 as uuidv4 } from 'uuid';
import { Endpoints } from 'UI/constants/endpoints';
import type { MapType } from 'types';

import { PageTitles } from 'UI/constants/defaults';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import Contents from './strings';

// type NewSaleListProps = {
//   onShowAlert: any => void
// };

const NewSaleList = () => {
  // const { onShowAlert } = props;
  const language = localStorage.getItem('language');

  // const [error, setError] = useState(false);
  // const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const [productList, setProductsList] = useState([]);

  const productExample = {
    characteristic: 'Mini',
    color: 'Azul Cielo',
    cost: 122,
    description: 'con tiras de neopreno',
    gender: 'unisex',
    idInventory: 30,
    pieces: 1,
    productCode: 'PFAAZRO14019',
    provider: 'Ropones de san juan',
    reservedQuantity: null,
    salePrice: 333,
    size: 14,
    stock: -27,
    store: 'Bodega',
    type: 'Faldón'
  };

  const initialValues = {
    total: '10000',
    subtotal: '1000',
    iva: '1000',
    discount: '1000',
    received: '1000',
    idPaymentMethod: {},
    deposit: '1000',
    invoice: true,
    idStore: {},
    saleDetail: [{ productCode: productExample.productCode, quantity: 1 }]
  };
  const [formValues, setFormValues] = useState<MapType>(initialValues);

  // const [uiState, setUiState] = useState({
  //   keyword: null
  // });

  const methods = useForm({
    defaultValues: initialValues
  });

  const { handleSubmit, errors, setValue, getValues } = methods;

  useEffect(() => {
    document.title = PageTitles.NewSale;
  }, []);

  // useEffect(() => {

  //   register({ name: 'idPaymentMethod' }, { required: 'idPaymentMethod required' });
  //   const values2 = getValues();
  //   console.log('useForm values:', values2);
  // }, [register]);

  const handleComboChange = (name: string, value: any) => {
    setProductsList(prevState => [...prevState, value]);
    setFormValues((prevState: MapType): MapType => ({
      ...prevState,
      saleDetail: [...prevState.saleDetail, { productCode: value.productCode, quantity: 1 }] // TODO: change quantity
    }));
    setValue(name, productList, true);
  };

  useEffect(() => {
    console.log('productList:', productList);
    console.log('formValues:', formValues);
    const values = getValues();
    console.log('useForm values:', values);
    debugger;
  }, [formValues, getValues, productList]);

  const searchingProductsUrl = `${Endpoints.Inventory}${Endpoints.GetInventory}`.replace(
    ':idStore',
    'All'
  );

  const onSubmit = (formData: Object) => {
    console.log(formData);
    debugger;
  };

  const defaultOptionSelectedFn = (option, value) => option.id === value.id;

  const onRemoveItem = (productCode: string) => {
    console.log(productCode, productList);
    setProductsList(prevState => {
      debugger;
      // remove item with productCode
      const filteredArray = prevState.filter((each: Object) => each.productCode !== productCode);
      return [...filteredArray];
    });
    // unregister(productCode);
  };

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={loading} // loading
        title={Contents[language]?.pageTitle}
      >
        <FormContext {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="search-form">
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
                  name="saleDetail"
                  // selectedValue={productList.producto}
                  placeholder="Escriba para buscar un producto "
                  url={searchingProductsUrl}
                  displayKey="name"
                  typeahead
                  typeaheadLimit={25}
                  onSelect={handleComboChange}
                  getOptionSelected={defaultOptionSelectedFn}
                  inputRef={methods.register}
                  dataFetchKeyName="inventory"
                  error={!!errors?.products}
                  errorText={errors?.products && errors?.products.message}
                  renderOption={option => {
                    return (
                      <div>
                        <strong>{option.productCode}</strong>
                        <br />
                        <span>{option.type}</span> | <span>{option.gender}</span> |{' '}
                        <span>{option.characteristic}</span>| <span>{option.color}</span>
                      </div>
                    );
                  }}
                />
                <div>
                  {productList &&
                    productList.map(product => (
                      <TransferCard
                        onRemoveItem={onRemoveItem}
                        onAmountOfProductsChanged={() => {}}
                        quantityOfProducts={1}
                        key={uuidv4()}
                        product={product}
                      />
                    ))}
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
