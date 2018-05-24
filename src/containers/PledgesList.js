import React, {Component} from 'react';
import {Button, Card, Loader, Dimmer} from 'semantic-ui-react';
import LoaderScreen from '../components/LoaderScreen.js';
import RedButton from '../components/RedButton.js';
import Navbar from '../components/Navbar.js';

import {connect} from 'react-redux';

import {
  getAllPledgesFromUser,
  getAllPledgesFromUserEmpty,
  getAllPledgesFromUserError,
  getAllPledgesFromUserSuccess,
  updateETHRate,
  updatePledgeItem,
  startWithdrawalProcess,
} from '../redux/pledges';

import api from '../utils/api.js';

import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import './PledgesList.css';
import blockchain from '../utils/blockchain.js';

export class PledgesList extends Component {
  componentWillMount() {
    const {user: {userAccount}, isAuthenticated} = this.props;
    if (!userAccount || !isAuthenticated) {
      this.props.history.push('/');
    }
  }

  componentDidMount() {
    const {user: {userAccount}} = this.props;
    this.getAllPledgesFromUser(userAccount);
    this.getEthereumPrice();
  }

  getAllPledgesFromUser(address) {
    const {dispatch} = this.props;
    dispatch(getAllPledgesFromUser());
    api
      .get('pledgesfromuser/' + address)
      .then(res => {
        if (res === 'No pledges found') {
          dispatch(getAllPledgesFromUserEmpty());
        } else if (res === 'error') {
          dispatch(getAllPledgesFromUserError());
          this.props.history.push('/error');
        } else {
          dispatch(getAllPledgesFromUserSuccess(res));
          this.getMissedTransactionReceipts();
        }
      })
      .catch(err => {
        this.props.history.push('/error');
      });
  }

  getEthereumPrice() {
    const {dispatch} = this.props;
    fetch('https://api.coinmarketcap.com/v1/ticker/ethereum/')
      .then(res => res.json())
      .then(json => dispatch(updateETHRate(json[0].price_usd)));
  }

  getMissedTransactionReceipts() {
    const {
      dispatch,
      history,
      web3,
      user: {userAccount},
      justCreatedAgreement,
      justCreatedWithdrawal,
    } = this.props;
    if (!justCreatedAgreement) {
      api
        .get('missedcreationreceipts/' + userAccount)
        .then(res => {
          if (res === 'No pledges found') {
          } else if (res === 'error') {
            this.props.history.push('/error');
          } else {
            for (let i = 0; i < res.length; i++) {
              blockchain.fetchReceipt(res[i], web3, dispatch, history);
            }
          }
        })
        .catch(err => {
          console.error('err', err);
          this.props.history.push('/error');
        });
    }
    if (!justCreatedWithdrawal) {
      api
        .get('missedwithdrawalreceipts/' + userAccount)
        .then(res => {
          if (res === 'No pledges found') {
          } else if (res === 'error') {
            this.props.history.push('/error');
          } else {
            for (let i = 0; i < res.length; i++) {
              blockchain.fetchWithdrawReceipt(res[i], web3, dispatch, history);
            }
          }
        })
        .catch(err => {
          console.error('err', err);
          this.props.history.push('/error');
        });
    }
  }

  confirmPledge(item) {
    const {dispatch, history} = this.props;
    let updatedItem = {
      ...item,
      isPledgeConfirmed: false,
      isPledgeConfirming: true,
    };
    dispatch(updatePledgeItem(updatedItem));
    updatedItem = {
      ...item,
      isPledgeConfirmed: true,
      isPledgeConfirming: false,
    };
    const updatedPledge = api.post('confirmpledge', updatedItem);
    if (updatedPledge[0] === 'error') {
      console.error('error updating');
      updatedItem = {
        ...item,
        isPledgeConfirmed: false,
        isPledgeConfirming: false,
      };
      dispatch(updatePledgeItem(updatedItem));
      history.push('/error');
    } else {
      dispatch(updatePledgeItem(updatedItem));
    }
  }

  withdrawPledge(item, type) {
    const {web3, dispatch, history} = this.props;
    dispatch(startWithdrawalProcess());
    blockchain.withdraw(item, type, web3, dispatch, history);
  }

