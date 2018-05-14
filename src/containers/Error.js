import React, {Component} from 'react';
import {connect} from 'react-redux';

import RedButton from '../components/RedButton.js';

import './Error.css';

export class ErrorContainer extends Component {
  constructor(props) {
    super(props);
    this.goHome = this.goHome.bind(this);
  }

  goHome() {
    const {history} = this.props;
    history.push('/');
  }

  render() {
    const {history} = this.props;
    const Navbar = () => (
      <div className="nav-bar">
        <div className="heading" onClick={this.goHome}>
          Buidl.Today
        </div>
        <div className="username" />
      </div>
    );

    return (
      <div className="error-container">
        <Navbar />
        <div className="container">
          <h1>Ooooops...</h1>
          <p>Something went wrong...</p>
          <div className="go-back--wrapper">
            <RedButton onClick={() => history.push('/')} text={'Home'} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    mappedState: state,
  };
}

export default connect(mapStateToProps)(ErrorContainer);
