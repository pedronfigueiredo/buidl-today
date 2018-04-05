import ReactDOM from 'react-dom';
import React from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import rootReducer from './redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

import App from './components/App';
import My404Component from './components/My404Component';

const store = createStore(rootReducer, composeWithDevTools());

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path='/404' exact component={My404Component} />
        <Redirect from='*' to='/404' />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
