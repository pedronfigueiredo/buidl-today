import React, {Component} from 'react';
import {connect} from 'react-redux';

import LinkButton from '../components/LinkButton';
import './Welcome.css';

import {
  checkIfUserExists,
  identifiedNewUser,
  identifiedReturningUser,
  checkIfUserExistsError,
} from '../redux/login.js';

import api from '../utils/api.js';
import blockchain from '../utils/blockchain.js';

export class Welcome extends Component {
  constructor(props) {
    super(props);
    blockchain.getWeb3(this.props.dispatch);
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch, web3, userAccount} = this.props;
    if (nextProps.web3 !== web3) {
      blockchain.setProvider(nextProps.web3);
      blockchain.getUserAddress(nextProps.web3, dispatch);
    }
    if (nextProps.userAccount !== userAccount) {
      this.checkIfUserExists(nextProps.userAccount);
    }
  }

  checkIfUserExists(userAccount) {
    const {dispatch} = this.props;
    dispatch(checkIfUserExists());
    api
      .get('userexists/' + userAccount)
      .then(res => {
        if (res === 'User not found') {
          dispatch(identifiedNewUser());
        } else if (res === 'error') {
          dispatch(checkIfUserExistsError());
          this.props.history.push('/error');
        } else {
          dispatch(identifiedReturningUser(res));
        }
      })
      .catch(err => {
        this.props.history.push('/error');
      });
  }

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
    userAccount: state.login.userAccount,
    web3: state.login.web3,
  };
}

export default connect(mapStateToProps)(Welcome);
