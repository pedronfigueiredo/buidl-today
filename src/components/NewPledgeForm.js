import React, {Component} from 'react';
import {Form} from 'semantic-ui-react';
import LoaderScreen from './LoaderScreen.js';

import moment from 'moment';
import RedButton from './RedButton.js';

import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NewPledgeForm.css';
import keccak256 from 'js-sha3';

export class NewPledgeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddress: null,
      isChecksumAddress: false,
    };
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
      return this.setState({isAddress: false});
    } else if (
      /^(0x)?[0-9a-f]{40}$/.test(address) ||
      /^(0x)?[0-9A-F]{40}$/.test(address)
    ) {
      // if it's all small caps or all all caps, return true
      return this.setState({isAddress: true});
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
        return this.setState({isChecksumAddress: false});
      }
    }
    return this.setState({isChecksumAddress: true});
  }

  render() {
    const {
      submittingPledge,
      pledgeFormState: {description, deadline, stake, referee, recipient},
      handlePledgeFormChange,
      handlePledgeFormFocus,
      handlePledgeFormBlur,
      handlePledgeFormSubmit,
      ethRate,
    } = this.props;

    const inAWeek = moment()
      .add(7, 'days')
      .format('YYYY-MM-DD');

    const FormComponent = (
      <Form>
        <h1 className="heading">Create New Pledge</h1>

        <Form.Field>
          <label id="descriptionLabel">Pledge description</label>
          <input
            type="text"
            name="description"
            placeholder="Write my new app"
            value={description}
            onChange={handlePledgeFormChange}
            onFocus={handlePledgeFormFocus}
            onBlur={handlePledgeFormBlur}
            required
          />
          <p className="form-error" id="descriptionError" />
        </Form.Field>

        <Form.Field>
          <label id="deadlineLabel">Deadline</label>
          <input
            type="text"
            name="deadline"
            placeholder={inAWeek}
            value={deadline}
            onChange={handlePledgeFormChange}
            onFocus={handlePledgeFormFocus}
            onBlur={handlePledgeFormBlur}
            required
          />
          <p className="form-error" id="deadlineError" />
        </Form.Field>

        <Form.Field>
          <label id="stakeLabel">Stake (in ETH)</label>
          <input
            type="text"
            name="stake"
            placeholder="0.5"
            value={stake}
            onChange={handlePledgeFormChange}
            onFocus={handlePledgeFormFocus}
            onBlur={handlePledgeFormBlur}
            required
          />
          <p className="form-error" id="stakeError" />
          {!!stake &&
            typeof Number(stake) === 'number' &&
            (stake !== 0 && stake !== '0') && (
              <p className="realtime-conversion">
                Aproximately {Math.round(ethRate * stake * 100) / 100} USD
              </p>
            )}
        </Form.Field>

        <Form.Field>
          <label id="refereeLabel">Referee</label>
          <input
            type="text"
            name="referee"
            placeholder="Ethereum Address"
            value={referee}
            onChange={handlePledgeFormChange}
            onFocus={handlePledgeFormFocus}
            onBlur={handlePledgeFormBlur}
            required
          />
          <p className="form-error" id="refereeError" />
        </Form.Field>

        <Form.Field>
          <label id="recipientLabel">Recipient</label>
          <input
            type="text"
            name="recipient"
            placeholder="Ethereum Address"
            value={recipient}
            onChange={handlePledgeFormChange}
            onFocus={handlePledgeFormFocus}
            onBlur={handlePledgeFormBlur}
            required
          />
          <p className="form-error" id="recipientError" />
        </Form.Field>

        <RedButton
          name={'submit-pledge'}
          text={'Make a Pledge'}
          type="submit"
          onClick={handlePledgeFormSubmit}
          fluid
        />
      </Form>
    );

    return <div>{submittingPledge ? <LoaderScreen /> : FormComponent}</div>;
  }
}

export default NewPledgeForm;
