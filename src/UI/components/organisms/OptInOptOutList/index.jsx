// @flow
import React, { useState, useEffect, useCallback } from 'react';

// import queryString from 'query-string';
import axios from 'axios';

import { FormControl, Box } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { confirm as confirmAction, showAlert } from 'actions/app';

/** Atoms, Components and Styles */
import DataTable from 'UI/components/organisms/DataTable';
import ListPageLayout from 'UI/components/templates/ListPageLayout';

import { connect } from 'react-redux';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import { getErrorMessage } from 'UI/utils';
import ActionButton from 'UI/components/atoms/ActionButton';
import { OptInEmptyState } from 'UI/res';
import type { Filters } from 'types/app';
import { styles } from './style';

type OptInOptOutListProps = {
  onShowAlert: any => void,
  onClick: any => void,
  showConfirm: any => void
};

const OptInOptOutList = (props: OptInOptOutListProps) => {
  const { onShowAlert, onClick, showConfirm } = props;

  const [data, setData] = useState<any>([]);
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState<Filters>({});

  const [columnSortDirection, setcolumnSortDirection] = useState([
    'none',
    'none',
    'none',
    'none',
    'none',
    'none'
  ]);

  const [uiState, setUiState] = useState({
    userFilter: 0,
    keyword: '',
    orderBy: '',
    direction: '',
    page: 0,
    perPage: 10
  });

  const getData = useCallback(async () => {
    try {
      // const { state, city, zip, specialty, position } = filters;
      // const params = {
      //   userFilter: uiState.userFilter,
      //   keyword: uiState.keyword,
      //   orderBy: uiState.orderBy,
      //   direction: uiState.direction,
      //   stateId: state ? state.id : null,
      //   cityId: city ? city.id : null,
      //   zip: zip ? zip.title : null,
      //   specialtyId: specialty ? specialty.id : null,
      //   positionId: position ? position.id : null,
      //   page: uiState.page + 1,
      //   perPage: uiState.perPage
      // };
      // const queryParams = queryString.stringify(params);

      // const response = await API.get(`${Endpoints.Names}?${queryParams}`);

      // setData(response.data.data);
      // setCount(Number(response.data.total));
      // setLoading(false);

      axios
        .get('https://5e9f35d111b078001679c558.mockapi.io/pac/OptIN')
        .then(res => {
          setData(res.data);
        })
        .catch(error => {
          // handle error
          onShowAlert({
            severity: 'error',
            title: 'Names',
            autoHideDuration: 3000,
            body: getErrorMessage(error)
          });
        });
      setCount(Number(1));
    } catch (error) {
      onShowAlert({
        severity: 'error',
        title: 'Names',
        autoHideDuration: 3000,
        body: getErrorMessage(error)
      });
    }
  }, [onShowAlert]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleSearchChange = newKeyword => {
    setUiState(prevState => ({
      ...prevState,
      keyword: newKeyword,
      page: 0
    }));
  };

  const handleFilterChange = (name?: string, value: any) => {
    setFilters({ ...filters, [name]: value });
    setUiState(prevState => ({
      ...prevState,
      page: 0
    }));
  };

  const handleColumnSortClick = newColumnSort => {
    sortColumn(newColumnSort);
    setUiState(prevState => ({
      ...prevState,
      orderBy: newColumnSort.orderBy,
      direction: newColumnSort.direction,
      page: 0
    }));
  };

  const handlePerPageClick = newPerPage => {
    setUiState(prevState => ({
      ...prevState,
      page: 0,
      perPage: newPerPage
    }));
  };

  const handlePageClick = newPage => {
    setUiState(prevState => ({
      ...prevState,
      page: newPage
    }));
  };

  const sortColumn = newColumnSort => {
    const { orderBy, direction } = newColumnSort;

    const newColumnSortDirections = ['none', 'none', 'none'];

    switch (orderBy) {
      case 'status':
        newColumnSortDirections[0] = direction;
        break;
      case 'email':
        newColumnSortDirections[1] = direction;
        break;
      case 'expire':
        newColumnSortDirections[2] = direction;
        break;
      default:
        break;
    }
    setcolumnSortDirection(newColumnSortDirections);
  };

  const handleResetFiltersClick = () => {
    setFilters({});
  };

  const handleOptIn = async () => {
    showConfirm({
      severity: 'warning',
      title: 'Restore email',
      confirmButtonText: 'Opt In',
      cancelButtonText: 'cancel',
      withButtons: 'YesNo',
      message: `Are you sure you want this email back in the Opt In Database?`
      // onConfirm: async ok => {
      //   if (!ok) {
      //   }

      // try {
      //   const response = await API.delete(`${endpoint}/${itemId}`);
      //   if (response.status === 200) {
      //     const newItems = items.filter(item => item.id !== itemId);
      //     onItemsChange(type, newItems);
      //     showAlert({
      //       severity: 'success',
      //       title: 'Awesome',
      //       body: `The ${type} was deleted successfully`
      //     });
      //   }
      // } catch (error) {
      //   showAlert({
      //     severity: 'error',
      //     title: 'Error',
      //     body: getErrorMessage(error)
      //   });
      // }
      // }
    });
  };

  const sharedOptions = {
    filter: true,
    sort: true
  };

  const columns = [
    {
      name: 'id',
      options: {
        filter: false,
        sort: false,
        print: false,
        display: 'excluded'
      }
    },
    {
      name: 'optOut',
      label: 'Status',
      options: {
        ...sharedOptions,
        sortDirection: columnSortDirection[0],
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="optIn"
                  placeholder="Status"
                  url=""
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'email',
      label: 'Email',
      options: {
        ...sharedOptions,
        sortDirection: columnSortDirection[1],
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="email"
                  placeholder="Email"
                  url=""
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'added',
      label: 'Added by',
      options: {
        ...sharedOptions,
        sortDirection: columnSortDirection[0],
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="added"
                  placeholder="Added by"
                  url=""
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        filter: false,
        customBodyRender: (tableMeta, value) => (
          <FormControlLabel
            value={value}
            control={
              <ActionButton
                text="Opt IN"
                variant="outlined"
                style={styles.minActionButton}
                status="success"
                onClick={handleOptIn}
              />
            }
          />
        )
      }
    }
  ];

  return (
    <>
      <ListPageLayout loading={false} mode="onPage">
        <DataTable
          data={data}
          columns={columns}
          count={count}
          page={uiState.page}
          rowsPerPage={uiState.perPage}
          searchText={uiState.keyword}
          onResetfiltersClick={handleResetFiltersClick}
          onSearchTextChange={handleSearchChange}
          onColumnSortClick={handleColumnSortClick}
          onPerPageClick={handlePerPageClick}
          onPageClick={handlePageClick}
          selectableRows="none"
          defaultEmptyState={false}
          title="No opt-outs"
          subtitle="The opt-outed items will apper here"
          customEmptyStateIcon={<OptInEmptyState />}
        />
      </ListPageLayout>
      <Box style={styles.actionButtonList}>
        <ActionButton text="Add Email" onClick={onClick} />
      </Box>
    </>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert)),
    showConfirm: confirmation => dispatch(confirmAction(confirmation))
  };
};

export default connect(null, mapDispatchToProps)(OptInOptOutList);
