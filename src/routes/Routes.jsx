// @flow
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import PrivateRoute from 'routes/PrivateRoute';
import { isAuthenticated } from 'services/Authentication';
import { EntityRoutes } from 'routes/constants';

/** Pages */
import Home from 'UI/pages/Home';
import Sales from 'UI/pages/Sales';
import NewSale from 'UI/pages/NewSale';
import Inventory from 'UI/pages/Inventory';
import Transfers from 'UI/pages/Transfers';
import Payments from 'UI/pages/Payments';
import ProductNames from 'UI/pages/ProductNames';
import ProductTypes from 'UI/pages/ProductTypes';

import Products from 'UI/pages/Products';

import Login from 'UI/pages/Login';
import RegisterUser from 'UI/pages/RegisterUser';

import ErrorPage from 'UI/pages/ErrorPage';

import Notifier from 'UI/components/molecules/Notifier';
// import { FeatureFlags } from 'UI/constants/featureFlags';
// import { getFeatureFlags } from 'UI/utils';
import {
  userHasAdminPermissions,
  userHasAdminOrManagerPermissions
} from 'services/Authorization';

// const featureFlags = getFeatureFlags();

const Routes = () => {
  const [isUserAdmin, setIsUserAdmin] = React.useState(false);
  const [isUserManagerOrAdmin, setIsUserManagerOrAdmin] = React.useState(false);

  React.useEffect(() => {
    setIsUserAdmin(userHasAdminPermissions());
    setIsUserManagerOrAdmin(userHasAdminOrManagerPermissions());
  }, []);

  return (
    <Router>
      <Notifier />
      <Switch>
        <Route
          exact
          path="/"
          render={() => <Redirect to={EntityRoutes.Home} />}
        />
        <Route
          exact
          path={EntityRoutes.Login}
          render={() =>
            isAuthenticated() ? <Redirect to={EntityRoutes.Home} /> : <Login />
          }
        />

        <PrivateRoute
          exact
          path={EntityRoutes.RegisterUser}
          component={RegisterUser}
          enabled={isUserAdmin}
        />
        <PrivateRoute
          exact
          path={EntityRoutes.ProductNames}
          component={ProductNames}
          enabled={isUserManagerOrAdmin}
        />

        <PrivateRoute
          exact
          path={EntityRoutes.Products}
          component={Products}
          enabled={isUserManagerOrAdmin} // TODO: review if they regular employees should be able to see the whole list of products
        />

        <PrivateRoute exact path={EntityRoutes.Home} component={Home} />
        <PrivateRoute exact path={EntityRoutes.Sales} component={Sales} />
        <PrivateRoute exact path={EntityRoutes.NewSale} component={NewSale} />
        <PrivateRoute
          exact
          path={EntityRoutes.Inventory}
          component={Inventory}
        />
        <PrivateRoute exact path={EntityRoutes.Payments} component={Payments} />

        <PrivateRoute
          exact
          path={EntityRoutes.Transfers}
          component={Transfers}
          enabled={isUserManagerOrAdmin}
        />
        <PrivateRoute
          exact
          path={EntityRoutes.ProductTypes}
          component={ProductTypes}
          enabled={isUserManagerOrAdmin}
        />

        <PrivateRoute path="*" component={() => <ErrorPage error={404} />} />
      </Switch>
    </Router>
  );
};

export default Routes;
