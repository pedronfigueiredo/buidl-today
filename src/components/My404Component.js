import React, {Component} from 'react';
import {connect} from 'react-redux';

import '../css/oswald.css';
import '../css/open-sans.css';
import '../css/pure-min.css';
import './My404Component.css';

export class My404Component extends Component {
  render() {
    const {userAccount} = this.props;
    console.log('userAccount');
    console.log(userAccount);
    return (
      <div className="My404Component">
        <div className="container">
          <h1>Oooops... 404 PAGE NOT FOUND!</h1>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userAccount: state.login.userAccount,
  };
}

export default connect(mapStateToProps)(My404Component);
