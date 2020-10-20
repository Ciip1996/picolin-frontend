// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

// import queryString from 'query-string';
import moment from 'moment';
import axios from 'axios';

import { FormControl, Box } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';

/** Atoms, Components and Styles */
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import DataTable from 'UI/components/organisms/DataTable';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import type { Filters } from 'types/app';

import { showAlert } from 'actions/app';
import { connect } from 'react-redux';

// import { entyTypesFilters } from 'UI/constants/entityTypes';
import { EntityRoutes } from 'routes/constants';
import { getErrorMessage } from 'UI/utils';
import { SendBulkIcon, DeleteIcon, colors } from 'UI/res';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import BulkEmailModal from 'UI/components/organisms/BulkEmailModal';
import { PageTitles } from 'UI/constants/defaults';

type SearchProjectPreviewProps = {
  onShowAlert: any => void
};

const SearchProjectPreview = (props: SearchProjectPreviewProps) => {
  const { onShowAlert } = props;
  const history = useHistory();

  useEffect(() => {
    document.title = PageTitles.SearchProjectPreview;
  });

  const [loading, setLoading] = useState(true);

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

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        .get('https://5e9f35d111b078001679c558.mockapi.io/pac/projectpreview')
        .then(res => {
          setData(res.data);
        })
        .catch(error => {
          // handle error
          onShowAlert({
            severity: 'error',
            title: 'Search Projects',
            autoHideDuration: 3000,
            body: getErrorMessage(error)
          });
        })
        .finally(() => {
          setLoading(false);
        });
      setCount(Number(1));
    } catch (error) {
      onShowAlert({
        severity: 'error',
        title: 'Search Projects',
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

  const handleRowClick = newItem => {
    const { id } = data[newItem.rowIndex];
    history.push(EntityRoutes.NameProfile.replace(':id', id));
  };

  const sortColumn = newColumnSort => {
    const { orderBy, direction } = newColumnSort;

    const newColumnSortDirections = ['none', 'none', 'none', 'none', 'none', 'none'];

    switch (orderBy) {
      case 'full_name':
        newColumnSortDirections[0] = direction;
        break;
      case 'specialty':
        newColumnSortDirections[1] = direction;
        break;
      case 'email':
        newColumnSortDirections[2] = direction;
        break;
      case 'location':
        newColumnSortDirections[3] = direction;
        break;
      case 'last_activity':
        newColumnSortDirections[4] = direction;
        break;
      case 'added_date':
        newColumnSortDirections[5] = direction;
        break;
      default:
        break;
    }
    setcolumnSortDirection(newColumnSortDirections);
  };

  const handleResetFiltersClick = () => {
    setFilters({});
  };

  const sharedOptions = {
    filter: true,
    sort: true,
    filterType: 'custom'
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
      name: 'full_name',
      label: 'Full Name',
      options: {
        ...sharedOptions,
        sortDirection: columnSortDirection[0],
        customBodyRender: value => <strong>{value}</strong>,
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="full_name"
                  placeholder="Full Name"
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
      name: 'specialty',
      label: 'Industry: Specialty',
      options: {
        ...sharedOptions,
        sortDirection: columnSortDirection[1],
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="specialty"
                  placeholder="Industry: Specialty"
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
        sortDirection: columnSortDirection[2],
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
      name: 'location',
      label: 'Location',
      options: {
        ...sharedOptions,
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="location"
                  placeholder="Location"
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
      name: 'last_activity',
      label: 'Last Activity',
      options: {
        ...sharedOptions,
        customBodyRender: value => {
          return <span>{moment(value).format('MM/DD/YYYY')}</span>;
        },
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="last_activity"
                  placeholder="Last activity"
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
      name: 'added_date',
      label: 'Added Date',
      options: {
        ...sharedOptions,
        customBodyRender: value => {
          return <span>{moment(value).format('MM/DD/YYYY')}</span>;
        },
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="added_date"
                  placeholder="Added Date"
                  url=""
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    }
  ];

  return (
    <ContentPageLayout>
      <ListPageLayout needsBackNavigation loading={loading} title="SEARCH PROJECT VIEW">
        <DataTable
          customToolbarSelect={
            <Box display="flex">
              <Box mr={1}>
                <CustomIconButton
                  onClick={handleOpen}
                  tooltipPosition="bottom"
                  tooltipText="Send Bulk"
                >
                  <SendBulkIcon fill={colors.success} />
                </CustomIconButton>
              </Box>
              <CustomIconButton tooltipPosition="bottom" tooltipText="Delete">
                <DeleteIcon fill={colors.success} />
              </CustomIconButton>
            </Box>
          }
          loading={loading}
          data={data}
          columns={columns}
          count={count}
          page={uiState.page}
          rowsPerPage={uiState.perPage}
          searchText={uiState.keyword}
          onRowClick={handleRowClick}
          onResetfiltersClick={handleResetFiltersClick}
          onSearchTextChange={handleSearchChange}
          onColumnSortClick={handleColumnSortClick}
          onPerPageClick={handlePerPageClick}
          onPageClick={handlePageClick}
        />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <BulkEmailModal onClose={handleClose} />
        </Modal>
      </ListPageLayout>
    </ContentPageLayout>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(SearchProjectPreview);
