import React from 'react';
import LoaderScreen from '../components/LoaderScreen.js';

import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class PrivateRoute extends React.Component {
  render() {
    console.log('PrivateRoute', this.props);
    const {isAuthenticated, isCheckingIfUserExists} = this.props;
    if (isAuthenticated && !isCheckingIfUserExists)
      return <Route {...this.props} />;
    if (isCheckingIfUserExists) return <LoaderScreen />;
    return (
      <Redirect
        to={{
          pathname: '/register',
          state: {from: this.props.location},
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.registration.isAuthenticated,
    isCheckingIfUserExists: state.registration.isCheckingIfUserExists,
  };
}

export default connect(mapStateToProps)(PrivateRoute);
