import React, {Component} from 'react';
import {connect} from 'react-redux';

import RedButton from '../components/RedButton.js';
import Navbar from '../components/Navbar.js';

import './Error.css';

export class ErrorContainer extends Component {
  render() {
    const {history} = this.props;
    return (
      <div className="error-container">
        <Navbar history={history} />
        <div className="container">
          <h1>Ooooops...</h1>
          <p>Something went wrong...</p>
          <div className="go-back--wrapper">
            <RedButton onClick={() => history.push('/')} text={'Home'} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    mappedState: state,
  };
}

export default connect(mapStateToProps)(ErrorContainer);
