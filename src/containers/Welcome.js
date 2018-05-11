import React, {Component} from 'react';
import {connect} from 'react-redux';

import LinkButton from '../components/LinkButton';
import MetaMaskInstructions from '../components/MetaMaskInstructions';
import MetaMaskLocked from '../components/MetaMaskLocked';
import './Welcome.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/css/fontello.css';

import {
  checkIfUserExists,
  identifiedNewUser,
  identifiedReturningUser,
  checkIfUserExistsError,
} from '../redux/registration.js';

import {
  getAllPledgesFromUser,
  getAllPledgesFromUserEmpty,
  getAllPledgesFromUserError,
  getAllPledgesFromUserSuccess,
} from '../redux/pledges.js';

import api from '../utils/api.js';
import blockchain from '../utils/blockchain.js';

let host = window.location.host;
let env;
if (host === 'localhost:3000') {
  env = 'dev';
} else {
  env = 'prod';
}

export class Welcome extends Component {
  constructor(props) {
    super(props);
    blockchain.getWeb(this.props.dispatch);
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch, web3, userAccount} = this.props;
    if (nextProps.web3 !== web3 && nextProps.web3 !== '') {
      blockchain.setProvider(nextProps.web3);
      blockchain.getUserAddress(nextProps.web3, dispatch);
    }
    if (nextProps.userAccount !== userAccount && nextProps.userAccount) {
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
          this.getAllPledgesFromUser(userAccount);
        }
      })
      .catch(err => {
        console.error('err', err);
        this.props.history.push('/error');
      });
  }

  getAllPledgesFromUser(address) {
    const {dispatch} = this.props;
    dispatch(getAllPledgesFromUser());
    api
      .get('pledgesfromuser/' + address)
      .then(res => {
        if (res === 'No pledges found') {
          dispatch(getAllPledgesFromUserEmpty());
        } else if (res === 'error') {
          dispatch(getAllPledgesFromUserError());
          this.props.history.push('/error');
        } else {
          dispatch(getAllPledgesFromUserSuccess(res));
        }
      })
      .catch(err => {
        this.props.history.push('/error');
      });
  }

  render() {
    const {
      web3,
      web3Loaded,
      userAccount,
      dispatch,
      metaMaskWasRecognized,
    } = this.props;

    this.account = web3 && web3.eth.accounts[0];
    var self = this;
    this.accountInterval = setInterval(function() {
      if (web3 && web3.eth.accounts[0] !== self.account) {
        blockchain.getUserAddress(web3, dispatch);
      }
    }, 2 * 1000);

    const ButtonsGroup = () => (
      <div className="buttons-group">
        <LinkButton to="/home" className="get-started">
          Get started!
        </LinkButton>
        {/*
              <LinkButton to="/about" className="learn-more">
                Learn more about the science
              </LinkButton>
              */}
      </div>
    );

    let MetaMaskNotice = () => {
      if (!web3Loaded) {
        return null;
      }
      if (!!userAccount) {
        return <ButtonsGroup />;
      }
      if (!!metaMaskWasRecognized) {
        return <MetaMaskLocked />;
      }
      return <MetaMaskInstructions />;
    };

    let WelcomeContainer = () => (
      <div className="welcome-container">
        <div className="hero-card">
          <h1 className="heading">Buidl.Today</h1>
          <p className="slogan">Ship your work</p>
        </div>
        <div className="call-to-action-card">
          <div className="container">
            <div className="feature-list row">
              <div className="feature col-md-6">
                <p className="icon">
                  <span className="icon-beaker" />
                </p>
                <p className="description">
                  Social science shows that you are 3x more averse to losses
                  than earnings.
                </p>
              </div>
              <div className="feature col-md-6">
                <p className="icon">
                  <span className="icon-link" />
                </p>
                <p className="description">
                  Leverage blockchain technology to enforce your accountability.
                </p>
              </div>
            </div>

            <MetaMaskNotice />
          </div>
        </div>
      </div>
    );

    return <WelcomeContainer />;
  }
}

function mapStateToProps(state) {
  return {
    userAccount: state.registration.user.userAccount,
    web3: state.registration.web3,
    web3Loaded: state.registration.web3Loaded,
    metaMaskWasRecognized: state.registration.metaMaskWasRecognized,
  };
}

export default connect(mapStateToProps)(Welcome);
