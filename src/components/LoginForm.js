import React, {Component} from 'react';
import {Button, Form} from 'semantic-ui-react';
import LoaderScreen from './LoaderScreen.js';

import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginForm.css';

export class LoginForm extends Component {
  render() {
    const {
      isLoading,
      userAccount,
      loginFormState: {emailAddress, nickname},
      handleLoginFormChange,
      handleLoginFormSubmit,
      handleLoginFormFocus,
      handleLoginFormBlur,
    } = this.props;

    const emailRegex = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}';

    const loginForm = (
      <Form className="login-form" onSubmit={handleLoginFormSubmit}>
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
            onChange={handleLoginFormChange}
            onFocus={handleLoginFormFocus}
            onBlur={handleLoginFormBlur}
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
            onChange={handleLoginFormChange}
            onFocus={handleLoginFormFocus}
            onBlur={handleLoginFormBlur}
            required
          />
          <p className="form-error" id="nicknameError" />
        </Form.Field>
        <Button type="submit">Save account info</Button>
      </Form>
    );

    return <div>{isLoading ? <LoaderScreen /> : loginForm}</div>;
  }
}

export default LoginForm;
