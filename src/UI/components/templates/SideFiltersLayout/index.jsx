// @flow
import React, { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { connect } from 'react-redux';
import intersectionWith from 'lodash/intersectionWith';
/** Material Assets and Components */

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

/** Atoms, Components and Styles */
import Searchbar from 'UI/components/molecules/Searchbar';
import ActionButton from 'UI/components/atoms/ActionButton';
import TextBox from 'UI/components/atoms/TextBox';
import AutocompleteSelect, {
  statusRenderOption,
  statusStartAdornment
} from 'UI/components/molecules/AutocompleteSelect';
import { SearchResultsNotFound } from 'UI/res';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fuseStyles, nestTernary, getFeatureFlags } from 'UI/utils';
import { FilterType, HideMode } from 'UI/constants/defaults';
import { Endpoints } from 'UI/constants/endpoints';
import { FeatureFlags } from 'UI/constants/featureFlags';
import { entityTypes, EntityType } from 'UI/constants/entityTypes';
import type { Filters } from 'types/app';
import { searchInventory, searchDig, resetFilters as resetMapFilters } from 'actions/map';
import { saveFilters, resetFilters as resetDashboardFilters } from 'actions/dashboard';
import { filtersToUi } from 'selectors/app';
import { showAlert } from 'actions/app';
import { globalStyles } from 'GlobalStyles';
import { styles } from './styles';

type Section = 'dig' | 'inventory' | 'dashboard';
type FilterDefinition = {
  name: string,
  paramName: string,
  type: string,
  title?: string | ((any, Section) => string),
  options?: any[],
  customStyle?: any,
  url?: string | (any => string),
  showWhen?: any => boolean,
  displayKey?: string,
  hideMode?: 'hidden' | 'unmounted',
  disableClearable?: boolean,
  renderOption?: any => any,
  startAdornment?: any => any
};

const typeEndpoints = {
  [EntityType.Candidate]: Endpoints.CandidateTypes,
  [EntityType.Joborder]: Endpoints.JobOrderTypes
};

const getSearchByText = (type: string) => {
  switch (type) {
    case EntityType.Candidate:
      return 'Name';
    case EntityType.Company:
      return 'Company';
    case EntityType.Joborder:
      return 'Title';
    default:
      return 'keyword';
  }
};

const featureFlags = getFeatureFlags();

const allFiltersDefinition: FilterDefinition[] = [
  {
    name: 'entityType',
    paramName: 'entityType',
    title: 'Type',
    type: FilterType.Select,
    options: entityTypes.filter(each => each.isActive),
    disableClearable: true,
    customStyle: globalStyles.inputSpacing
  },
  {
    name: 'keyword',
    paramName: 'keyword',
    title: (filters: any, section: Section) =>
      `Search by ${section === 'dig' ? 'Recruiter' : getSearchByText(filters.entityType?.id)}`,
    type: FilterType.Search,
    customStyle: globalStyles.inputSpacing
  },
  {
    name: 'industry',
    paramName: 'industryId',
    title: 'Industry',
    type: FilterType.Autocomplete,
    url: Endpoints.Industries
  },
  {
    name: 'specialty',
    paramName: 'specialtyId',
    title: 'Industry: Specialty',
    type: FilterType.Autocomplete,
    url: (filters: any) =>
      filters.industry ? `${Endpoints.Specialties}?industryId=${filters.industry.id}` : ''
  },
  {
    name: 'subspecialty',
    paramName: 'subspecialtyId',
    title: 'Subspecialty',
    type: FilterType.Autocomplete,
    url: (filters: any) =>
      filters.specialty ? `${Endpoints.Specialties}/${filters.specialty.id}/subspecialties` : '',
    showWhen: () => featureFlags.includes(FeatureFlags.MapSubspecialtyFilter),
    hideMode: HideMode.Hidden
  },
  {
    name: 'position',
    paramName: 'positionId',
    title: 'Functional title',
    type: FilterType.Autocomplete,
    url: (filters: any) =>
      filters.specialty ? `${Endpoints.Positions}?specialtyId=${filters.specialty.id}` : ''
  },
  {
    name: 'type',
    paramName: 'typeId',
    title: (filters: any) => `${filters.entityType?.singular} Status`,
    type: FilterType.Autocomplete,
    url: (filters: any) => filters.entityType && typeEndpoints[filters.entityType.id],
    showWhen: (filters: any) => filters.entityType && filters.entityType.id !== EntityType.Company,
    hideMode: HideMode.Unmounted,
    renderOption: statusRenderOption,
    startAdornment: statusStartAdornment
  },
  {
    name: 'regional',
    paramName: 'regionalId',
    title: 'Regional Director',
    type: FilterType.Autocomplete,
    displayKey: 'full_name',
    url: `${Endpoints.Users}?role_id=4`
  },
  {
    name: 'coach',
    paramName: 'coachId',
    title: 'Coach',
    type: FilterType.Autocomplete,
    displayKey: 'full_name',
    url: `${Endpoints.Users}?role_id=2`
  },
  {
    name: 'recruiter',
    paramName: 'recruiterId',
    title: 'Recruiter',
    type: FilterType.Autocomplete,
    displayKey: 'full_name',
    url: (filters: any) =>
      filters.coach ? `${Endpoints.Recruiters}/byCoach?coachId=${filters.coach.id}` : ''
  },
  {
    name: 'state',
    paramName: 'stateId',
    title: 'States',
    type: FilterType.Autocomplete,
    url: `${Endpoints.States}`
  },
  {
    name: 'zip',
    paramName: 'zip',
    title: 'Zip Code',
    type: FilterType.Text
  },
  {
    name: 'radius',
    paramName: 'radius',
    title: 'Radious around in miles',
    type: FilterType.Text,
    showWhen: (filters: any) => !!filters.zip,
    hideMode: HideMode.Unmounted
  }
];

