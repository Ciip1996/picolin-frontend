// @flow
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import CandidateProfile from 'UI/pages/CandidateProfile';
import JobOrderProfile from 'UI/pages/JobOrderProfile';
import CompanyProfile from 'UI/pages/CompanyProfile';

import PrivateRoute from 'routes/PrivateRoute';
import { isAuthenticated } from 'services/Authentication';
import { EntityRoutes } from 'routes/constants';

/** Pages */
import Home from 'UI/pages/Home';
import Sales from 'UI/pages/Sales';
import Inventory from 'UI/pages/Inventory';

import Login from 'UI/pages/Login';
import ErrorPage from 'UI/pages/ErrorPage';

import DashboardOverview from 'UI/pages/Dashboard/Overview';

import Notifier from 'UI/components/molecules/Notifier';
import { FeatureFlags } from 'UI/constants/featureFlags';
import { getFeatureFlags } from 'UI/utils';

const featureFlags = getFeatureFlags();

const Routes = () => {
  return (
    <Router>
      <Notifier />
      <Switch>
        <Route exact path="/" render={() => <Redirect to={EntityRoutes.Home} />} />
        <Route
          exact
          path={EntityRoutes.Login}
          render={() => (isAuthenticated() ? <Redirect to={EntityRoutes.Home} /> : <Login />)}
        />

        <PrivateRoute exact path={EntityRoutes.Home} component={Home} />
        <PrivateRoute exact path={EntityRoutes.Sales} component={Sales} />
        <PrivateRoute exact path={EntityRoutes.Inventory} component={Inventory} />

        <PrivateRoute
          exact
          path={EntityRoutes.DashboardOverview}
          component={DashboardOverview}
          enabled={featureFlags.includes(FeatureFlags.FeeAgreement)}
        />
        
        <PrivateRoute path="*" component={() => <ErrorPage error={404} />} />
      </Switch>
    </Router>
  );
};

export default Routes;
