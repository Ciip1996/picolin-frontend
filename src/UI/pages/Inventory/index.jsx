// @flow
import React, { useState, useEffect, useCallback } from 'react';
import NumberFormat from 'react-number-format';

import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import moment from 'moment';
import { connect } from 'react-redux';

import { FormControl } from '@material-ui/core';

import { showAlert } from 'actions/app';

/** Atoms, Components and Styles */
import AutocompleteSelect, {
  statusRenderOption,
  statusStartAdornment
} from 'UI/components/molecules/AutocompleteSelect';
import ColorIndicator from 'UI/components/atoms/ColorIndicator';

/** Components */
import DataTable from 'UI/components/organisms/DataTable';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';

/** API / EntityRoutes / Endpoints / EntityType */
import API from 'services/API';
import { EntityRoutes } from 'routes/constants';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorMessage, nestTernary } from 'UI/utils';
import { accountabilityFilters } from 'UI/constants/entityTypes';
import type { Filters } from 'types/app';

import ListPageLayout from 'UI/components/templates/ListPageLayout';
import { saveFilters, getFilters } from 'services/FiltersStorage';
import { PageTitles } from 'UI/constants/defaults';

type CandidatesListProps = {
  onShowAlert: any => void
};

const filterOptions = accountabilityFilters('Inventario');

const chainedSelects = {
  industry: ['specialty', 'subspecialty', 'position'],
  specialty: ['subspecialty', 'position'],
  state: ['city', 'zip']
};

const columnItems = [
  { id: 0, name: 'type', display: true },
  { id: 1, name: 'full_name', display: true },
  { id: 2, name: 'functional_title', display: true },
  { id: 3, name: 'specialty_title', display: true },
  { id: 4, name: 'location', display: false },
  { id: 5, name: 'salary_range', display: true },
  { id: 6, name: 'created_at', display: false },
  { id: 7, name: 'last_activity_date', display: true },
  { id: 8, name: 'recruiter', display: true },
  { id: 9, name: 'email', display: false }
];

const getSortDirections = (orderBy: string, direction: string) =>
  columnItems.map(item => (item.name === orderBy ? direction : 'none'));

