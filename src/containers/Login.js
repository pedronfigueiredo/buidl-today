import React, {Component} from 'react';
import LoginForm from '../components/LoginForm.js';

import {connect} from 'react-redux';
import {
  updateLoginForm,
  clearLoginForm,
  userIsNew,
  userFoundInDb,
} from '../redux/login.js';

import auth from '../utils/auth.js';
import api from '../utils/api.js';
import blockchain from '../utils/blockchain.js';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLoginFormChange = this.handleLoginFormChange.bind(this);
    this.handleLoginFormSubmit = this.handleLoginFormSubmit.bind(this);
    this.handleLoginFormFocus = this.handleLoginFormFocus.bind(this);
    this.handleLoginFormBlur = this.handleLoginFormBlur.bind(this);
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
    api
      .get('userexists/' + userAccount)
      .then(res => {
        if (res === 'User not found') {
          dispatch(userIsNew());
        } else if (res === 'error') {
          this.props.history.push('/error');
        } else {
          dispatch(userFoundInDb(res));
        }
      })
      .catch(err => {
        this.props.history.push('/error');
      });
  }

  handleLoginFormChange(e) {
    const {dispatch} = this.props;
    const {name, value} = e.target;
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
    const {userAccount, loginFormState: {emailAddress, nickname}} = this.props;
    const {from} = this.props.location.state || {from: '/'};
    const loginDetails = {
      nickname,
      emailAddress,
      address: userAccount,
    };
    e.preventDefault();
    const user = await api.post('insertuser', loginDetails);
    if (user) {
      this.clearLoginForm();
      auth.authenticate(() => {
        this.props.history.push(from);
      });
    }
  }

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
    const {isLoading, userAccount, loginFormState} = this.props;
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
