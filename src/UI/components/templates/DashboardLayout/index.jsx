// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { DateRangePicker } from 'react-date-plus-time-range';

import moment from 'moment';
import omit from 'lodash/omit';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import SideFiltersLayout from 'UI/components/templates/SideFiltersLayout';
import CollapsiblePanel from 'UI/components/templates/CollapsiblePanel';

import ActiveFilters from 'UI/components/molecules/ActiveFilters';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import TextBox from 'UI/components/atoms/TextBox';
import ActionButton from 'UI/components/atoms/ActionButton';

import { DateFormats } from 'UI/constants/defaults';
import type { DashboardPeriod, Filters } from 'types/app';
import { saveFilters, resetFilters, toggleMenu } from 'actions/dashboard';

import { getDefaultDashboardPeriod } from 'UI/utils';
import { styles } from './styles';

import './dateRangePicker.css';

const includeFilters = ['industry', 'specialty', 'regional', 'coach', 'recruiter', 'state'];

type DashboardLayoutProps = {
  title: string,
  isSideMenuOpen: boolean,
  children: React.Node,
  filters: Filters,
  onFiltersChange: Filters => any,
  onFiltersReset: () => any,
  onMenuToggle: () => any,
  onPeriodChange: (period: DashboardPeriod) => any
};

const DashboardLayout = (props: DashboardLayoutProps) => {
  const { useState } = React;
  const {
    title,
    isSideMenuOpen,
    filters,
    children,
    onFiltersChange,
    onFiltersReset,
    onMenuToggle,
    onPeriodChange
  } = props;
  const datePickerKey = 'selection';
  const [uiState, setUiState] = useState({
    isDatePickerOpen: false
  });

  const defaultPeriod = getDefaultDashboardPeriod();
  const [selectedPeriod, setSelectedPeriod] = useState<DashboardPeriod>(defaultPeriod);

  const [previewRange, setPreviewRange] = useState([
    {
      ...defaultPeriod,
      key: datePickerKey
    }
  ]);

  const openDateRange = () => {
    setUiState(prevState => ({ ...prevState, isDatePickerOpen: true }));
  };

  const handleDateRangeChange = item => {
    const range = item.selection;
    const endHour = range.endDate.getHours();
    const endMinutes = range.endDate.getMinutes();

    setPreviewRange([
      endHour === 0 && endMinutes === 0
        ? {
            ...range,
            endDate: moment(range.endDate)
              .endOf('day')
              .toDate()
          }
        : range
    ]);
  };

  const handleDateRangeCancel = () => {
    setUiState(prevState => ({ ...prevState, isDatePickerOpen: false }));
    setPreviewRange([
      {
        key: datePickerKey,
        startDate: selectedPeriod.startDate,
        endDate: selectedPeriod.endDate
      }
    ]);
  };

  const handleDateRangeApply = () => {
    const { startDate, endDate } = previewRange[0];
    setUiState(prevState => ({ ...prevState, isDatePickerOpen: false }));
    const newPeriod = {
      startDate,
      endDate
    };
    setSelectedPeriod(newPeriod);
    onPeriodChange && onPeriodChange(newPeriod);
  };

  const handleFilterRemove = (filterName: string) => {
    onFiltersChange(omit(filters, filterName));
  };

  return (
    <ContentPageLayout customStyle={{ display: 'block' }}>
      <CollapsiblePanel isSideMenuOpen={isSideMenuOpen} mode="overlay" onToggle={onMenuToggle}>
        <TitleLabel fontSize={26} text="FILTERS" textTransform="uppercase" />
        <SideFiltersLayout
          searchButtonText="Apply"
          section="dashboard"
          includeFilters={includeFilters}
          defaultFilters={{}}
          areFiltersRequired={false}
        />
      </CollapsiblePanel>
      <div style={styles.dashboardContainer}>
        <Grid container alignItems="center" style={{ marginBottom: 20 }}>
          <Grid item xs={6} sm={8} lg={9}>
            <TitleLabel fontWeight={700} text={title} />
          </Grid>
          <Grid item xs={6} sm={4} lg={3}>
            <TextBox
              name="dateRange"
              label="Date range"
              onFocus={openDateRange}
              value={`${moment(selectedPeriod.startDate).format(
                DateFormats.SimpleDateTime
              )} - ${moment(selectedPeriod.endDate).format(DateFormats.SimpleDateTime)}`}
              inputProps={{
                style: { cursor: 'pointer' }
              }}
            />
          </Grid>
        </Grid>
        {uiState.isDatePickerOpen && (
          <div style={{ position: 'relative' }}>
            <div style={styles.dateRangeContainer}>
              <DateRangePicker
                onChange={handleDateRangeChange}
                showSelectionPreview
                inputRanges={[]}
                months={2}
                ranges={previewRange}
                showTime
                // rangeColors={[`${colors.success}99`]}
                direction="horizontal"
              />
              <Box style={styles.dateRangeToolbar}>
                <ActionButton
                  text="Cancel"
                  variant="outlined"
                  onClick={handleDateRangeCancel}
                  style={{ marginRight: 10 }}
                />
                <ActionButton text="Apply" onClick={handleDateRangeApply} />
              </Box>
            </div>
          </div>
        )}
        <Grid item xs={12} style={styles.activeFiltersContainer}>
          <ActiveFilters
            filters={filters}
            isLoading={false}
            onFilterRemove={handleFilterRemove}
            onReset={onFiltersReset}
          />
        </Grid>
        {children}
      </div>
    </ContentPageLayout>
  );
};

const mapStateToProps = ({ dashboard }) => {
  return {
    isSideMenuOpen: dashboard.ui.isSideMenuOpen,
    filters: dashboard.domain.filters
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFiltersReset: () => dispatch(resetFilters()),
    onFiltersChange: filters => dispatch(saveFilters(filters)),
    onMenuToggle: () => dispatch(toggleMenu())
  };
};

const DashboardLayoutConnected = connect(mapStateToProps, mapDispatchToProps)(DashboardLayout);

export default DashboardLayoutConnected;