const CandidatesList = (props: CandidatesListProps) => {
  const { onShowAlert } = props;
  const history = useHistory();

  useEffect(() => {
    document.title = PageTitles.Candidate;
  }, []);

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<any>(null);
  const [count, setCount] = useState(0);

  const savedSearch = getFilters('inventario');
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
      const {
        userFilter,
        state,
        city,
        zip,
        industry,
        specialty,
        subspecialty,
        position,
        recruiter,
        coach,
        itemType
      } = filters;

      const params = {
        userFilter: userFilter ? userFilter.id : filterOptions[0].id,
        keyword: uiState.keyword,
        orderBy: uiState.orderBy,
        direction: uiState.direction,
        stateId: state ? state.id : null,
        cityId: city ? city.id : null,
        zip: zip ? zip.title : null,
        industryId: industry ? industry.id : null,
        specialtyId: specialty ? specialty.id : null,
        subspecialtyId: subspecialty ? subspecialty.id : null,
        positionId: position ? position.id : null,
        recruiterId: recruiter ? recruiter.id : null,
        coachId: coach ? coach.id : null,
        typeId: itemType ? itemType.id : null,
        page: uiState.page + 1,
        perPage: uiState.perPage
      };

      saveFilters('inventario', { filters, params });

      const queryParams = queryString.stringify(params);

      /* const response = await API.get(`${Endpoints.Inventario}?${queryParams}`);
      setData(response.data.data);
      setCount(Number(response.data.total));*/
      setLoading(false);
    } catch (error) {
      onShowAlert({
        severity: 'error',
        title: 'Inventario',
        autoHideDuration: 3000,
        body: getErrorMessage(error)
      });
    }
  }, [filters, uiState, onShowAlert]);

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

    if (name && chainedSelects[name]) {
      chainedSelects[name].forEach(chainedSelect => {
        setFilters((prevState: Filters): Filters => ({ ...prevState, [chainedSelect]: null }));
      });
    }
  };

  const handleResetFiltersClick = () => {
    setFilters({});
  };

  const handleFilterRemove = (filterName: string) => {
    setFilters({ ...filters, [filterName]: null });
  };

  const handleColumnSortClick = newSortDirection => {
    const { orderBy, direction } = newSortDirection;

    setUiState(prevState => ({
      ...prevState,
      orderBy,
      direction,
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

  const handleColumnDisplayClick = newColumnDisplay => {
    const { column, display } = newColumnDisplay;
    const index = columnItems.findIndex(item => item.name === column);
    columnItems[index].display = display;
  };

  const handleRowClick = newItem => {
    const { id } = data[newItem.rowIndex];
    history.push(EntityRoutes.CandidateProfile.replace(':id', id));
  };

  const sortDirection = getSortDirections(uiState.orderBy, uiState.direction);
  const recruitersUrl =
    savedFilters?.userFilter && savedFilters.userFilter.id !== 0
      ? nestTernary(
          savedFilters.userFilter.id === 3,
          `${Endpoints.Users}?role_id=1`,
          `${Endpoints.Recruiters}/myTeam`
        )
      : '';

  const columns = [
    {
      name: 'id',
      options: {
        filter: true,
        sort: false,
        display: 'excluded',
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="industry"
                  placeholder="Industry"
                  url={Endpoints.Industries}
                  selectedValue={filters.industry}
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'type',
      label: 'Status',
      options: {
        filter: true,
        sort: true,
        display: columnItems[0].display,
        sortDirection: sortDirection[0],
        customBodyRender: value => {
          return (
            value.type && (
              <>
                <ColorIndicator color={value.type_class_name} width={12} height={12} /> {value.type}
              </>
            )
          );
        },
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="specialty"
                  placeholder="Specialty"
                  url={
                    filters.industry
                      ? `${Endpoints.Specialties}?industryId=${filters.industry.id}`
                      : ''
                  }
                  selectedValue={filters.specialty}
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'full_name',
      label: 'Full Name',
      options: {
        filter: true,
        sort: true,
        display: columnItems[1].display,
        sortDirection: sortDirection[1],
        customBodyRender: value => {
          return <strong>{value}</strong>;
        },
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="subspecialty"
                  placeholder="Subspecialty"
                  url={
                    filters.specialty
                      ? `${Endpoints.Specialties}/${filters.specialty.id}/subspecialties`
                      : ''
                  }
                  selectedValue={filters.subspecialty}
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'functional_title',
      label: 'Functional Title',
      options: {
        filter: true,
        sort: true,
        display: columnItems[2].display,
        sortDirection: sortDirection[2],
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="position"
                  placeholder="Functional title"
                  url={
                    filters.specialty
                      ? `${Endpoints.Positions}?specialtyId=${filters.specialty.id}`
                      : ''
                  }
                  selectedValue={filters.position}
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'specialty_title',
      label: 'Industry: Specialty',
      options: {
        filter: true,
        sort: true,
        display: columnItems[3].display,
        sortDirection: sortDirection[3],
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="coach"
                  placeholder="Coach"
                  url={`${Endpoints.Users}?role_id=2`}
                  selectedValue={filters.coach}
                  displayKey="full_name"
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
        display: columnItems[4].display,
        sortDirection: sortDirection[4],
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="recruiter"
                  placeholder="Recruiter"
                  url={recruitersUrl}
                  selectedValue={filters.recruiter}
                  displayKey="full_name"
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'salary_range',
      label: 'Compensation Range',
      options: {
        filter: true,
        sort: true,
        display: columnItems[5].display,
        sortDirection: sortDirection[5],
        customBodyRender: value => {
          return value.map((val, index) => {
            return (
              val && (
                <span key={index.toString()}>
                  {
                    <NumberFormat
                      prefix="$"
                      displayType="text"
                      thousandSeparator=","
                      decimalSeparator="."
                      value={val}
                    />
                  }
                  {index === 2 ? '' : ' - '}
                </span>
              )
            );
          });
        },
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="itemType"
                  placeholder="Candidate Status"
                  url={Endpoints.CandidateTypes}
                  selectedValue={filters.itemType}
                  onSelect={handleFilterChange}
                  renderOption={statusRenderOption}
                  startAdornment={
                    filters.itemType && statusStartAdornment(filters.itemType.style_class_name)
                  }
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'created_at',
      label: 'Added Date',
      options: {
        filter: true,
        sort: true,
        display: columnItems[6].display,
        sortDirection: sortDirection[6],
        customBodyRender: value => {
          return <span>{moment(value).format('MM/DD/YYYY')}</span>;
        },
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="state"
                  placeholder="States"
                  url={Endpoints.States}
                  selectedValue={filters.state}
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'last_activity_date',
      label: 'Last Activity',
      options: {
        filter: true,
        sort: true,
        display: columnItems[7].display,
        sortDirection: sortDirection[7],
        customBodyRender: value => {
          return value ? <span>{moment(value).format('MM/DD/YYYY')}</span> : 'No Activity';
        },
        filterType: 'custom',
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
    },
    {
      name: 'recruiter',
      label: 'Recruiter',
      options: {
        filter: false,
        sort: true,
        display: columnItems[8].display,
        sortDirection: sortDirection[8],
        filterType: 'custom',
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="zip"
                  placeholder="Zip Code"
                  url={
                    filters.city ? `${Endpoints.Cities}/${filters.city.id}/${Endpoints.Zips}` : ''
                  }
                  selectedValue={filters.zip}
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
        filter: false,
        sort: true,
        display: columnItems[9].display,
        sortDirection: sortDirection[9],
        filterType: 'custom'
      }
    }
  ];

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={loading}
        title="INVENTARIO"
        selector={
          <AutocompleteSelect
            name="userFilter"
            placeholder="Inventario to show"
            selectedValue={filters.userFilter || filterOptions[0]}
            onSelect={handleFilterChange}
            defaultOptions={filterOptions}
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

export default connect(null, mapDispatchToProps)(CandidatesList);
