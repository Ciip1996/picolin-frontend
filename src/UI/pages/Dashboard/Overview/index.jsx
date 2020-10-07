// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';

import Grid from '@material-ui/core/Grid';

import DashboardLayout from 'UI/components/templates/DashboardLayout';
import TabsView from 'UI/components/templates/TabsView';
import ColumnChart from 'UI/components/molecules/Dashboard/ColumnChart';
import LineChart from 'UI/components/molecules/Dashboard/LineChart';
import SummaryTotals from 'UI/components/molecules/Dashboard/SummaryTotals';
import SummaryTable from 'UI/components/molecules/Dashboard/SummaryTable';

import { DateFormats, PageTitles } from 'UI/constants/defaults';
import { Endpoints } from 'UI/constants/endpoints';
import { EntityType } from 'UI/constants/entityTypes';
import type { DashboardPeriod, Filters } from 'types/app';
import { filtersToParams } from 'selectors/app';
import { getDefaultDashboardPeriod } from 'UI/utils';

import { Card, CardHeader, CardContent } from '../styles';

const statusChartColumns = ['Status', 'Total', { role: 'style' }];

type DashboardOverviewProps = {
  filters: Filters
};

const determineScope = (filters: Filters) => {
  const options = {
    option1: 'gpac All',
    option2: 'ALL COACHES'
  };

  if (!filters.coach && !filters.recruiter && !filters.regional) {
    return options;
  }
  if (filters.recruiter && filters.recruiter?.value) {
    const recruiterScope = filters.recruiter.value.full_name.toUpperCase();
    return {
      option1: recruiterScope,
      option2: recruiterScope
    };
  }
  if (filters.coach?.value) {
    const coachScope = `TEAM ${filters.coach.value.full_name.toUpperCase()}`;
    return {
      option1: coachScope,
      option2: coachScope
    };
  }

  if (filters.regional?.value) {
    const regionScope = `REGION ${filters.regional.value.full_name.toUpperCase()}`;
    return {
      option1: regionScope,
      option2: regionScope
    };
  }
  return {};
};

const DashboardOverview = (props: DashboardOverviewProps) => {
  const { filters } = props;
  const defaultPeriod = getDefaultDashboardPeriod();
  const [selectedPeriod, setSelectedPeriod] = useState<DashboardPeriod>(defaultPeriod);
  const [selectedTabs, setSelectedTabs] = useState({
    activity: 0,
    noActivity: 0
  });

  useEffect(() => {
    document.title = PageTitles.Dashboard;
  }, []);

  const handlePeriodChange = (period: DashboardPeriod) => {
    setSelectedPeriod(period);
  };

  const handleTabChange = tabId => (event, newValue = 0) => {
    setSelectedTabs(prevState => ({ ...prevState, [tabId]: newValue }));
  };

  const filtersParams = filtersToParams(filters);
  const queryParams = queryString.stringify({
    startDate: moment(selectedPeriod.startDate).format(DateFormats.QueryFormat),
    endDate: moment(selectedPeriod.endDate).format(DateFormats.QueryFormat),
    ...filtersParams
  });

  const scope = determineScope(filters);

  const tabsProp = [
    {
      label: 'Totals',
      view: (
        <SummaryTable
          url={`${Endpoints.Dashboard}/activityList?${queryParams}`}
          downloadFileName={`Activities-${scope.option2}`}
        />
      )
    },
    {
      label: 'Candidates',
      view: (
        <SummaryTable
          url={`${Endpoints.Dashboard}/activityList?${queryParams}&entityType=candidate`}
          downloadFileName={`Activities-Candidates-${scope.option2}`}
        />
      )
    },
    {
      label: 'Job Orders',
      view: (
        <SummaryTable
          url={`${Endpoints.Dashboard}/activityList?${queryParams}&entityType=joborder`}
          downloadFileName={`Activities-JobOrders-${scope.option2}`}
        />
      )
    },
    {
      label: 'Companies',
      view: (
        <SummaryTable
          url={`${Endpoints.Dashboard}/activityList?${queryParams}&entityType=company`}
          downloadFileName={`Activities-Companies-${scope.option2}`}
        />
      )
    }
  ];

  const noActivityTabsProp = [
    {
      label: 'Without new Inventory',
      view: (
        <SummaryTable
          url={`${Endpoints.Dashboard}/inventoryList?${queryParams}&withoutItems=true`}
          downloadFileName={`No-Inventory-${scope.option2}`}
        />
      )
    },
    {
      label: 'Without new Activity',
      view: (
        <SummaryTable
          url={`${Endpoints.Dashboard}/activityList?${queryParams}&withoutItems=true`}
          downloadFileName={`No-Activity-${scope.option2}`}
        />
      )
    }
  ];

  return (
    <DashboardLayout title="ACTIVITY" onPeriodChange={handlePeriodChange}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Inventory" subheader={scope.option1} />
            <CardContent>
              <SummaryTotals url={`${Endpoints.Dashboard}/totalInventory?${queryParams}`} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Candidates" subheader={scope.option1} />
            <CardContent>
              <ColumnChart
                url={`${Endpoints.Dashboard}/totalTypes?entityType=${EntityType.Candidate}&${queryParams}`}
                columns={statusChartColumns}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Job Orders" subheader={scope.option1} />
            <CardContent>
              <ColumnChart
                url={`${Endpoints.Dashboard}/totalTypes?entityType=${EntityType.Joborder}&${queryParams}`}
                columns={statusChartColumns}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Inventory" subheader={scope.option2} />
            <CardContent style={{ padding: 0 }}>
              <SummaryTable
                url={`${Endpoints.Dashboard}/inventoryList?${queryParams}`}
                downloadFileName={`Inventory-${scope.option2}`}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="CANDIDATES" subheader={scope.option2} />
            <CardContent style={{ padding: 0 }}>
              <SummaryTable
                url={`${Endpoints.Dashboard}/activityListType?${queryParams}&entityType=candidate`}
                downloadFileName={`Candidates-${scope.option2}`}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="JOB ORDERS" subheader={scope.option2} />
            <CardContent style={{ padding: 0 }}>
              <SummaryTable
                url={`${Endpoints.Dashboard}/activityListType?${queryParams}&entityType=joborder`}
                downloadFileName={`JobOrders-${scope.option2}`}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Activities Trend" subheader={scope.option2} />
            <CardContent>
              <LineChart
                url={`${Endpoints.Dashboard}/activityNoteInTime?${queryParams}`}
                columns={[]}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Activities" subheader={scope.option2} />
            <CardContent style={{ padding: 0 }}>
              <TabsView
                selectedTab={selectedTabs.activity}
                onChangeTabIndex={handleTabChange('activity')}
                tabs={tabsProp}
                panelHeight="unset"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="No activity" subheader={scope.option2} />
            <CardContent style={{ padding: 0 }}>
              <TabsView
                selectedTab={selectedTabs.noActivity}
                onChangeTabIndex={handleTabChange('noActivity')}
                tabs={noActivityTabsProp}
                panelHeight="unset"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

const mapStateToProps = ({ dashboard }) => {
  return {
    filters: dashboard.domain.filters
  };
};

const DashboardOverviewConnected = connect(mapStateToProps, null)(DashboardOverview);

export default DashboardOverviewConnected;
