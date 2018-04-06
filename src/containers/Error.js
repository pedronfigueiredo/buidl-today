import React, {Component} from 'react';
import {connect} from 'react-redux';

import LinkButton from '../components/LinkButton';
import './Error.css';

export class ErrorContainer extends Component {
  render() {
    return (
      <div className="error-container">
        <div className="container">
          <h1>Error</h1>
          <p>Oooops... Something went wrong...</p>
          <LinkButton to="/">Back</LinkButton>
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
