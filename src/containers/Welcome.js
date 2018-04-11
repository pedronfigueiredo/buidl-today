import React, {Component} from 'react';
import {connect} from 'react-redux';

import LinkButton from '../components/LinkButton';
import './Welcome.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/css/fontello.css';

import {
  checkIfUserExists,
  identifiedNewUser,
  identifiedReturningUser,
  checkIfUserExistsError,
} from '../redux/registration.js';

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
        <div className="hero-card">
          <h1 className="heading">Buidl.Today</h1>
          <p className="slogan">
            Ship your work
          </p>
        </div>
        <div className="call-to-action-card">
          <div className="container">
            <div className="feature-list row">
              <div className="feature col-md-6">
                <p className="icon">
                  <span className="icon-beaker" />
                </p>
                <p className="description">
                  Social science shows that you are 3x more averse to losses than earnings.
                </p>
              </div>
              <div className="feature col-md-6">
                <p className="icon">
                  <span className="icon-link" />
                </p>
                <p className="description">
                  Blockchain is one of the most probm of blockchain to make it happen.
                </p>
              </div>
            </div>
            <div className="buttons-group">
              <div className="get-started--wrapper">
                <LinkButton to="/home" className="get-started">
                  Get started!
                </LinkButton>
              </div>
              <LinkButton to="/about" className="learn-more">
                Learn more about the science
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userAccount: state.registration.userAccount,
    web3: state.registration.web3,
  };
}

export default connect(mapStateToProps)(Welcome);
