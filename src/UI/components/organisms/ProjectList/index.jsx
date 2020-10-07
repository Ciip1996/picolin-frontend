// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

// import queryString from 'query-string';
import moment from 'moment';
import axios from 'axios';

import { FormControl } from '@material-ui/core';

/** Atoms, Components and Styles */
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import DataTable from 'UI/components/organisms/DataTable';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import SelectBox from 'UI/components/atoms/SelectBox';
import { showAlert } from 'actions/app';
import { connect } from 'react-redux';

import { entyTypesFilters } from 'UI/constants/entityTypes';
import { EntityRoutes } from 'routes/constants';
import { getErrorMessage } from 'UI/utils';
import { PageTitles } from 'UI/constants/defaults';

const filterOptions = entyTypesFilters('Search Project ');
type Filters = { [name: string]: any };

type ProjectListProps = {
  onShowAlert: any => void
};

const ProjectList = (props: ProjectListProps) => {
  const { onShowAlert } = props;
  const history = useHistory();

  useEffect(() => {
    document.title = PageTitles.Name;
  });

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

  // Wait to know actions to list
  //  const MenuItems = [
  //   {
  //     icon: <AddSearchProjectIcon fill={colors.completeBlack} />,
  //     title: 'Search Project Name',
  //     link: EntityRoutes.CandidateCreate
  //   },
  //   {
  //     icon: <CreateSearchProjectIcon fill={colors.completeBlack} />,
  //     title: 'Create new Search Project',
  //     link: EntityRoutes.CompanyCreate
  //   }
  // ];

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
        .get('https://5e9f35d111b078001679c558.mockapi.io/pac/projectlist')
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

  const handleTopFilterChange = (name, value) => {
    setUiState(prevState => ({
      ...prevState,
      userFilter: value.id,
      page: 0
    }));
  };

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

    const newColumnSortDirections = ['none', 'none', 'none', 'none', 'none', 'none', 'none'];

    switch (orderBy) {
      case 'project_name':
        newColumnSortDirections[0] = direction;
        break;
      case 'total':
        newColumnSortDirections[1] = direction;
        break;
      case 'added':
        newColumnSortDirections[2] = direction;
        break;
      case 'type':
        newColumnSortDirections[3] = direction;
        break;
      case 'specialty':
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
      name: 'project_name',
      label: 'Search Project Name',
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
      name: 'total',
      label: 'Total',
      options: {
        ...sharedOptions,
        sortDirection: columnSortDirection[1],
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="full_name"
                  placeholder="Functional Title"
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
      label: 'Added',
      options: {
        ...sharedOptions,
        sortDirection: columnSortDirection[2]
      }
    },
    {
      name: 'type',
      label: 'Type',
      options: {
        ...sharedOptions,
        sortDirection: columnSortDirection[2]
      }
    },
    {
      name: 'specialty',
      label: 'Industry: Specialty',
      options: {
        ...sharedOptions
      }
    },
    {
      name: 'added_date',
      label: 'Added Date',
      options: {
        filter: false,
        sort: true,
        customBodyRender: value => {
          return <span>{moment(value).format('MM/DD/YYYY')}</span>;
        }
      }
    },
    {
      name: 'added_by',
      label: 'Added By',
      options: {
        filter: false,
        sort: true
      }
    }
  ];

  return (
    <ListPageLayout
      loading={false}
      mode="contained"
      selector={
        <SelectBox
          options={filterOptions}
          placeholder="Search projects to show"
          onSelect={handleTopFilterChange}
          displayKey="title"
          showFirstOption
        />
      }
    >
      <DataTable
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
        selectableRows="none"
      />
    </ListPageLayout>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(ProjectList);
