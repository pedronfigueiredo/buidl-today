import React from 'react';
import LoaderScreen from '../components/LoaderScreen.js';

import {Route, Redirect} from 'react-router-dom';

import auth from './auth.js';
import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchedTheDatabase: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      auth.authenticate(() => console.log('Authenticated!'));
      this.setState({
        searchedTheDatabase: true,
      });
    }, 3000);
  }

  render() {
    const {searchedTheDatabase} = this.state;
    if (auth.isAuthenticated) return <Route {...this.props} />;
    if (!searchedTheDatabase) return <LoaderScreen />;
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: {from: this.props.location},
        }}
      />
    );
  }
}