  render() {
    const {
      user: {nickname, userAccount},
      pledges,
      ethRate,
      userToRespondToMetaMask,
      web3,
      history,
      retrievingPledges,
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

    let PledgesButton = ({
      item,
      address,
      referee,
      recipient,
      deadline,
      isPledgeConfirmed,
    }) => {
      let userIsPledger = userAccount === address;
      let userIsReferee = userAccount === referee;
      let userIsRecipient = userAccount === recipient;
      let now = moment().format('X');
      let timeIsUp = deadline < now;
      if (!timeIsUp && !isPledgeConfirmed && userIsReferee) {
        return (
          <Button
            className="confirm-pledge-button"
            color={'yellow'}
            onClick={() => this.confirmPledge(item)}
            disabled={item.isPledgeConfirming}>
            {item.isPledgeConfirming ? 'Confirming. Please wait...' : 'Confirm'}
          </Button>
        );
      } else if (!timeIsUp && !isPledgeConfirmed && !userIsReferee) {
        return (
          <div className="confirm-pledge-notice pledge-notice">
            <p>
              This pledge is waiting confirmation by the referee ({referee}).
            </p>
          </div>
        );
      } else if (timeIsUp && !isPledgeConfirmed && userIsRecipient) {
        return (
          <Button
            className="withdraw-pledge-button"
            color={'green'}
            onClick={() => this.withdrawPledge(item, 'recipient')}
            disabled={
              item.isWithdrawTxConfirmed === false || userToRespondToMetaMask
            }>
            {item.isWithdrawTxConfirmed === false
              ? 'Withdrawing. Please wait...'
              : userToRespondToMetaMask
                ? 'Confirm withdrawal on MetaMask'
                : 'Withdraw'}
          </Button>
        );
      } else if (timeIsUp && !isPledgeConfirmed && !userIsRecipient) {
        return (
          <div className="expired-pledge-notice pledge-notice">
            <p>
              This pledge expired because it wasn't confirmed before the
              deadline.
            </p>
            <p>
              The stake can now be withdrawn by the recipient ({recipient}).
            </p>
          </div>
        );
      } else if (isPledgeConfirmed && userIsPledger) {
        return (
          <Button
            className="withdraw-pledge-button"
            color={'green'}
            onClick={() => this.withdrawPledge(item, 'pledger')}
            disabled={
              item.isWithdrawTxConfirmed === false || userToRespondToMetaMask
            }>
            {item.isWithdrawTxConfirmed === false
              ? 'Withdrawing. Please wait...'
              : userToRespondToMetaMask
                ? 'Confirm withdrawal on MetaMask'
                : 'Withdraw'}
          </Button>
        );
      } else if (isPledgeConfirmed && !userIsPledger) {
        return (
          <div className="confirmed-pledge-notice pledge-notice">
            <p>
              This pledge was confirmed by{' '}
              {this.props.userAccount === referee
                ? 'you.'
                : 'the referee (' + referee + ').'}
            </p>
            {userAccount === recipient && <p>You won't be able to claim it.</p>}
            <p>The stake can be withdrawn by the pledger ({address}).</p>
          </div>
        );
      } else {
        return null;
      }
    };

    let pledgeMap = pledges.map(item => (
      <Card className="pledge-list-item" fluid key={item.agreementId}>
        <Card.Content>
          <Card.Header>
            <span className="pledge-description">{item.description}</span>
          </Card.Header>
          <Card.Meta>
            <span className="pledge-deadline">
              Until {moment(item.deadline, 'X').format('YYYY-MM-DD')}
              {' at '}
              {moment(item.deadline, 'X').format('HH:mm')} ({moment(
                item.deadline,
                'X',
              ).fromNow()})
            </span>
          </Card.Meta>
          <Card.Description>
            <p className="pledge-stake">
              {item.address === userAccount ? 'You ' : item.nickname + ' '}
              pledged {item.stake} ETH (about{' '}
              {Math.round(item.stake * ethRate * 100) / 100} USD)
            </p>
            <p className="pledge-referee">
              <span className="heading">Referee: </span>
              {item.referee === userAccount ? 'You' : item.referee}
            </p>
            <p className="pledge-recipient">
              <span className="heading">Recipient: </span>
              {item.recipient === userAccount ? 'You' : item.recipient}
            </p>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <p className="pledge-creation-timestamp">
            {item.txConfirmed ? (
              <a
                target="_blank"
                href={'https://rinkeby.etherscan.io/tx/' + item.txHash}>
                Created{' '}
                {moment(item.timestamp, 'X').format('YYYY-MM-DD') !==
                'Invalid date'
                  ? moment(item.timestamp, 'X').format('YYYY-MM-DD') +
                    ' (' +
                    moment(item.timestamp, 'X').fromNow() +
                    ')'
                  : 'now'}
              </a>
            ) : (
              <a
                target="_blank"
                href={'https://rinkeby.etherscan.io/tx/' + item.txHash}>
                <em>Transaction confirming</em>
              </a>
            )}
          </p>
          <p>
            {item.txConfirmed ? (
              <span className="pledge-creator-nickname">
                By {item.address === userAccount ? 'you' : item.nickname}
              </span>
            ) : null}
            <span className="pledge-creator-address">
              {item.txConfirmed && item.address !== userAccount
                ? ' (' + item.address + ')'
                : null}
            </span>
          </p>
        </Card.Content>
        {item.txConfirmed !== false && (
          <PledgesButton
            item={item}
            address={item.address}
            referee={item.referee}
            recipient={item.recipient}
            deadline={item.deadline}
            isPledgeConfirmed={item.isPledgeConfirmed}
            txConfirmed={item.txConfirmed}
          />
        )}
      </Card>
    ));

    let List = () => (
      <div className="PledgesList">
        {pledges.length ? (
          <Card.Group key="1">{pledgeMap}</Card.Group>
        ) : (
          <p className="empty-pledges-list-notice">You have no pledges yet.</p>
        )}
      </div>
    );

    let PledgeListComponent = () => (
      <div className="pledges-list--component">
        <Navbar history={history} nickname={nickname} />
        <div className="container pledges-list--container">
          {retrievingPledges ? (
            <Dimmer inverted active>
              <Loader>Loading pledges</Loader>
            </Dimmer>
          ) : (
            <div>
              <RedButton
                name={'new-pledge'}
                text={'New Pledge!'}
                fluid
                link
                to={'/new'}
              />
              <List />
            </div>
          )}
        </div>
      </div>
    );

    return !!nickname ? <PledgeListComponent /> : <LoaderScreen />;
  }
}

function mapStateToProps(state) {
  return {
    user: state.registration.user,
    isAuthenticated: state.registration.isAuthenticated,
    pledges: state.pledges.pledges,
    retrievingPledges: state.pledges.retrievingPledges,
    ethRate: state.pledges.ethRate,
    web3: state.registration.web3,
    justCreatedAgreement: state.pledges.justCreatedAgreement,
    justCreatedWithdrawal: state.pledges.justCreatedWithdrawal,
    userToRespondToMetaMask: state.pledges.userToRespondToMetaMask,
  };
}

export default connect(mapStateToProps)(PledgesList);
