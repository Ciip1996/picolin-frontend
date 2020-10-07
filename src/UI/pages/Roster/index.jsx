// @flow
import React, { useState, useEffect, useCallback } from 'react';

import queryString from 'query-string';
import { connect } from 'react-redux';

import { FormControl } from '@material-ui/core';
import CustomSkeleton from 'UI/components/atoms/CustomSkeleton';

import { showAlert } from 'actions/app';

/** Atoms, Components and Styles */
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';

/** Components */
import DataTable from 'UI/components/organisms/DataTable';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';

/** API / EntityRoutes / Endpoints / EntityType */
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorMessage } from 'UI/utils';
import type { Filters } from 'types/app';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import { saveFilters, getFilters } from 'services/FiltersStorage';
import { PageTitles } from 'UI/constants/defaults';

const CellSkeleton = ({ children, searching }) => {
  return searching ? <CustomSkeleton width="90%" height={18} /> : <>{children}</>;
};

type RostersListProps = {
  onShowAlert: any => void
};

const chainedSelects = {
  state: ['city', 'zip']
};

const columnItems = [
  { id: 0, name: 'full_name', display: true },
  { id: 1, name: 'initials', display: true },
  { id: 2, name: 'role', display: true },
  { id: 3, name: 'phone', display: false },
  { id: 4, name: 'extension', display: true },
  { id: 5, name: 'email', display: false },
  { id: 6, name: 'location', display: true }
];

const getSortDirections = (orderBy: string, direction: string) =>
  columnItems.map(item => (item.name === orderBy ? direction : 'none'));

