import React, {Component} from 'react';
import {Button, Card} from 'semantic-ui-react';
import LoaderScreen from '../components/LoaderScreen.js';
import RedButton from '../components/RedButton.js';

import {connect} from 'react-redux';

import {updateETHRate} from '../redux/pledges';

import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import './PledgesList.css';

export class PledgesList extends Component {
  constructor(props) {
    super(props);
    this.goHome = this.goHome.bind(this);
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

  goHome() {
    const {history} = this.props;
    history.push('/');
  }

  render() {
    const {nickname, pledges, userAccount, ethRate} = this.props;
    const Navbar = () => (
      <div className="nav-bar">
        <div className="heading" onClick={this.goHome}>
          Buidl.Today
        </div>
        <div className="username">{nickname}</div>
      </div>
    );

    const PledgesButton = ({
      address,
      referee,
      recipient,
      deadline,
      isPledgeConfirmed,
    }) => {
      const userIsPledger = userAccount === address;
      const userIsReferee = userAccount === referee;
      const userIsRecipient = userAccount === recipient;
      const now = moment().format('X');
      const timeIsUp = deadline < now;
      if (!timeIsUp && !userIsReferee) {
        return null;
      } else if (!timeIsUp && !isPledgeConfirmed && userIsReferee) {
        return (
          <Button className="confirm-pledge-button" color={'yellow'}>
            Confirm
          </Button>
        );
      } else if (timeIsUp && !isPledgeConfirmed && !userIsRecipient) {
        return (
          <div className="expired-pledge-notice">
            <p>
              This pledge expired because it wasn't confirmed before the
              deadline.
            </p>
            <p>
              The stake can now be withdrawn by the recipient ({recipient}).
            </p>
          </div>
        );
      } else if (timeIsUp && !isPledgeConfirmed && userIsRecipient) {
        return (
          <Button className="withdraw-pledge-button" color={'green'}>
            Withdraw
          </Button>
        );
      } else if (isPledgeConfirmed && !userIsPledger) {
        return (
          <div className="confirmed-pledge-notice">
            <p>This pledge was confirmed by the referee ({referee}).</p>
            <p>The stake can now be withdrawn by the pledger ({address}).</p>
          </div>
        );
      } else if (isPledgeConfirmed && userIsPledger) {
        return (
          <Button className="withdraw-pledge-button" color={'green'}>
            Withdraw
          </Button>
        );
      } else {
        return null;
      }
    };

    const pledgeMap = pledges.map(item => (
      <Card className="pledge-list-item" fluid key={item.agreementId}>
        <Card.Content>
          <Card.Header>
            <span className="pledge-description">{item.description}</span>
          </Card.Header>
          <Card.Meta>
            <span className="pledge-deadline">
              Until {moment(item.deadline, 'X').format('YYYY-MM-DD')} ({moment(
                item.deadline,
                'X',
              ).fromNow()})
            </span>
          </Card.Meta>
          <Card.Description>
            <p className="pledge-stake">
              You pledged {item.stake} ETH (about{' '}
              {Math.round(item.stake * ethRate * 100) / 100} USD)
            </p>
            <p className="pledge-referee">
              <span className="heading">Referee: </span>
              {item.referee === userAccount
                ? 'You (' + item.referee + ')'
                : item.referee}
            </p>
            <p className="pledge-recipient">
              <span className="heading">Recipient: </span>
              {item.recipient === userAccount
                ? 'You (' + item.recipient + ')'
                : item.recipient}
            </p>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <p className="pledge-creation-timestamp">
            {item.txConfirmed ? (
              <a
                target="_blank"
                href={'https://etherscan.io/tx/' + item.txHash}>
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
                href={'https://etherscan.io/tx/' + item.txHash}>
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
              {item.txConfirmed ? ' (' + item.address + ')' : null}
            </span>
          </p>
        </Card.Content>
        <PledgesButton
          address={item.address}
          referee={item.referee}
          recipient={item.recipient}
          deadline={item.deadline}
          isPledgeConfirmed={item.isPledgeConfirmed}
          txConfirmed={item.txConfirmed}
        />
      </Card>
    ));

    // <Card fluid color="red" header={item.description} />
    const List = () => (
      <div className="PledgesList">
        {pledges.length ? (
          <Card.Group key="1">{pledgeMap}</Card.Group>
        ) : (
          <p className="empty-pledges-list-notice">You have no pledges yet.</p>
        )}
      </div>
    );

    const PledgeListComponent = () => (
      <div className="pledges-list--component">
        <Navbar />
        <div className="container pledges-list--container">
          <RedButton
            name={'new-pledge'}
            text={'New Pledge!'}
            fluid
            link
            to={'/new'}
          />
          <List />
        </div>
      </div>
    );

    return !!nickname ? <PledgeListComponent /> : <LoaderScreen />;
  }
}

function mapStateToProps(state) {
  return {
    userAccount: state.registration.user && state.registration.user.userAccount,
    nickname: state.registration.user && state.registration.user.nickname,
    isAuthenticated: state.registration.isAuthenticated,
    pledges: state.pledges.pledges,
    ethRate: state.pledges.ethRate,
  };
}

export default connect(mapStateToProps)(PledgesList);
