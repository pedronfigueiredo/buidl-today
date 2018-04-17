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
import keccak256 from 'js-sha3';

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

  /**
   * Checks if the given string is an address
   *
   * @method isAddress
   * @param {String} address the given HEX adress
   * @return {Boolean}
   */
  isAddress(address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      // check if it has the basic requirements of an address
      return false;
    } else if (
      /^(0x)?[0-9a-f]{40}$/.test(address) ||
      /^(0x)?[0-9A-F]{40}$/.test(address)
    ) {
      // If it's all small caps or all all caps, return true
      return true;
    } else {
      // Otherwise check each case
      return this.isChecksumAddress(address);
    }
  }

  /**
   * Checks if the given string is a checksummed address
   *
   * @method isChecksumAddress
   * @param {String} address the given HEX adress
   * @return {Boolean}
   */
  isChecksumAddress(address) {
    // Check each case
    address = address.replace('0x', '');
    var addressHash = keccak256(address.toLowerCase());
    for (var i = 0; i < 40; i++) {
      // the nth letter should be uppercase if the nth digit of casemap is 1
      if (
        (parseInt(addressHash[i], 16) > 7 &&
          address[i].toUpperCase() !== address[i]) ||
        (parseInt(addressHash[i], 16) <= 7 &&
          address[i].toLowerCase() !== address[i])
      ) {
        return false;
      }
    }
  }

  showInputError(input) {
    const name = input.name;
    const validity = input.validity;
    const label = document.getElementById(`${name}Label`).textContent;
    const error = document.getElementById(`${name}Error`);

    if (name === 'recipient' || name === 'referee') {
      const addressIsValid = this.isAddress(input.value);
      if (!addressIsValid) {
        input.setCustomValidity('Not valid');
        error.textContent = `${label} is not a valid Ethereum address`;
        return true;
      }
    }

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
    input.setCustomValidity('');
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
    userAccount: state.registration.user.userAccount,
    nickname: state.registration.user.nickname,
    emailAddress: state.registration.user.emailAddress,
    isAuthenticated: state.registration.isAuthenticated,
  };
}

export default connect(mapStateToProps)(NewPledge);
