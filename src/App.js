import React, {Component} from 'react';

import BuidlContract from './contracts/Buidl.json';
import contract from 'truffle-contract';
import getWeb3 from './utils/getWeb3';
import {frontEndModule} from './frontEndModule.js';

import {Button, Form} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

const Buidl = contract(BuidlContract);
frontEndModule();

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
      helloworld: '',
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
      .then(res => this.setState({helloworld: res.express}))
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

  async handleLoginFormSubmit(e) {
    const {userAccount, loginFormState: {emailAddress, nickname}} = this.state;

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
    const inputFields = document.getElementsByTagName('INPUT');
    inputFields[1].classList.remove('active');
    inputFields[1].classList.remove('blurred');
    this.hideInputError(inputFields[1]);
    inputFields[2].classList.remove('active');
    inputFields[2].classList.remove('blurred');
    this.hideInputError(inputFields[2]);

    this.setState({
      loginFormState: {
        emailAddress: '',
        nickname: '',
      },
    });
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
    const {userAccount, loginFormState: {emailAddress, nickname}} = this.state;

    const emailRegex = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}';

    const loginForm = (
      <Form className="login-form" onSubmit={this.handleLoginFormSubmit}>
        <h2 className="login--heading">Welcome to Buidl.Today</h2>
        <p>{this.state.helloworld}</p>
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
