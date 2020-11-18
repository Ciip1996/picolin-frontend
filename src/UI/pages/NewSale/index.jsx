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
import ItemCard from 'UI/components/organisms/ItemCard';

/** API / EntityRoutes / Endpoints / EntityType */
import { v4 as uuidv4 } from 'uuid';
import { Endpoints } from 'UI/constants/endpoints';
import type { MapType } from 'types';

import { PageTitles } from 'UI/constants/defaults';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
// import Contents from './strings';

// type NewSaleListProps = {
//   onShowAlert: any => void
// };

const NewSaleList = () => {
  // const { onShowAlert } = props;
  // const language = localStorage.getItem('language');

  const [error, setError] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const [productList, setProductsList] = useState([]);
  const [formValues, setFormValues] = useState<MapType>({});

  const [uiState, setUiState] = useState({
    keyword: null
  });

  const form = useForm({
    defaultValues: {}
  });

  const { register, errors, getValues, setValue, handleSubmit } = form;

  useEffect(() => {
    if (error) {
      // setSearching(false);
      // setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    document.title = PageTitles.NewSale;
  }, []);

  const handleComboChange = (name: string, value: any) => {
    debugger;
    setProductsList(prevState => [...prevState, value]);
    setValue(value?.productCode, value && value, true);
  };
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
    <FormContext {...form}>
      <ContentPageLayout>
        <ListPageLayout
          loading={false} // loading
          // title={Contents[language]?.pageTitle}
          title="NUEVA VENTA"
        >
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
                  name="products"
                  // selectedValue={productList.producto}
                  placeholder="Escriba para buscar un producto "
                  url={searchingProductsUrl}
                  displayKey="name"
                  typeahead
                  typeaheadLimit={25}
                  onSelect={handleComboChange}
                  getOptionSelected={defaultOptionSelectedFn}
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
                      <ItemCard onRemoveItem={onRemoveItem} key={uuidv4()} product={product} />
                    ))}
                  <div className="push" />
                </div>
              </Box>
              <Box style={{ display: 'flex' }}>
                <SummaryCard />
              </Box>
            </Box>
          </form>
        </ListPageLayout>
      </ContentPageLayout>
    </FormContext>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(NewSaleList);
