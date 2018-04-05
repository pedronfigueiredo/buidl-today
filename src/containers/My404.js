import React, {Component} from 'react';
import {connect} from 'react-redux';

import LinkButton from '../components/LinkButton';
import './My404.css';

export class My404 extends Component {
  render() {
    return (
      <div className="404-container">
        <div className="container">
          <h1>404</h1>
          <p>Oooops... PAGE NOT FOUND!</p>
          <LinkButton to="/">Push My Buttons!</LinkButton>
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

export default connect(mapStateToProps)(My404);
