// @flow
import React, { useState, useEffect, useCallback } from 'react';
// import NumberFormat from 'react-number-format';

import { useHistory } from 'react-router-dom';
// import queryString from 'query-string';
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
import { Urls } from 'UI/constants/mockData';
import axios from 'axios';

// import API from 'services/API';
import { EntityRoutes } from 'routes/constants';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorMessage, nestTernary } from 'UI/utils';
import { accountabilityFilters } from 'UI/constants/entityTypes';
import type { Filters } from 'types/app';

import ListPageLayout from 'UI/components/templates/ListPageLayout';
import { saveFilters, getFilters } from 'services/FiltersStorage';
import { PageTitles } from 'UI/constants/defaults';
import Contents from './strings';

type SalesListProps = {
  onShowAlert: any => void
};

const filterOptions = accountabilityFilters('Ventas');

const chainedSelects = {
  industry: ['specialty', 'subspecialty', 'position'],
  specialty: ['subspecialty', 'position'],
  state: ['city', 'zip']
};

const columnItems = [
  { id: 0, name: 'type', display: true },
  { id: 1, name: 'codigo', display: true },
  { id: 2, name: 'color', display: true },
  { id: 3, name: 'talla', display: true },
  { id: 4, name: 'piezas', display: false },
  { id: 5, name: 'precio', display: true },
  { id: 6, name: 'genero', display: false },
  { id: 7, name: 'tipo', display: true },
  { id: 8, name: 'status', display: true }
];

const getSortDirections = (orderBy: string, direction: string) =>
  columnItems.map(item => (item.name === orderBy ? direction : 'none'));

const SalesList = (props: SalesListProps) => {
  const { onShowAlert } = props;
  const history = useHistory();
  const language = localStorage.getItem('language');

  useEffect(() => {
    document.title = PageTitles.Sales;
  }, []);

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<any>([{}]);
  const [count, setCount] = useState(0);

  const savedSearch = getFilters('ventas');
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
        status,
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
        statusId: status ? status.id : null,
        coachId: coach ? coach.id : null,
        typeId: itemType ? itemType.id : null,
        page: uiState.page + 1,
        perPage: uiState.perPage
      };

      saveFilters('ventas', { filters, params });

      // const queryParams = queryString.stringify(params);

      // const response =  await API.get(`${Endpoints.Ventas}?${queryParams}`);
      axios
        .get(Urls.sales)
        .then(res => {
          setData(res.data);
        })
        .catch(error => {
          // handle error
          onShowAlert({
            severity: 'error',
            title: Contents[language].errtitle,
            autoHideDuration: 3000,
            body: getErrorMessage(error)
          });
        })
        .finally(() => {
          setLoading(false);
        });
      // setData(response.data.data);
      // setCount(Number(response.data.total));
      setLoading(false);
      setCount(Number(1));
    } catch (error) {
      onShowAlert({
        severity: 'error',
        title: Contents[language].pageTitle,
        autoHideDuration: 3000,
        body: getErrorMessage(error)
      });
    }
  }, [filters, uiState, onShowAlert, language]);

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
  const statussUrl =
    savedFilters?.userFilter && savedFilters.userFilter.id !== 0
      ? nestTernary(
          savedFilters.userFilter.id === 3,
          `${Endpoints.Users}?role_id=1`,
          `${Endpoints.statuss}/myTeam`
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
      label: 'Type',
      options: {
        filter: true,
        sort: true,
        display: columnItems[0].display,
        sortDirection: sortDirection[0],
        customBodyRender: value => {
          return (
            value?.type && (
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
      name: 'codigo',
      label: 'Codigo',
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
      name: 'color',
      label: 'Color',
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
                  displayKey="codigo"
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'piezas',
      label: 'Piezas',
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
                  name="status"
                  placeholder="status"
                  url={statussUrl}
                  selectedValue={filters.status}
                  displayKey="codigo"
                  onSelect={handleFilterChange}
                />
              </FormControl>
            );
          }
        }
      }
    },
    {
      name: 'precio',
      label: 'Precio',
      options: {
        filter: true,
        sort: true,
        display: columnItems[5].display,
        sortDirection: sortDirection[5],
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
      name: 'genero',
      label: 'Genero',
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
      name: 'tipo',
      label: 'Tipo',
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
      name: 'status',
      label: 'Status',
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
    }
  ];

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={loading}
        title="VENTAS"
        selector={
          <AutocompleteSelect
            name="userFilter"
            placeholder="Ventas to show"
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

export default connect(null, mapDispatchToProps)(SalesList);