type SideFiltersLayoutProps = {
  section: Section,
  includeFilters: string[],
  initialFilters: Filters, // for saved, previousFilters
  defaultFilters: Filters,
  isLoading: false,
  hasLoaded: boolean,
  markers: Object[],
  list: Object[],
  searchButtonText: string,
  areFiltersRequired: boolean,
  onSearch: (section: Section, any) => mixed,
  onFiltersReset: (section: Section) => mixed,
  onShowAlert: any => void
};

const chainedSelects = {
  entityType: ['type'],
  industry: ['specialty', 'subspecialty', 'position'],
  specialty: ['subspecialty'],
  coach: ['recruiter']
};

const SideFiltersLayout = (props: SideFiltersLayoutProps) => {
  const {
    section,
    includeFilters,
    initialFilters,
    defaultFilters,
    isLoading,
    hasLoaded,
    markers,
    list,
    searchButtonText,
    areFiltersRequired,
    onSearch,
    onFiltersReset,
    onShowAlert
  } = props;
  const [filters, setFilters] = useState<Filters>({ ...defaultFilters });
  const [areFiltersDirty, setAreFiltersDirty] = useState(false);
  const filtersDefinition: FilterDefinition[] = intersectionWith(
    allFiltersDefinition,
    includeFilters,
    (filterDefinition, filterToShow) => filterDefinition.name === filterToShow
  );

  useDeepCompareEffect(() => {
    setFilters({ ...defaultFilters, ...initialFilters });
  }, [initialFilters, defaultFilters]);

  const handleFilterChange = (name?: string, value: any) => {
    setFilters((prevState: Filters): Filters => ({
      ...prevState,
      [name]: value
    }));
    setAreFiltersDirty(true);

    if (name && chainedSelects[name]) {
      chainedSelects[name].forEach(chainedSelect => {
        setFilters((prevState: Filters): Filters => ({
          ...prevState,
          [chainedSelect]: null
        }));
      });
    }
  };

  const handleSearchClick = async () => {
    if (!atLeastOneFilter && areFiltersRequired) {
      onShowAlert &&
        onShowAlert({
          severity: 'warning',
          title: 'Filters',
          body: 'Select at least one filter'
        });
      return;
    }

    const filtersWithValue = {};

    filtersDefinition.forEach(eachFilter => {
      if (filters[eachFilter.name]) {
        filtersWithValue[eachFilter.name] = {
          paramName: eachFilter.paramName,
          value: filters[eachFilter.name]
        };
      }
    });

    onSearch(section, filtersWithValue);
    setAreFiltersDirty(false);
  };

  const handleResetClick = () => {
    onFiltersReset && onFiltersReset(section);
    setFilters(defaultFilters);
  };

  const renderFilter = (filterDef: any) => {
    const isVisible = filterDef.showWhen !== undefined ? filterDef.showWhen(filters) : true;
    const title =
      typeof filterDef.title === 'string'
        ? filterDef.title
        : nestTernary(typeof filterDef.title === 'function', filterDef.title(filters, section), '');

    if (!isVisible && (!filterDef.hideMode || filterDef.hideMode === HideMode.Unmounted)) {
      return null;
    }

    const filterStyles = {
      ...(filterDef.customStyle ? filterDef.customStyle : globalStyles.inputMinSpacing),
      display: !isVisible && filterDef.hideMode === HideMode.Hidden ? 'none' : 'block'
    };

    switch (filterDef.type) {
      case FilterType.Autocomplete:
        return (
          <Box key={`filter-${filterDef.name}`} style={filterStyles}>
            <AutocompleteSelect
              name={filterDef.name}
              selectedValue={filters[filterDef.name]}
              placeholder={title}
              displayKey={filterDef.displayKey || 'title'}
              url={
                typeof filterDef.url === 'string'
                  ? filterDef.url
                  : nestTernary(typeof filterDef.url === 'function', filterDef.url(filters), '')
              }
              onSelect={handleFilterChange}
              renderOption={filterDef.renderOption || undefined}
              disableClearable={filterDef.disableClearable}
              startAdornment={
                filters[filterDef.name] &&
                filterDef.startAdornment &&
                filterDef.startAdornment(filters[filterDef.name].style_class_name)
              }
            />
          </Box>
        );
      case FilterType.Search:
        return (
          <Box key={`filter-${filterDef.name}`} style={filterStyles}>
            <Searchbar
              name={filterDef.name}
              placeholder={title}
              value={filters[filterDef.name] || ''}
              width="100%"
              onChange={handleFilterChange}
              onSearch={handleSearchClick}
            />
          </Box>
        );
      case FilterType.Select:
        return (
          <Box key={`filter-${filterDef.name}`} style={filterStyles}>
            <AutocompleteSelect
              name={filterDef.name}
              selectedValue={filters[filterDef.name]}
              options={filterDef.options}
              placeholder={filterDef.title}
              displayKey={filterDef.displayKey || 'title'}
              disableClearable={filterDef.disableClearable}
              width="100%"
              onSelect={handleFilterChange}
            />
          </Box>
        );
      case FilterType.Text:
        return (
          <Box key={`filter-${filterDef.name}`} style={filterStyles}>
            <TextBox
              name={filterDef.name}
              value={filters[filterDef.name] || ''}
              type="number"
              label={filterDef.title}
              onChange={handleFilterChange}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  const resetStyles = fuseStyles([globalStyles.resetButton, styles]);

  const atLeastOneFilter = filtersDefinition.some(eachFilter => filters[eachFilter.name]);
  return (
    <>
      <Box my={0.5} textAlign="right">
        <Button
          color="primary"
          size="small"
          onClick={handleResetClick}
          disabled={!atLeastOneFilter && areFiltersRequired}
          style={!atLeastOneFilter && areFiltersRequired ? globalStyles.resetButton : resetStyles}
        >
          Reset all
        </Button>
      </Box>
      {filtersDefinition.map(eachFilter => renderFilter(eachFilter))}
      <Box style={globalStyles.inputSpacing}>
        <ActionButton
          style={globalStyles.mapActionButton}
          text={isLoading ? 'Searching ...' : searchButtonText}
          onClick={handleSearchClick}
          iconPosition="right"
        >
          {isLoading ? <CircularProgress style={styles.circularProgress} size="24px" /> : null}
        </ActionButton>
      </Box>
      {hasLoaded && markers.length ? (
        <Typography variant="body2" component="div">
          Showing <strong>{section === 'inventory' ? markers.length : list.length} </strong> results
        </Typography>
      ) : null}
      {hasLoaded && !areFiltersDirty && markers.length === 0 && atLeastOneFilter ? (
        <Box p={3} textAlign="center">
          <Box fontWeight="fontWeightBold">We couldn’t find what you’re looking for! </Box>
          <Box mb={3}>Maybe try changing your search filters</Box>
          <SearchResultsNotFound width={150} height={185} />
        </Box>
      ) : null}
    </>
  );
};

SideFiltersLayout.defaultProps = {
  searchButtonText: 'Search',
  areFiltersRequired: true
};

const mapStateToProps = (state, ownProps) => {
  const { section } = ownProps;
  const slice = section !== 'dashboard' ? 'map' : section;
  return {
    markers: state.map.domain.markers,
    list: state.map.domain.recruiters,
    isLoading: state[slice].ui.isLoading,
    hasLoaded: state[slice].ui.hasLoaded,
    initialFilters: filtersToUi(state[slice].domain.filters)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSearch: (section, filters) => dispatch(determineOnSearch(section, filters)),
    onFiltersReset: section => dispatch(determineOnReset(section)),
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

const determineOnSearch = (section: Section, filters: Filters) => {
  switch (section) {
    case 'dig':
      return searchDig(filters);
    case 'inventory':
      return searchInventory(filters);
    default:
      return saveFilters(filters);
  }
};

const determineOnReset = (section: Section) => {
  return section === 'dashboard' ? resetDashboardFilters() : resetMapFilters();
};

const SideFiltersLayoutConnected = connect(mapStateToProps, mapDispatchToProps)(SideFiltersLayout);

export default SideFiltersLayoutConnected;
