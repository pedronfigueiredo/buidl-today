import ReactDOM from 'react-dom';
import React from 'react';
import Welcome from './containers/Welcome';
import Login from './containers/Login';
import PledgesList from './containers/PledgesList';
import NewPledge from './containers/NewPledge';
import About from './containers/About';
import My404 from './containers/My404';

import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';

import {Provider} from 'react-redux';
import {createStore} from 'redux';
import rootReducer from './redux';
import {composeWithDevTools} from 'redux-devtools-extension';
const store = createStore(rootReducer, composeWithDevTools());

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Welcome} />
        <Route path="/login" exact component={Login} />
        <PrivateRoute path="/home" exact component={PledgesList} />
        <PrivateRoute path="/new" exact component={NewPledge} />
        <Route path="/about" exact component={About} />
        <Route path="/404" exact component={My404} />
        <Redirect from="*" to="/404" />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
