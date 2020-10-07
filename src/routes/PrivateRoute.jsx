import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { isAuthenticated } from 'services/Authentication';
import MainLayout from 'routes/MainLayout';
import ErrorPage from 'UI/pages/ErrorPage';
import { EntityRoutes } from 'routes/constants';

const PrivateRoute = ({ component: Component, enabled = true, ...rest }) => {
  localStorage.setItem('redirectPage', window.location.pathname + window.location.search);

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() ? (
          <MainLayout>{enabled ? <Component {...props} /> : <ErrorPage error={404} />}</MainLayout>
        ) : (
          <Redirect to={EntityRoutes.Login} />
        )
      }
    />
  );
};

export default PrivateRoute;
