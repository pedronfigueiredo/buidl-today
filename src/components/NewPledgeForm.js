import React, {Component} from 'react';
import {Form} from 'semantic-ui-react';
import LoaderScreen from './LoaderScreen.js';

import moment from 'moment';
import RedButton from './RedButton.js';

import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NewPledgeForm.css';

export class NewPledgeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableButton: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    let self = this;
    setTimeout(function() {
      let valid = self.areAllFieldsValid();
      let filled = self.areAllFieldsFilled();
      if (valid && filled) {
        self.setState({disableButton: false});
      } else {
        self.setState({disableButton: true});
      }
    }, 16);
  }

  areAllFieldsFilled() {
    const {
      pledgeFormState: {deadline, description, recipient, referee, stake},
    } = this.props;
    if (!!deadline && !!description && !!recipient && !!referee && !!stake) {
      return true;
    } else {
      return false;
    }
  }

  areAllFieldsValid() {
    const {
      description,
      deadline,
      stake,
      referee,
      recipient,
    } = this.props.areFieldsValid;
    if (!!description && !!deadline && !!stake && !!referee && !!recipient) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const {
      submittingPledge,
      pledgeFormState: {description, deadline, stake, referee, recipient},
      handlePledgeFormChange,
      handlePledgeFormFocus,
      handlePledgeFormBlur,
      handlePledgeFormSubmit,
      isDate,
      isDateInTheFuture,
      ethRate,
      populateField,
    } = this.props;

    const inAWeek = moment()
      .add(7, 'days')
      .format('YYYY-MM-DD');

    const developerEthAddress = '0xa9f570d8f799c7770021dfe6a58fb91773f9a14f';

    const FormComponent = (
      <Form>
        <h1 className="heading">Create New Pledge</h1>

        <Form.Field>
          <label id="descriptionLabel">Pledge description</label>
          <input
            type="text"
            name="description"
            id="descriptionInput"
            placeholder="Develop my new app"
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
            id="deadlineInput"
            placeholder={inAWeek}
            value={deadline}
            onChange={handlePledgeFormChange}
            onFocus={handlePledgeFormFocus}
            onBlur={handlePledgeFormBlur}
            required
          />
          <p className="form-error" id="deadlineError" />
          {!!deadline &&
            isDate(deadline) &&
            isDateInTheFuture(deadline) && (
              <p className="realtime-timedistance">
                In {moment(deadline, 'YYYY-MM-DD').fromNow(true)}
              </p>
            )}
          {deadline === '' && (
            <div className="badge-btn-wrapper">
              <div
                className="badge-btn deadline--badge-btn"
                onClick={() => populateField('deadline', '1 week')}>
                1 week
              </div>
              <div
                className="badge-btn deadline--badge-btn"
                onClick={() => populateField('deadline', '2 weeks')}>
                2 weeks
              </div>
              <div
                className="badge-btn deadline--badge-btn"
                onClick={() => populateField('deadline', '2 months')}>
                2 months
              </div>
            </div>
          )}
        </Form.Field>

        <Form.Field>
          <label id="stakeLabel">Stake (in ETH)</label>
          <input
            type="text"
            name="stake"
            id="stakeInput"
            placeholder="0.5"
            value={stake}
            onChange={handlePledgeFormChange}
            onFocus={handlePledgeFormFocus}
            onBlur={handlePledgeFormBlur}
            required
          />
          <p className="form-error" id="stakeError" />
          {!!stake &&
            stake == Number(stake) && // eslint-disable-line eqeqeq
            (stake !== 0 && stake !== '0') && (
              <p className="realtime-conversion">
                Aproximately {Math.round(ethRate * stake * 100) / 100} USD
              </p>
            )}
          {stake === '' && (
            <div className="badge-btn-wrapper">
              <div
                className="badge-btn amount--badge-btn"
                onClick={() => populateField('stake', '5')}>
                5 USD
              </div>
              <div
                className="badge-btn amount--badge-btn"
                onClick={() => populateField('stake', '20')}>
                20 USD
              </div>
              <div
                className="badge-btn amount--badge-btn"
                onClick={() => populateField('stake', '50')}>
                50 USD
              </div>
            </div>
          )}
        </Form.Field>

        <Form.Field>
          <label id="recipientLabel">Recipient</label>
          <p className="label-description">This address will be able to withdraw the money you staked if you don't fullfill your pledge on time.</p>
          <input
            type="text"
            name="recipient"
            id="recipientInput"
            placeholder="Ethereum Address"
            value={recipient}
            onChange={handlePledgeFormChange}
            onFocus={handlePledgeFormFocus}
            onBlur={handlePledgeFormBlur}
            required
          />
          <p className="form-error" id="recipientError" />
          {!!recipient &&
            recipient === developerEthAddress && 
                <p className="realtime-thank-you">
                  Thank you for your support (but I hope you make it!)
                </p>
              }
          {recipient === '' && (
            <div className="badge-btn-wrapper">
              <div
                className="badge-btn support-developer--badge-btn"
                onClick={() => populateField('recipient', developerEthAddress)}>
                Support Developer
              </div>
            </div>
          )}
        </Form.Field>

        <Form.Field>
          <label id="refereeLabel">Referee</label>
          <p className="label-description">This address will be able to confirm if you fullfilled your pledge on time.</p>
          <input
            type="text"
            name="referee"
            id="refereeInput"
            placeholder="Ethereum Address"
            value={referee}
            onChange={handlePledgeFormChange}
            onFocus={handlePledgeFormFocus}
            onBlur={handlePledgeFormBlur}
            required
          />
          <p className="form-error" id="refereeError" />
        </Form.Field>

        <RedButton
          name={'submit-pledge'}
          text={'Make a Pledge'}
          type="submit"
          onClick={handlePledgeFormSubmit}
          fluid
          disabled={this.state.disableButton}
        />
      </Form>
    );

    return <div>{submittingPledge ? <LoaderScreen /> : FormComponent}</div>;
  }
}

export default NewPledgeForm;
