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
import Login from 'UI/pages/Login';
import Companies from 'UI/pages/Companies';
import Candidates from 'UI/pages/Candidates';
import JobOrders from 'UI/pages/JobOrders';
import Map from 'UI/pages/Map';
import ErrorPage from 'UI/pages/ErrorPage';
import Names from 'UI/pages/Names';
import FeeAgreements from 'UI/pages/FeeAgreements';

import NameProfile from 'UI/pages/NameProfile';
import HiringAuthorityProfile from 'UI/pages/HiringAuthorityProfile';

import NewCandidate from 'UI/pages/NewCandidates';
import NewJobOrder from 'UI/pages/NewJobOrder';
import NewCompany from 'UI/pages/NewCompany';
import RecreateAsHiringAuthority from 'UI/pages/RecreateAsHiringAuthority';
import NewName from 'UI/pages/NewName';
import SearchProject from 'UI/pages/SearchProject';
import SearchProjectPreview from 'UI/pages/SearchProjectPreview';
import Roster from 'UI/pages/Roster';

import DashboardOverview from 'UI/pages/Dashboard/Overview';
import FeeAgreementDrawers from 'UI/pages/FeeAgreementDrawers';
import BulkEmail from 'UI/pages/BulkEmail';
import Email from 'UI/pages/Email';

import Notifier from 'UI/components/molecules/Notifier';
import { FeatureFlags } from 'UI/constants/featureFlags';
import { getFeatureFlags } from 'UI/utils';
import Calls from 'UI/pages/Calls';
import TextMessage from 'UI/pages/TextMessage';

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

        <PrivateRoute exact path={EntityRoutes.Map} component={Map} />

        <PrivateRoute exact path={EntityRoutes.Candidates} component={Candidates} />
        <PrivateRoute exact path={EntityRoutes.CandidateProfile} component={CandidateProfile} />
        <PrivateRoute exact path={EntityRoutes.CandidateCreate} component={NewCandidate} />

        <PrivateRoute exact path={EntityRoutes.Companies} component={Companies} />
        <PrivateRoute exact path={EntityRoutes.CompanyProfile} component={CompanyProfile} />
        <PrivateRoute exact path={EntityRoutes.CompanyCreate} component={NewCompany} />

        <PrivateRoute exact path={EntityRoutes.JobOrders} component={JobOrders} />
        <PrivateRoute exact path={EntityRoutes.JobOrderProfile} component={JobOrderProfile} />
        <PrivateRoute exact path={EntityRoutes.JobOrderCreate} component={NewJobOrder} />

        <PrivateRoute exact path={EntityRoutes.DashboardOverview} component={DashboardOverview} />
        <PrivateRoute exact path={EntityRoutes.Roster} component={Roster} />

        <PrivateRoute
          exact
          path={EntityRoutes.FeeAgreements}
          component={FeeAgreements}
          enabled={featureFlags.includes(FeatureFlags.FeeAgreement)}
        />

        <PrivateRoute
          exact
          path={EntityRoutes.Names}
          component={Names}
          enabled={featureFlags.includes(FeatureFlags.Names)}
        />
        <PrivateRoute
          exact
          path={EntityRoutes.HiringAuthorityCreate}
          component={RecreateAsHiringAuthority}
          enabled={featureFlags.includes(FeatureFlags.Names)}
        />
        <PrivateRoute
          exact
          path={EntityRoutes.NameProfile}
          component={NameProfile}
          enabled={featureFlags.includes(FeatureFlags.Names)}
        />
        <PrivateRoute
          exact
          path={EntityRoutes.NameCreate}
          component={NewName}
          enabled={featureFlags.includes(FeatureFlags.Names)}
        />
        <PrivateRoute
          exact
          path={EntityRoutes.HiringAuthorityProfile}
          component={HiringAuthorityProfile}
          enabled={featureFlags.includes(FeatureFlags.Names)}
        />

        <PrivateRoute
          exact
          path={EntityRoutes.SearchProject}
          component={SearchProject}
          enabled={featureFlags.includes(FeatureFlags.SearchProjects)}
        />
        <PrivateRoute
          exact
          path={EntityRoutes.SearchProjectPreview}
          component={SearchProjectPreview}
          enabled={featureFlags.includes(FeatureFlags.SearchProjects)}
        />

        <PrivateRoute
          exact
          path={EntityRoutes.BulkEmail}
          component={BulkEmail}
          enabled={featureFlags.includes(FeatureFlags.Activity)}
        />
        <PrivateRoute
          exact
          path={EntityRoutes.Email}
          component={Email}
          enabled={featureFlags.includes(FeatureFlags.Activity)}
        />
        <PrivateRoute
          exact
          path={EntityRoutes.FeeAgreementDrawers}
          component={FeeAgreementDrawers}
          enabled={featureFlags.includes(FeatureFlags.FeeAgreement)}
        />
        <PrivateRoute
          exacts
          path={EntityRoutes.Calls}
          component={Calls}
          enabled={featureFlags.includes(FeatureFlags.Activity)}
        />
        <PrivateRoute
          exacts
          path={EntityRoutes.TextMessage}
          component={TextMessage}
          enabled={featureFlags.includes(FeatureFlags.Activity)}
        />

        <PrivateRoute path="*" component={() => <ErrorPage error={404} />} />
      </Switch>
    </Router>
  );
};

export default Routes;
