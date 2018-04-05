import React, {Component} from 'react';
import {connect} from 'react-redux';

import LinkButton from '../components/LinkButton';
import './PledgesList.css';

export class PledgesList extends Component {
  render() {
    return (
      <div className="pledges-list-container">
        <div className="container">
          <h1>Pledges</h1>
          <ul>
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
          </ul>
          <LinkButton to="/new">New Pledge!</LinkButton>
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

export default connect(mapStateToProps)(PledgesList);
