import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NewPledgeForm} from '../components/NewPledgeForm';
import {
  updateETHRate,
  updatePledgeForm,
  clearPledgeForm,
  requestSubmitPledge,
  changeFormField,
} from '../redux/pledges';

import moment from 'moment';

import Navbar from '../components/Navbar.js';

import blockchain from '../utils/blockchain.js';
import {keccak256} from 'js-sha3';

import './NewPledge.css';

export class NewPledge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areFieldsValid: {
        description: false,
        deadline: false,
        stake: false,
        recipient: false,
        referee: false,
      },
    };
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handlePledgeFormChange = this.handlePledgeFormChange.bind(this);
    this.handlePledgeFormSubmit = this.handlePledgeFormSubmit.bind(this);
    this.handlePledgeFormFocus = this.handlePledgeFormFocus.bind(this);
    this.handlePledgeFormBlur = this.handlePledgeFormBlur.bind(this);
    this.populateField = this.populateField.bind(this);
  }

  componentWillMount() {
    const {userAccount, isAuthenticated} = this.props;
    if (!userAccount || !isAuthenticated) {
      this.props.history.push('/');
    }
  }

  componentDidMount() {
    this.getEthereumPrice();
  }

  getEthereumPrice() {
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
    const {dispatch} = this.props;
    const {name, value} = e.target;
    dispatch(updatePledgeForm(name, value));
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
      email,
      nickname,
      pledgeFormState,
      web3,
    } = this.props;
    // Call the blockchain with money check if it was successfull
    let now = moment();
    let agreementId = keccak256(String(now + 42));
    let deadline = moment(pledgeFormState.deadline, 'YYYY-MM-DD').format('X');
    const newPledgeDetails = {
      ...pledgeFormState,
      nickname,
      email,
      address: userAccount,
      agreementId,
      deadline,
      recipient: pledgeFormState.recipient.toLowerCase(),
      referee: pledgeFormState.referee.toLowerCase(),
    };
    dispatch(requestSubmitPledge(newPledgeDetails));
    blockchain.createAgreement(
      newPledgeDetails,
      web3,
      dispatch,
      this.props.history,
    );
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
    return true;
  }

  isDate(value) {
    const date = moment(value, 'YYYY-MM-DD');
    const isEqual = value === date.format('YYYY-MM-DD');
    const isValid = date.isValid();
    return isEqual && isValid;
  }

  isDateInTheFuture(value) {
    const date = moment(value, 'YYYY-MM-DD').format('X');
    let now = moment().format('X');
    const isFuture = date > now;
    return isFuture;
  }

  showInputError(input) {
    const name = input.name;
    const validity = input.validity;
    const label = document.getElementById(`${name}Label`).textContent;
    const error = document.getElementById(`${name}Error`);

    if (name === 'deadline') {
      let deadlineIsADate = this.isDate(input.value);
      let deadlineIsInTheFuture = this.isDateInTheFuture(input.value);
      if (!deadlineIsADate) {
        input.setCustomValidity('Not valid');
        this.setState((prevState, props) => ({
          ...prevState,
          areFieldsValid: {
            ...prevState.areFieldsValid,
            [name]: false,
          },
        }));
        error.textContent = `${label} is not a valid date. Please use the form YYYY-MM-DD.`;
        return true;
      }
      if (!deadlineIsInTheFuture) {
        input.setCustomValidity('Not valid');
        this.setState((prevState, props) => ({
          ...prevState,
          areFieldsValid: {
            ...prevState.areFieldsValid,
            [name]: false,
          },
        }));
        error.textContent = `${label} is not valid. Please enter a date in the future.`;
        return true;
      }
    }

    if (name === 'stake') {
      const NUMBER_OF_DECIMAL_PLACES = 18;
      let stakeIsANumber = Number(input.value) == input.value; // eslint-disable-line eqeqeq
      let stakeIsBigEnough = input.value >= 0.1 ** NUMBER_OF_DECIMAL_PLACES;
      if (!stakeIsANumber) {
        input.setCustomValidity('Not valid');
        this.setState((prevState, props) => ({
          ...prevState,
          areFieldsValid: {
            ...prevState.areFieldsValid,
            [name]: false,
          },
        }));
        error.textContent = `${label} is not valid. Please enter a number.`;
        return true;
      }
      if (!stakeIsBigEnough) {
        input.setCustomValidity('Not valid');
        this.setState((prevState, props) => ({
          ...prevState,
          areFieldsValid: {
            ...prevState.areFieldsValid,
            [name]: false,
          },
        }));
        error.textContent = `${label} is not valid. Enter a larger amount.`;
        return true;
      }
    }

    if (name === 'recipient' || name === 'referee') {
      const addressIsValid = this.isAddress(input.value);
      if (!addressIsValid) {
        input.setCustomValidity('Not valid');
        this.setState((prevState, props) => ({
          ...prevState,
          areFieldsValid: {
            ...prevState.areFieldsValid,
            [name]: false,
          },
        }));
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
    this.setState((prevState, props) => ({
      ...prevState,
      areFieldsValid: {
        ...prevState.areFieldsValid,
        [name]: true,
      },
    }));
    const error = document.getElementById(`${name}Error`);
    error.textContent = '';
  }

  clearPledgeForm() {
    const {dispatch} = this.props;
    dispatch(clearPledgeForm());
  }

  populateField(field, value) {
    const {dispatch, ethRate} = this.props;
    let input = document.getElementById(`${field}Input`);
    input.focus()
    let newValue;
    if (field === 'recipient') {
      newValue = value;
      dispatch(changeFormField(field, newValue));
    } else if (field === 'deadline') {
      if (value === '1 week') {
        newValue = moment()
          .add(1, 'weeks')
          .format('YYYY-MM-DD');
      } else if (value === '2 weeks') {
        newValue = moment()
          .add(2, 'weeks')
          .format('YYYY-MM-DD');
      } else if (value === '2 months') {
        newValue = moment()
          .add(2, 'months')
          .format('YYYY-MM-DD');
      }
      dispatch(changeFormField(field, newValue));
    } else if (field === 'stake') {
      newValue = value / ethRate;
      dispatch(changeFormField(field, newValue));
    } else {
      this.props.history.push('/error');
    }
  }

  render() {
    const {
      nickname,
      ethRate,
      submittingPledge,
      pledgeFormState,
      userToRespondToMetaMask,
      web3,
      history,
    } = this.props;

    const account = web3 && web3.eth.accounts[0];
    let repeater = setInterval(function() {
      checkForChange();
    }, 2 * 1000);
    function checkForChange() {
      if (web3 && web3.eth.accounts[0] !== account) {
        history.push('/');
        clearInterval(repeater);
      }
    }

    const RespondToMetaMask = () => (
      <div className="respond-to-metamask">
        <h2>Confirm Transaction</h2>
        <p>Please confirm the transaction on MetaMask</p>
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
        <Navbar history={history} nickname={nickname}/>
        <div className="container new-pledge-container">
          {userToRespondToMetaMask ? (
            <RespondToMetaMask />
          ) : (
            <div>
              <BackButton />
              <NewPledgeForm
                ethRate={ethRate}
                submittingPledge={submittingPledge}
                pledgeFormState={pledgeFormState}
                handlePledgeFormChange={this.handlePledgeFormChange}
                handlePledgeFormSubmit={this.handlePledgeFormSubmit}
                handlePledgeFormFocus={this.handlePledgeFormFocus}
                handlePledgeFormBlur={this.handlePledgeFormBlur}
                isDate={this.isDate}
                isDateInTheFuture={this.isDateInTheFuture}
                areFieldsValid={this.state.areFieldsValid}
                populateField={this.populateField}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ethRate: state.pledges.ethRate,
    submittingPledge: state.pledges.submittingPledge,
    pledgeFormState: state.pledges.pledgeFormState,
    userAccount: state.registration.user.userAccount,
    nickname: state.registration.user.nickname,
    email: state.registration.user.email,
    isAuthenticated: state.registration.isAuthenticated,
    pledges: state.pledges.pledges,
    web3: state.registration.web3,
    userAcceptedTransaction: state.pledges.userAcceptedTransaction,
    newPledgeDetails: state.pledges.newPledgeDetails,
    userToRespondToMetaMask: state.pledges.userToRespondToMetaMask,
  };
}

export default connect(mapStateToProps)(NewPledge);
