import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NewPledgeForm} from '../components/NewPledgeForm';
import {
  updateETHRate,
  updateETHRateInUSD,
  updatePledgeForm,
  clearPledgeForm,
  requestSubmitPledge,
  errorSubmitPledge,
  successSubmitPledge,
} from '../redux/pledges';

import api from '../utils/api.js';

import './NewPledge.css';

export class NewPledge extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handlePledgeFormChange = this.handlePledgeFormChange.bind(this);
    this.handlePledgeFormSubmit = this.handlePledgeFormSubmit.bind(this);
    this.handlePledgeFormFocus = this.handlePledgeFormFocus.bind(this);
    this.handlePledgeFormBlur = this.handlePledgeFormBlur.bind(this);
  }

  componentWillMount() {
    const {userAccount, isAuthenticated} = this.props;
    if (!userAccount || !isAuthenticated) {
      this.props.history.push('/');
    }
  }

  componentDidMount() {
    this.updateEthereumPrice();
  }

  updateEthereumPrice() {
    const {dispatch} = this.props;
    fetch('https://api.coinmarketcap.com/v1/ticker/ethereum/')
      .then(res => res.json())
      .then(json => dispatch(updateETHRate(json[0].price_usd)));
  }

  handleBackButton() {
    this.clearPledgeForm();
    this.props.history.push('/home');
  }

  handlePledgeFormChange(e) {
    const {dispatch, ethRate} = this.props;
    const {name, value} = e.target;
    dispatch(updatePledgeForm(name, value));
    if (name === 'stake') {
      const product = Number(value) * Number(ethRate);
      dispatch(updateETHRateInUSD(product));
    }
  }

  handlePledgeFormFocus(e) {
    e.target.classList.add('active');
    this.hideInputError(e.target);
  }

  handlePledgeFormBlur(e) {
    e.target.classList.remove('active');
    e.target.classList.add('blurred');
    this.showInputError(e.target);
  }

  handlePledgeFormSubmit(e) {
    const {
      dispatch,
      userAccount,
      emailAddress,
      nickname,
      pledgeFormState,
    } = this.props;
    // Call the blockchain with money check if it was successfull
    const newPledgeDetails = {
      ...pledgeFormState,
      nickname,
      emailAddress,
      address: userAccount,
      // tx, // Transaction id from blockchain
      // txTimestamp, // Transaction timestamp from blockchain
    };
    dispatch(requestSubmitPledge());
    const newPledge = api.post('insertpledge', newPledgeDetails);
    if (newPledge[0] === 'error') {
      dispatch(errorSubmitPledge());
      this.clearPledgeForm();
      this.props.history.push('/error');
    } else {
      dispatch(successSubmitPledge(newPledgeDetails));
      this.clearPledgeForm();
      this.props.history.push('/home');
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

  clearPledgeForm() {
    const {dispatch} = this.props;
    dispatch(clearPledgeForm());
  }

  render() {
    const {
      nickname,
      ethRate,
      ethRateInUSD,
      submittingPledge,
      pledgeFormState,
    } = this.props;

    const Navbar = () => (
      <div className="nav-bar">
        <div className="heading" onClick={this.goHome}>
          Buidl.Today
        </div>
        <div className="username">{nickname}</div>
      </div>
    );

    const BackButton = () => (
      <div className="back-button-wrapper">
        <div className="back-button" onClick={this.handleBackButton}>
          <span className="icon-left-1" />
        </div>
      </div>
    );

    return (
      <div className="new-pledge-component">
        <Navbar />
        <div className="container new-pledge-container">
          <BackButton />
          <NewPledgeForm
            ethRate={ethRate}
            ethRateInUSD={ethRateInUSD}
            submittingPledge={submittingPledge}
            pledgeFormState={pledgeFormState}
            handlePledgeFormChange={this.handlePledgeFormChange}
            handlePledgeFormSubmit={this.handlePledgeFormSubmit}
            handlePledgeFormFocus={this.handlePledgeFormFocus}
            handlePledgeFormBlur={this.handlePledgeFormBlur}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ethRate: state.pledges.ethRate,
    ethRateInUSD: state.pledges.ethRateInUSD,
    submittingPledge: state.pledges.submittingPledge,
    pledgeFormState: state.pledges.pledgeFormState,
    userAccount: state.registration.userAccount,
    nickname:
      state.registration.registrationFormState &&
      state.registration.registrationFormState.nickname,
    emailAddress:
      state.registration.registrationFormState &&
      state.registration.registrationFormState.emailAddress,
    isAuthenticated: state.registration.isAuthenticated,
  };
}

export default connect(mapStateToProps)(NewPledge);
