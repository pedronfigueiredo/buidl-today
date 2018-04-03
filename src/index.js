import ReactDOM from 'react-dom';
import React, { Component}  from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import rootReducer from './redux';
import login from './redux';
import App from './components/App';
import {composeWithDevTools} from 'redux-devtools-extension';

const store = createStore(rootReducer, composeWithDevTools());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
