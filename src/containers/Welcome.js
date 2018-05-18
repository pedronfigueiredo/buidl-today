import React, {Component} from 'react';
import {connect} from 'react-redux';

import LinkButton from '../components/LinkButton';
import MetaMaskInstructions from '../components/MetaMaskInstructions';
import MetaMaskLocked from '../components/MetaMaskLocked';
import './Welcome.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/css/fontello.css';

import blockchain from '../utils/blockchain.js';

export class Welcome extends Component {
  constructor(props) {
    super(props);
    blockchain.getWeb(this.props.dispatch);
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch, web3, history} = this.props;
    if (nextProps.web3 !== web3 && nextProps.web3 !== '') {
      blockchain.setProvider(nextProps.web3);
      blockchain.getNetwork(nextProps.web3, dispatch);
    }
    blockchain.getUserAddress(nextProps.web3, dispatch, history);
  }

  render() {
    const {
      web3,
      web3Loaded,
      userAccount,
      dispatch,
      metaMaskWasRecognized,
      isRightNetwork,
    } = this.props;

    const account = web3 && web3.eth.accounts[0];
    let repeater = setInterval(function() {
      checkForChange();
    }, 2 * 1000);
    function checkForChange() {
      if (web3 && web3.eth.accounts[0] !== account) {
        blockchain.getUserAddress(web3, dispatch);
        clearInterval(repeater);
      }
    }

    const ButtonsGroup = () => (
      <div className="buttons-group">
        <LinkButton to="/home" className="get-started">
          Get started!
        </LinkButton>
        <LinkButton to="/about" className="learn-more">
          Learn more
        </LinkButton>
      </div>
    );

    let MetaMaskNotice = () => {
      if (!web3Loaded) {
        return null;
      }
      if (!!userAccount) {
        return <ButtonsGroup />;
      }
      if (!!metaMaskWasRecognized) {
        return <MetaMaskLocked />;
      }
      return <MetaMaskInstructions />;
    };

    let WelcomeContainer = () => (
      <div className="welcome-container">
        <div className="hero-card">
          <h1 className="heading">Buidl Today</h1>
          <p className="slogan">Ship your work</p>
        </div>
        <div className="call-to-action-card">
          <div className="container">
            <div className="feature-list row">
              <div className="feature col-md-6">
                <p className="icon">
                  <span className="icon-beaker" />
                </p>
                <p className="description">
                  Science shows that you are 2 times more averse to losses than
                  earnings.
                </p>
              </div>
              <div className="feature col-md-6">
                <p className="icon">
                  <span className="icon-link" />
                </p>
                <p className="description">
                  Harness the blockchain to keep yourself accountable.
                </p>
              </div>
            </div>
            {isRightNetwork || isRightNetwork === null ? (
              <MetaMaskNotice />
            ) : (
              <div
                style={{
                  marginTop: '5rem',
                  textAlign: 'center',
                }}>
                <h1>Wrong network</h1>
                <p style={{fontSize: '1.5rem', marginTop: '3rem'}}>
                  Please change to the Rinkeby Network.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    return <WelcomeContainer />;
  }
}

function mapStateToProps(state) {
  return {
    userAccount: state.registration.user.userAccount,
    web3: state.registration.web3,
    web3Loaded: state.registration.web3Loaded,
    metaMaskWasRecognized: state.registration.metaMaskWasRecognized,
    isRightNetwork: state.pledges.isRightNetwork,
  };
}

export default connect(mapStateToProps)(Welcome);