const RostersList = (props: RostersListProps) => {
  const { onShowAlert } = props;

  useEffect(() => {
    document.title = PageTitles.Roster;
  }, []);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const [data, setData] = useState<any>(null);
  const [count, setCount] = useState(0);
  const gpacAll = { id: 0, title: 'gpac All' };
  const [rosterTypes, setRosterTypes] = useState([gpacAll]);

  const savedSearch = getFilters('roster');
  const savedFilters = savedSearch?.filters;
  const savedParams = savedSearch?.params;
  const [filters, setFilters] = useState<Filters>(savedFilters || {});

  const [uiState, setUiState] = useState({
    keyword: savedParams?.keyword || '',
    orderBy: savedParams?.orderBy || '',
    direction: savedParams?.direction || '',
    page: savedParams?.page - 1 || 0,
    perPage: savedParams?.perPage || 10
  });

  const getData = useCallback(async () => {
    try {
      const { state, city, role, office } = filters;

      const params = {
        keyword: uiState.keyword,
        orderBy: uiState.orderBy,
        direction: uiState.direction,
        stateId: state ? state.id : null,
        cityId: city ? city.id : null,
        roleId: role ? role.id : null,
        office: office ? office.address : null,
        page: uiState.page + 1,
        perPage: uiState.perPage
      };

      saveFilters('roster', { filters, params });

      const queryParams = queryString.stringify(params);
      const response = await API.get(`${Endpoints.Users}/${Endpoints.Roster}?${queryParams}`);

      setData(response.data.data);
      setCount(Number(response.data.total));
      setLoading(false);
      setSearching(false);
    } catch (error) {
      onShowAlert({
        severity: 'error',
        title: 'Roster',
        autoHideDuration: 3000,
        body: getErrorMessage(error)
      });
    }
  }, [filters, uiState, onShowAlert]);

  const handleSearchChange = newKeyword => {
    setSearching(true);
    setUiState(prevState => ({
      ...prevState,
      keyword: newKeyword,
      page: 0
    }));
  };

  const handleFilterChange = (name?: string, value: any) => {
    setSearching(true);
    setFilters({ ...filters, [name]: value });
    setUiState(prevState => ({
      ...prevState,
      page: 0
    }));

    if (name && chainedSelects[name]) {
      chainedSelects[name].forEach(chainedSelect => {
        setFilters((prevState: Filters): Filters => ({ ...prevState, [chainedSelect]: null }));
      });
    }
  };

  const handleResetFiltersClick = () => {
    setSearching(true);
    setFilters({});
  };

  const handleFilterRemove = (filterName: string) => {
    setSearching(true);
    setFilters({ ...filters, [filterName]: null });
  };

  const handleColumnSortClick = newSortDirection => {
    const { orderBy, direction } = newSortDirection;
    setSearching(true);

    setUiState(prevState => ({
      ...prevState,
      orderBy,
      direction,
      page: 0
    }));
  };

  const handlePerPageClick = newPerPage => {
    setSearching(true);
    setUiState(prevState => ({
      ...prevState,
      page: 0,
      perPage: newPerPage
    }));
  };

  const handlePageClick = newPage => {
    setSearching(true);

    setUiState(prevState => ({
      ...prevState,
      page: newPage
    }));
  };

  const handleColumnDisplayClick = newColumnDisplay => {
    const { column, display } = newColumnDisplay;
    const index = columnItems.findIndex(item => item.name === column);
    columnItems[index].display = display;
  };

  const handleRowClick = () => {
    // const { id } = data[newItem.rowIndex];
    // history.push(EntityRoutes.RostserProfile.replace(':id', id));
  };

  const sortDirection = getSortDirections(uiState.orderBy, uiState.direction);

  const columns = [
    {
      name: 'id',
      options: {
        filter: true,
        sort: false,
        display: 'excluded',
        filterType: 'custom'
      }
    },
    {
      name: 'full_name',
      label: 'Full Name',
      options: {
        filter: true,
        sort: true,
        display: columnItems[0].display,
        sortDirection: sortDirection[0],
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>
              <strong>{value}</strong>
            </CellSkeleton>
          );
        },
        filterType: 'custom'
      }
    },
    {
      name: 'initials',
      label: 'Initials',
      options: {
        filter: true,
        sort: true,
        display: columnItems[1].display,
        sortDirection: sortDirection[1],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'role',
      label: 'Role',
      options: {
        filter: true,
        sort: true,
        display: columnItems[2].display,
        sortDirection: sortDirection[2],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'position',
      label: 'Position',
      options: {
        filter: true,
        sort: true,
        display: columnItems[2].display,
        sortDirection: sortDirection[2],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'phone',
      label: 'Phone',
      options: {
        filter: true,
        sort: true,
        display: columnItems[3].display,
        sortDirection: sortDirection[3],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        }
      }
    },
    {
      name: 'extension',
      label: 'Extension',
      options: {
        filter: true,
        sort: true,
        display: columnItems[4].display,
        sortDirection: sortDirection[4],
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        },
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="office"
                  placeholder="GPAC Offices"
                  url={`${Endpoints.Users}/${Endpoints.Roster}/${Endpoints.Offices}`}
                  selectedValue={filters.office}
                  renderOption={option => (
                    <>
                      <span>{`${option.title}`}</span>
                      {option.state && ','}
                      &nbsp;
                      <strong>{option.state && option.state}</strong>
                    </>
                  )}
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
        filter: true,
        sort: true,
        display: columnItems[5].display,
        sortDirection: sortDirection[5],
        customBodyRender: value => {
          return (
            <CellSkeleton searching={searching}>
              <span>{value}</span>
            </CellSkeleton>
          );
        },
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="state"
                  selectedValue={filters.state}
                  placeholder="State"
                  url={Endpoints.States}
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
        filter: true,
        sort: true,
        display: columnItems[6].display,
        sortDirection: sortDirection[6],
        filterType: 'custom',
        customBodyRender: value => {
          return <CellSkeleton searching={searching}>{value}</CellSkeleton>;
        },
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="city"
                  placeholder="City"
                  url={filters.state ? `${Endpoints.Cities}?stateId=${filters.state.id}` : ''}
                  selectedValue={filters.city}
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    }
  ];

  const getRosterTypes = useCallback(async () => {
    try {
      const response = await API.get(
        `${Endpoints.Roles}?${queryString.stringify({
          filter: 'roster'
        })}`
      );
      if (response) {
        setRosterTypes([gpacAll, ...response.data]);
      }
    } catch (error) {
      onShowAlert({
        severity: 'error',
        title: 'Roster',
        autoHideDuration: 3000,
        body: getErrorMessage(error)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onShowAlert]);

  useEffect(() => {
    getData();
    getRosterTypes();
  }, [getData, getRosterTypes]);

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={loading}
        title="ROSTER"
        selector={
          <AutocompleteSelect
            name="role"
            placeholder="Roster to show"
            selectedValue={filters.role || rosterTypes[0]}
            onSelect={handleFilterChange}
            defaultOptions={rosterTypes}
          />
        }
        filters={filters}
        onFilterRemove={handleFilterRemove}
        onFiltersReset={handleResetFiltersClick}
      >
        <DataTable
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
          onColumnDisplayClick={handleColumnDisplayClick}
          selectableRows="none"
        />
      </ListPageLayout>
    </ContentPageLayout>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(RostersList);
