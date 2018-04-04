import React, {Component} from 'react';

import {Button, Form, Segment, Dimmer, Loader} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {connect} from 'react-redux';
import {
  clearLoginForm,
  updateLoginForm,
  userIsNew,
  userFoundInDb,
} from '../redux/login.js';

export class LoginFormComponent extends Component {
  constructor(props) {
    super(props);

    this.handleLoginFormChange = this.handleLoginFormChange.bind(this);
    this.handleLoginFormSubmit = this.handleLoginFormSubmit.bind(this);
    this.handleLoginFormFocus = this.handleLoginFormFocus.bind(this);
    this.handleLoginFormBlur = this.handleLoginFormBlur.bind(this);
  }

  componentDidMount() {
    // Wait for ethereum address from props
    setTimeout(() => {
      this.checkIfUserExists();
    }, 2000);
  }

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

  checkIfUserExists() {
    const {userAccount, dispatch} = this.props;
    //this.getData('userexists/' + 'randomaddressthatdoesntexist')
    this.getData('userexists/' + userAccount)
      .then(res => {
        if (res === 'User not found') {
          dispatch(userIsNew());
        } else if (res === 'error') {
          console.log('API Call error');
          // error screen
        } else {
          dispatch(userFoundInDb(res));
        }
      })
      .catch(err => console.log(err));
  }

  async handleLoginFormSubmit(e) {
    const {userAccount, loginFormState: {emailAddress, nickname}} = this.props;

    const loginDetails = {
      nickname,
      emailAddress,
      address: userAccount,
    };

    e.preventDefault();

    const user = await this.postData('insertuser', loginDetails);
    if (user) {
      this.clearLoginForm();
      console.log(user.nickname + ' was added to the database');
    }
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
      userAccount,
      isLoading,
      loginFormState: {emailAddress, nickname},
    } = this.props;

    const emailRegex = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}';

    const loginForm = (
      <Form className="login-form" onSubmit={this.handleLoginFormSubmit}>
        <h2 className="login--heading">Welcome to Buidl.Today</h2>
        <p className="login--description">
          To get started, please enter your email address and a nickname.
        </p>
        <Form.Field>
          <label id="walletAddressLabel">Wallet address</label>
          <input
            type="text"
            name="walletAddress"
            value={userAccount}
            disabled
          />
          <p className="form-error" id="walletAddressError" />
        </Form.Field>
        <Form.Field>
          <label id="emailAddressLabel">Email address</label>
          <input
            type="text"
            name="emailAddress"
            placeholder="example@buidl.today"
            value={emailAddress}
            pattern={emailRegex}
            onChange={this.handleLoginFormChange}
            onFocus={this.handleLoginFormFocus}
            onBlur={this.handleLoginFormBlur}
            required
          />
          <p className="form-error" id="emailAddressError" />
        </Form.Field>
        <Form.Field>
          <label id="nicknameLabel">Nickname</label>
          <input
            type="text"
            name="nickname"
            placeholder="Pedro"
            value={nickname}
            onChange={this.handleLoginFormChange}
            onFocus={this.handleLoginFormFocus}
            onBlur={this.handleLoginFormBlur}
            required
          />
          <p className="form-error" id="nicknameError" />
        </Form.Field>
        <Button type="submit">Save account info</Button>
      </Form>
    );

    const loader = (
      <Segment style={{height: '100vh', border: 'none', boxShadow: 'none'}}>
        <Dimmer inverted active>
          <Loader>Loading</Loader>
        </Dimmer>
      </Segment>
    );

    return <div>{isLoading ? loader : loginForm}</div>;
  }
}

export default connect()(LoginFormComponent);
