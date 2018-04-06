import React, {Component} from 'react';
import LoginForm from '../components/LoginForm.js';

import {connect} from 'react-redux';
import {
  updateLoginForm,
  storeWeb3,
  storeUserAccount,
  clearLoginForm,
  userIsNew,
  userFoundInDb,
} from '../redux/login.js';

import auth from '../utils/auth.js';

import BuidlContract from '../contracts/Buidl.json';
import contract from 'truffle-contract';
import getWeb3 from '../utils/getWeb3';
const Buidl = contract(BuidlContract);

export class Login extends Component {
  constructor(props) {
    super(props);

    this.handleLoginFormChange = this.handleLoginFormChange.bind(this);
    this.handleLoginFormSubmit = this.handleLoginFormSubmit.bind(this);
    this.handleLoginFormFocus = this.handleLoginFormFocus.bind(this);
    this.handleLoginFormBlur = this.handleLoginFormBlur.bind(this);

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

  componentDidMount() {
    // Wait for ethereum address from props
    setTimeout(() => {
      this.checkIfUserExists();
    }, 2000);
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

  checkIfUserExists() {
    const {userAccount, dispatch} = this.props;
    this.getData('userexists/' + userAccount)
      .then(res => {
        if (res === 'User not found') {
          dispatch(userIsNew());
        } else if (res === 'error') {
          console.err('API Call error');
          // error screen
        } else {
          dispatch(userFoundInDb(res));
        }
      })
      .catch(err => console.err(err));
  }

  // API Helper Methods
  getData = async path => {
    const response = await fetch('/api/' + path, {
      mode: 'no-cors',
    });

    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  postData = async (path, data) => {
    var strData = JSON.stringify(data);
    const response = await fetch('/api/' + path, {
      method: 'post',
      mode: 'cors',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: strData,
    });

    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  // FORM METHODS
  handleLoginFormChange(e) {
    const {dispatch} = this.props;
    const name = e.target.name;
    const value = e.target.value;

    dispatch(updateLoginForm(name, value));
  }

  handleLoginFormFocus(e) {
    e.target.classList.add('active');
    this.hideInputError(e.target);
  }

  handleLoginFormBlur(e) {
    e.target.classList.remove('active');
    e.target.classList.add('blurred');
    this.showInputError(e.target);
  }

  async handleLoginFormSubmit(e) {
    const {
      userAccount,
      loginFormState: {emailAddress, nickname},
    } = this.props;

    const {from} = this.props.location.state || {from: '/'};

    const loginDetails = {
      nickname,
      emailAddress,
      address: userAccount,
    };

    e.preventDefault();

    const user = await this.postData('insertuser', loginDetails);
    if (user) {
      this.clearLoginForm();
      auth.authenticate(() => {
        this.props.history.push(from);
      });
    }
  }

  // FORM HELPERS
  showInputError(input) {
    const name = input.name;
    const validity = input.validity;
    const label = document.getElementById(`${name}Label`).textContent;
    const error = document.getElementById(`${name}Error`);

    if (!validity.valid) {
      if (validity.valueMissing) {
        error.textContent = `${label} is a required field`;
      } else if (validity.patternMismatch) {
        error.textContent = `${label} should be a valid email address`;
      }
      return false;
    }

    error.textContent = '';
    return true;
  }

  hideInputError(input) {
    const name = input.name;
    const error = document.getElementById(`${name}Error`);
    error.textContent = '';
  }

  showFormErrors() {
    const inputs = document.querySelectorAll('input');
    let isFormValid = true;

    inputs.forEach(input => {
      input.classList.add('active');

      const isInputValid = this.showInputError(input);

      if (!isInputValid) {
        isFormValid = false;
      }
    });
    return isFormValid;
  }

  clearLoginForm() {
    const {dispatch} = this.props;
    const inputFields = document.getElementsByTagName('INPUT');
    inputFields[1].classList.remove('active');
    inputFields[1].classList.remove('blurred');
    this.hideInputError(inputFields[1]);
    inputFields[2].classList.remove('active');
    inputFields[2].classList.remove('blurred');
    this.hideInputError(inputFields[2]);
    dispatch(clearLoginForm());
  }

  render() {
    const {
      isLoading,
      userAccount,
      loginFormState,
    } = this.props;

    return (
      <div className="login-container">
        <div className="container">
          <LoginForm
            isLoading={isLoading}
            userAccount={userAccount}
            loginFormState={loginFormState}
            handleLoginFormChange={this.handleLoginFormChange}
            handleLoginFormSubmit={this.handleLoginFormSubmit}
            handleLoginFormFocus={this.handleLoginFormFocus}
            handleLoginFormBlur={this.handleLoginFormBlur}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    web3: state.login.web3,
    isLoading: state.login.isLoading,
    userAccount: state.login.userAccount,
    loginFormState: state.login.loginFormState,
  };
}

export default connect(mapStateToProps)(Login);
