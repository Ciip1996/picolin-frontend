// @flow
import React, { useState, useEffect, useCallback } from 'react';
// import NumberFormat from 'react-number-format';

import { useHistory } from 'react-router-dom';

import queryString from 'query-string';
import moment from 'moment';
import { connect } from 'react-redux';

import { FormControl } from '@material-ui/core';

import { showAlert } from 'actions/app';

/** Atoms, Components and Styles */
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import Modal from '@material-ui/core/Modal';

/** Components */
import DataTable from 'UI/components/organisms/DataTable';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import ListPageLayout from 'UI/components/templates/ListPageLayout';

/** API / EntityRoutes / Endpoints / EntityType */
import API from 'services/API';
import { EntityRoutes } from 'routes/constants';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorMessage } from 'UI/utils';
import AddToProjectModal from 'UI/components/organisms/AddToProjectModal';
import CreateProjectModal from 'UI/components/organisms/CreateProjectModal';

import {
  SearchProjectMenuIcon,
  AddSearchProjectIcon,
  CreateSearchProjectIcon,
  colors
} from 'UI/res';
import ButtonMenu from 'UI/components/molecules/ButtonMenu';

import { saveFilters, getFilters } from 'services/FiltersStorage';
import { PageTitles } from 'UI/constants/defaults';

type Filters = { [name: string]: any };

type NamesListProps = {
  onShowAlert: any => void
};

const chainedSelects = {
  industry: ['specialty', 'subspecialty', 'position'],
  specialty: ['subspecialty', 'position'], // position is functional title
  item_type: ['status']
};

const columnItems = [
  { id: 0, name: 'type', display: true },
  { id: 1, name: 'full_name', display: true },
  { id: 2, name: 'functional_title', display: true },
  { id: 3, name: 'specialty_title', display: true },
  { id: 4, name: 'item_type', display: true },
  { id: 5, name: 'item_status', display: true },
  { id: 6, name: 'added_date', display: false }
];

const getSortDirections = (orderBy: string, direction: string) =>
  columnItems.map(item => (item.name === orderBy ? direction : 'none'));

const NamesList = (props: NamesListProps) => {
  const { onShowAlert } = props;
  const history = useHistory();

  useEffect(() => {
    document.title = PageTitles.Name;
  });

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<any>(null);
  const [count, setCount] = useState(0);

  const savedSearch = getFilters('names');
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

  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);

  const handleOpen = () => {
    return setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenProject = () => {
    setOpenModal(true);
  };

  const handleCloseProject = () => {
    setOpenModal(false);
  };

  const MenuItems = [
    {
      icon: <AddSearchProjectIcon fill={colors.completeBlack} />,
      title: 'Add to a Search Project',
      action: handleOpen,
      visible: true
    },
    {
      icon: <CreateSearchProjectIcon fill={colors.completeBlack} />,
      title: 'Create new Search Project',
      action: handleOpenProject,
      visible: true
    }
  ];

  const getData = useCallback(async () => {
    try {
      const {
        state,
        city,
        zip,
        industry,
        specialty,
        subspecialty,
        position,
        recruiter,
        item_type: itemType,
        status
      } = filters;
      const params = {
        stateId: state ? state.id : null,
        cityId: city ? city.id : null,
        zip: zip ? zip.title : null,
        industryId: industry ? industry.id : null,
        subspecialtyId: subspecialty ? subspecialty.id : null,
        recruiterId: recruiter ? recruiter.id : null,
        page: uiState.page + 1,
        perPage: uiState.perPage,
        orderBy: uiState.orderBy,
        direction: uiState.direction,
        keyword: uiState.keyword,
        positionId: position ? position.id : null,
        specialtyId: specialty ? specialty.id : null,
        nameTypeId: itemType ? itemType.id : null,
        nameStatusId: status ? status.id : null
      };
      saveFilters('names', { filters, params });

      const queryParams = queryString.stringify(params);
      const response = await API.get(`${Endpoints.Names}?${queryParams}`);

      setData(response.data.data);
      setCount(Number(response.data.total));
      setLoading(false);
    } catch (error) {
      onShowAlert({
        severity: 'error',
        title: 'Names',
        autoHideDuration: 3000,
        body: getErrorMessage(error)
      });
    }
  }, [filters, onShowAlert, uiState]);

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
        setFilters((prevState: Filters): Filters => {
          return { ...prevState, [chainedSelect]: null };
        });
      });
    }
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
    const { id, item_type } = data[newItem.rowIndex];
    const route = {
      'Hiring Authority': EntityRoutes.HiringAuthorityProfile,
      Name: EntityRoutes.NameProfile,
      Candidate: EntityRoutes.CandidateProfile
    };
    if (route && item_type) {
      history.push(route[item_type].replace(':id', id));
    }
  };

  const handleResetFiltersClick = () => {
    setFilters({});
  };

  const handleFilterRemove = (filterName: string) => {
    setFilters({ ...filters, [filterName]: null });
  };

  const sharedOptions = {
    filter: true,
    sort: true,
    filterType: 'custom',
    print: false
  };

  const sortDirection = getSortDirections(uiState.orderBy, uiState.direction);

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
      name: 'full_name',
      label: 'Full Name',
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[1],
        display: columnItems[1].display,
        customBodyRender: value => <strong>{value}</strong>,
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
      name: 'specialty_title',
      label: 'Industry: Specialty',
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[3],
        display: columnItems[3].display,
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
        ...sharedOptions,
        sortDirection: sortDirection[2],
        display: columnItems[2].display,
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
      name: 'item_type',
      label: 'Item type',
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[4],
        display: columnItems[4].display,
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="item_type"
                  placeholder="Item type"
                  url={Endpoints.NameTypes}
                  selectedValue={filters?.item_type}
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
        ...sharedOptions,
        sortDirection: sortDirection[5],
        display: columnItems[5].display,
        filterOptions: {
          display: () => {
            return (
              <FormControl>
                <AutocompleteSelect
                  name="status"
                  placeholder="Status"
                  url={
                    filters?.item_type
                      ? `${Endpoints.NameStatus.replace(':id', filters?.item_type.id)}`
                      : ''
                  }
                  selectedValue={filters?.status}
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
        filter: false,
        sort: true,
        sortDirection: sortDirection[6],
        display: columnItems[6].display,
        customBodyRender: value => {
          return <span>{moment(value).format('MM/DD/YYYY')}</span>;
        }
      }
    }
  ];

  return (
    <ContentPageLayout>
      <ListPageLayout
        filters={filters}
        onFilterRemove={handleFilterRemove}
        onFiltersReset={handleResetFiltersClick}
        loading={loading}
        title="NAMES"
        selector={null}
      >
        <DataTable
          customToolbarSelect={
            <ButtonMenu MenuItems={MenuItems} isIconButton text="Add" width="200px">
              <SearchProjectMenuIcon fill={colors.completeBlack} size={24} />
            </ButtonMenu>
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
          onColumnDisplayClick={handleColumnDisplayClick}
        />
      </ListPageLayout>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <AddToProjectModal />
      </Modal>
      <Modal
        open={openModal}
        onClose={handleCloseProject}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <CreateProjectModal />
      </Modal>
    </ContentPageLayout>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(NamesList);
