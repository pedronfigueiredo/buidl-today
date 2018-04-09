import React, {Component} from 'react';
import LoginForm from '../components/LoginForm.js';

import {connect} from 'react-redux';
import {authenticate, updateLoginForm, clearLoginForm} from '../redux/login.js';

import api from '../utils/api.js';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLoginFormChange = this.handleLoginFormChange.bind(this);
    this.handleLoginFormSubmit = this.handleLoginFormSubmit.bind(this);
    this.handleLoginFormFocus = this.handleLoginFormFocus.bind(this);
    this.handleLoginFormBlur = this.handleLoginFormBlur.bind(this);
  }

  componentWillMount() {
    const {userAccount, isAuthenticated} = this.props;
    if (!userAccount) {
      this.props.history.push('/');
    }
    if (userAccount && isAuthenticated) {
      this.props.history.push('/home');
    }
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
    const {from} = this.props.location.state || {from: '/'};
    const {
      dispatch,
      userAccount,
      loginFormState: {emailAddress, nickname},
    } = this.props;
    const loginDetails = {
      nickname,
      emailAddress,
      address: userAccount,
    };
    e.preventDefault();
    const user = await api.post('insertuser', loginDetails);
    if (user) {
      dispatch(authenticate);
      this.clearLoginForm();
      this.props.history.push(from);
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
    isAuthenticated: state.login.isAuthenticated,
    loginFormState: state.login.loginFormState,
  };
}

export default connect(mapStateToProps)(Login);
