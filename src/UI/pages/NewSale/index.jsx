// @flow
import React, { useState, useEffect } from 'react';
// import queryString from 'query-string';
import Grid from '@material-ui/core/Grid';

import { connect } from 'react-redux';

import { showAlert } from 'actions/app';

/** Atoms, Components and Styles */

/** Components */
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import SummaryCard from 'UI/components/organisms/SummaryCard';
import ItemCard from 'UI/components/organisms/ItemCard';

/** API / EntityRoutes / Endpoints / EntityType */
// import API from 'services/API';
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

  // const [error, setError] = useState(false);

  // const [searching, setSearching] = useState(false);
  // const [loading, setLoading] = useState(false); // TODO: change to true when the fetching is working
  const [comboValues, setComboValues] = useState<MapType>({});

  // const [uiState, setUiState] = useState({
  //   keyword: null,
  //   isTransferDrawerOpen: true
  // });

  // const handleSearchChange = newKeyword => {
  //   setSearching(true);
  //   setUiState(prevState => ({
  //     ...prevState,
  //     keyword: newKeyword,
  //     page: 0
  //   }));
  // };

  // useEffect(() => {
  //   if (error) {
  //     setSearching(false);
  //     setLoading(false);
  //   }
  // }, [error]);

  useEffect(() => {
    document.title = PageTitles.NewSale;
  }, []);

  // const commonStyles = {
  //   display: 'flex',
  //   width: '50%',
  //   height: '100%',
  //   style: { border: '1px solid gray' }
  // };

  const handleComboChange = (name: string, value: any) => {
    setComboValues((prevState: MapType): MapType => ({ ...prevState, [name]: value }));
    // setValue(name, value?.id ? value?.id : value?.title, true);
  };

  const searchingProductsUrl = `${Endpoints.Inventory}${Endpoints.GetInventory}`.replace(
    ':idStore',
    'All'
  );

  const defaultOptionSelectedFn = (option, value) => option.id === value.id;

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={false} // loading
        // title={Contents[language]?.pageTitle}
        title="NUEVA VENTA"
      >
        <Grid container direction="row" justify="space-between" alignItems="stretch" spacing={4}>
          <Grid style={{ width: '60%', padding: '0px 48px 0px 48px', flex: 1 }}>
            <AutocompleteSelect
              name="producto"
              selectedValue={comboValues.producto}
              placeholder="Producto"
              url={searchingProductsUrl}
              displayKey="name"
              typeahead
              typeaheadLimit={25}
              onSelect={handleComboChange}
              getOptionSelected={defaultOptionSelectedFn}
              dataFetchKeyName="inventory"
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
            <ItemCard />
          </Grid>
          <Grid>
            <SummaryCard />
          </Grid>
        </Grid>
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
