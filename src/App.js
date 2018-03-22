import React, {Component} from 'react';

import BuidlContract from '../build/contracts/Buidl.json';
import contract from 'truffle-contract';
const Buidl = contract(BuidlContract);
import getWeb3 from './utils/getWeb3';

import {frontEndModule} from './frontEndModule.js';
frontEndModule();

import {Button, Form} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleLoginFormChange = this.handleLoginFormChange.bind(this);
    this.handleLoginFormSubmit = this.handleLoginFormSubmit.bind(this);
    this.handleLoginFormFocus = this.handleLoginFormFocus.bind(this);
    this.handleLoginFormBlur = this.handleLoginFormBlur.bind(this);

    this.state = {
      numberOfAgreements: null,
      userAccount: '',
      web3: null,
      response: '',
      loginFormState: {
        emailAddress: '',
        nickname: '',
      },
    };
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        this.setState(
          {
            web3: results.web3,
          },
          () => {
            Buidl.setProvider(this.state.web3.currentProvider);
            this.getUserAddress();
            this.getNumberOfAgreements();
          },
        );
      })
      .catch(() => {
        console.log('Error finding web3.');
      });
  }

  componentDidMount() {
    this.getData('hello')
      .then(res => this.setState({response: res.express}))
      .catch(err => console.log(err));
  }

  getData = async path => {
    const response = await fetch('/api/' + path, {
      mode: 'cors',
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  postData = async (path, data) => {
    var strData = JSON.stringify(data);
    console.log('postData', path, strData);
    let testO = {
      'rest': 'test',
    }
    const response = await fetch('/api/' + path, {
      method: 'post',
      mode: 'cors',
      // body: JSON.stringify(data),
      body: testO,
    });

    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  getUserAddress() {
    const {web3} = this.state;
    web3.eth.getAccounts((error, accounts) => {
      Buidl.defaults({
        from: accounts[0],
        gas: 3000000,
      });
      return this.setState({
        userAccount: accounts[0],
      });
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

  handleLoginFormChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState(prevState => ({
      ...prevState,
      loginFormState: {
        ...prevState.loginFormState,
        [name]: value,
      },
    }));
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

  handleLoginFormSubmit(e) {
    const {userAccount, loginFormState: {emailAddress, nickname}} = this.state;

    const loginDetails = {
      nickname,
      emailAddress,
      address: userAccount,
    };

    e.preventDefault();

    if (!this.showFormErrors()) {
      console.log('Form is invalid: do not submit');
    } else {
      console.log('Form is valid: submit');
    }

    // console.log('Login details:', JSON.stringify(loginDetails));

    var userDetails = {
      address: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
      email: 'example@buidl.today',
      nickname: 'Pedro',
    };
    this.postData('insertuser', loginDetails);
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

  render() {
    console.log(this.state);

    const {userAccount, loginFormState: {emailAddress, nickname}} = this.state;

    const emailRegex = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}';

    const loginForm = (
      <Form className="login-form" onSubmit={this.handleLoginFormSubmit}>
        <h2 className="login--heading">Welcome to Buidl.Today</h2>
        <p>{this.state.response}</p>
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
    return (
      <div className="App">
        <div className="container">{loginForm}</div>
      </div>
    );
  }
}

export default App;
