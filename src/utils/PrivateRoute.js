import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import auth from './auth.js';

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: {from: props.location},
          }}
        />
      )
    }
  />
);

export default PrivateRoute;
