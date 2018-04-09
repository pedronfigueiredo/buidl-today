import React, {Component} from 'react';
import {connect} from 'react-redux';

import LinkButton from '../components/LinkButton';
import './NewPledge.css';

export class NewPledge extends Component {
  componentWillMount() {
    const {userAccount, isAuthenticated} = this.props;
    if (!userAccount || !isAuthenticated) {
      this.props.history.push('/');
    }
  }

  render() {
    return (
      <div className="new-pledge-container">
        <div className="container">
          <h1>New Pledge</h1>
          <label>Field 1</label>
          <input />
          <br />
          <label>Field 2</label>
          <input />
          <br />
          <label>Field 3</label>
          <input />
        </div>
        <LinkButton to={'/home'}>Back</LinkButton>
        <LinkButton to={'/home'} onClick={() => console.warn('Submit')}>
          Submit
        </LinkButton>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userAccount: state.login.userAccount,
    isAuthenticated: state.login.isAuthenticated,
  };
}

export default connect(mapStateToProps)(NewPledge);
