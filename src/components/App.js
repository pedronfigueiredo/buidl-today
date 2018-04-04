import React, {Component} from 'react';

import BuidlContract from '../contracts/Buidl.json';
import contract from 'truffle-contract';
import getWeb3 from '../utils/getWeb3';

import LoginFormComponent from '../containers/LoginForm.js';

import {connect} from 'react-redux';
import {storeWeb3, storeUserAccount} from '../redux/login.js';

import '../css/oswald.css';
import '../css/open-sans.css';
import '../css/pure-min.css';
import './App.css';

const Buidl = contract(BuidlContract);

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      numberOfAgreements: null,
    };
  }

  componentWillMount() {
    let {dispatch} = this.props;

    getWeb3.then(results => {
      this.setState(
        {
          web3: results.web3,
        },
        () => {
          dispatch(storeWeb3(results.web3));
        },
      );
    });
  }

  componentWillReceiveProps(nextProps) {
    const {web3} = nextProps;
    Buidl.setProvider(web3.currentProvider);
    this.getUserAddress();
    this.getNumberOfAgreements();
  }

  getUserAddress() {
    const {web3} = this.state;
    const {dispatch} = this.props;
    web3.eth.getAccounts((error, accounts) => {
      Buidl.defaults({
        from: accounts[0],
        gas: 3000000,
      });
      dispatch(storeUserAccount(accounts[0]));
    });
  }

  getNumberOfAgreements() {
    Buidl.deployed()
      .then(instance => instance.getNumberOfAgreements())
      .then(result => {
        this.setState({
          numberOfAgreements: result.c[0],
        });
      });
  }

  render() {
    const {isLoading, userAccount, loginFormState, web3} = this.props;
    return (
      <div className="App">
        <div className="container">
          <LoginFormComponent
            web3={web3}
            numberOfAgreements={this.state.numberOfAgreements}
            userAccount={userAccount}
            isLoading={isLoading}
            loginFormState={loginFormState}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    web3: state.login.web3,
    userAccount: state.login.userAccount,
    isLoading: state.login.isLoading,
    loginFormState: state.login.loginFormState,
  };
}

export default connect(mapStateToProps)(App);
