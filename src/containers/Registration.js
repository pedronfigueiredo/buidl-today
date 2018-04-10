import React, {Component} from 'react';
import RegistrationForm from '../components/RegistrationForm.js';

import {connect} from 'react-redux';
import {
  authenticate,
  updateRegistrationForm,
  clearRegistrationForm,
  errorRegisteringUser,
  requestRegisterUser,
} from '../redux/registration.js';

import api from '../utils/api.js';

export class Registration extends Component {
  constructor(props) {
    super(props);
    this.handleRegistrationFormChange = this.handleRegistrationFormChange.bind(
      this,
    );
    this.handleRegistrationFormSubmit = this.handleRegistrationFormSubmit.bind(
      this,
    );
    this.handleRegistrationFormFocus = this.handleRegistrationFormFocus.bind(
      this,
    );
    this.handleRegistrationFormBlur = this.handleRegistrationFormBlur.bind(
      this,
    );
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

  handleRegistrationFormChange(e) {
    const {dispatch} = this.props;
    const {name, value} = e.target;
    dispatch(updateRegistrationForm(name, value));
  }

  handleRegistrationFormFocus(e) {
    e.target.classList.add('active');
    this.hideInputError(e.target);
  }

  handleRegistrationFormBlur(e) {
    e.target.classList.remove('active');
    e.target.classList.add('blurred');
    this.showInputError(e.target);
  }

  async handleRegistrationFormSubmit(e) {
    const {from} = this.props.location.state || {from: '/'};
    const {dispatch, userAccount, emailAddress, nickname} = this.props;
    const loginDetails = {
      nickname,
      emailAddress,
      address: userAccount,
    };
    e.preventDefault();

    dispatch(requestRegisterUser());
    const user = await api.post('insertuser', loginDetails);

    if (user[0] === 'error') {
      dispatch(errorRegisteringUser());
      this.clearRegistrationForm();
      this.props.history.push('/error');
    } else {
      dispatch(authenticate);
      this.clearRegistrationForm();
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

  clearRegistrationForm() {
    const {dispatch} = this.props;
    const inputFields = document.getElementsByTagName('INPUT');
    inputFields[1].classList.remove('active');
    inputFields[1].classList.remove('blurred');
    this.hideInputError(inputFields[1]);
    inputFields[2].classList.remove('active');
    inputFields[2].classList.remove('blurred');
    this.hideInputError(inputFields[2]);
    dispatch(clearRegistrationForm());
  }

  render() {
    const {registering, userAccount, nickname, emailAddress} = this.props;
    return (
      <div className="login-container">
        <div className="container">
          <RegistrationForm
            registering={registering}
            userAccount={userAccount}
            nickname={nickname}
            emailAddress={emailAddress}
            handleRegistrationFormChange={this.handleRegistrationFormChange}
            handleRegistrationFormSubmit={this.handleRegistrationFormSubmit}
            handleRegistrationFormFocus={this.handleRegistrationFormFocus}
            handleRegistrationFormBlur={this.handleRegistrationFormBlur}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    web3: state.registration.web3,
    registering: state.registration.registering,
    userAccount: state.registration.userAccount,
    nickname:
      state.registration.loginFormState &&
      state.registration.loginFormState.nickname,
    emailAddress:
      state.registration.loginFormState &&
      state.registration.loginFormState.emailAddress,
    isAuthenticated: state.registration.isAuthenticated,
  };
}

export default connect(mapStateToProps)(Registration);
