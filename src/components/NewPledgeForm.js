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
    } = this.props;

    const inAWeek = moment()
      .add(7, 'days')
      .format('YYYY-MM-DD');

    const FormComponent = (
      <Form>
        <h1 className="heading">
          Create New Pledge
        </h1>

        <Form.Field>
          <label id="descriptionLabel">Pledge description</label>
          <input
            type="text"
            name="description"
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
            stake == Number(stake) &&
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
          disabled={this.state.disableButton}
        />
      </Form>
    );

    return <div>{submittingPledge ? <LoaderScreen /> : FormComponent}</div>;
  }
}

export default NewPledgeForm;
