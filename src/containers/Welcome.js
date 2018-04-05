import React, {Component} from 'react';
import {connect} from 'react-redux';

import LinkButton from '../components/LinkButton';
import './Welcome.css';

export class Welcome extends Component {
  render() {
    return (
      <div className="welcome-container">
        <div className="container">
          <h1>Welcome</h1>
          <LinkButton to="/home">Get started!</LinkButton>
          <LinkButton to="/about">Learn more about the science</LinkButton>
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

export default connect(mapStateToProps)(Welcome);
