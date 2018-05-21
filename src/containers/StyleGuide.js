import React, {Component} from 'react';
import {Button, Card} from 'semantic-ui-react';
import {connect} from 'react-redux';

import moment from 'moment';

import RedButton from '../components/RedButton.js';
import Navbar from '../components/Navbar.js';

import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './StyleGuide.css';

export class StyleGuide extends Component {
  render() {
    const {history} = this.props;
    const HeadingOne = () => <h1>Heading 1</h1>;
    const HeadingTwo = () => <h2>Heading 2</h2>;
    const HeadingThree = () => <h3>Heading 3</h3>;
    const Paragraph = () => (
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
        vulputate at eros ut vehicula. Vivamus ut massa eros. Nam et purus quis
        dui maximus semper ac in magna. Donec porttitor euismod velit, sit amet
        placerat ante congue id. Quisque faucibus, nibh et convallis gravida,
        nunc lectus efficitur enim, scelerisque dignissim diam turpis nec justo.
        Ut pellentesque ex vitae luctus pretium. Ut hendrerit rutrum faucibus.
        Sed aliquet nisi magna, at fermentum magna posuere in. Phasellus mollis
        condimentum ipsum, non porttitor urna condimentum quis. Morbi dignissim
        purus non felis laoreet pharetra. Duis eget neque ac mauris vehicula
        elementum. Praesent pellentesque tincidunt ipsum vitae pharetra.
        Vestibulum fringilla egestas nibh, eget porttitor risus iaculis quis.
      </p>
    );
    const ListComponent = () => (
      <ul>
        <li>Launch a side hustle</li>
        <li>Study for a test</li>
        <li>Finish an online course</li>
        <li>Establish a freelance career</li>
        <li>Build a home-based business</li>
        <li>Block out office distractions</li>
        <li>...and any others!</li>
      </ul>
    );

    const TextComponent = () => (
      <div className="text-component">
        <HeadingOne />
        <HeadingTwo />
        <HeadingThree />
        <Paragraph />
        <ListComponent />
      </div>
    );

    let items = [
      {
        deadline: 60 * 60 * 24 * 365 * 48.25,
        timestamp: 60 * 60 * 24 * 365 * 47.75,
        stake: '0.122',
        txConfirmed: true,
        nickname: 'Pedro',
        recipient: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        address: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        referee: '0x5AbFEc25f74Cd88437631a7731906932776356f8',
        userToRespondToMetaMask: false,
        isPledgeConfirming: false,
        type: 'Confirm notice',
      },
      {
        deadline: 60 * 60 * 24 * 365 * 48.25,
        timestamp: 60 * 60 * 24 * 365 * 47.75,
        stake: '0.122',
        txConfirmed: true,
        nickname: 'Pedro',
        recipient: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        address: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        referee: '0x5AbFEc25f74Cd88437631a7731906932776356f8',
        type: 'Confirm',
        userToRespondToMetaMask: false,
        isPledgeConfirming: false,
      },
      {
        deadline: 60 * 60 * 24 * 365 * 48.25,
        timestamp: 60 * 60 * 24 * 365 * 47.75,
        stake: '0.122',
        txConfirmed: true,
        nickname: 'Pedro',
        recipient: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        address: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        referee: '0x5AbFEc25f74Cd88437631a7731906932776356f8',
        type: 'Confirm',
        userToRespondToMetaMask: true,
        isPledgeConfirming: true,
      },
      {
        deadline: 60 * 60 * 24 * 365 * 48.25,
        timestamp: 60 * 60 * 24 * 365 * 47.75,
        stake: '0.122',
        txConfirmed: true,
        nickname: 'Pedro',
        recipient: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        address: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        referee: '0x5AbFEc25f74Cd88437631a7731906932776356f8',
        userToRespondToMetaMask: true,
        isPledgeConfirming: false,
        type: 'Can be withdrawn',
      },
      {
        deadline: 60 * 60 * 24 * 365 * 48.25,
        timestamp: 60 * 60 * 24 * 365 * 47.75,
        stake: '0.122',
        txConfirmed: true,
        nickname: 'Pedro',
        recipient: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        address: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        referee: '0x5AbFEc25f74Cd88437631a7731906932776356f8',
        userToRespondToMetaMask: true,
        isPledgeConfirming: false,
        type: 'Pledge expired notice',
      },
      {
        deadline: 60 * 60 * 24 * 365 * 48.25,
        timestamp: 60 * 60 * 24 * 365 * 47.75,
        stake: '0.122',
        txConfirmed: true,
        nickname: 'Pedro',
        recipient: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        address: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        referee: '0x5AbFEc25f74Cd88437631a7731906932776356f8',
        type: 'Withdraw pledger',
        userToRespondToMetaMask: false,
        isPledgeConfirming: false,
      },
      {
        deadline: 60 * 60 * 24 * 365 * 48.25,
        timestamp: 60 * 60 * 24 * 365 * 47.75,
        stake: '0.122',
        txConfirmed: true,
        nickname: 'Pedro',
        recipient: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        address: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        referee: '0x5AbFEc25f74Cd88437631a7731906932776356f8',
        type: 'Withdraw pledger',
        userToRespondToMetaMask: true,
        isPledgeConfirming: false,
      },
      {
        deadline: 60 * 60 * 24 * 365 * 48.25,
        timestamp: 60 * 60 * 24 * 365 * 47.75,
        stake: '0.122',
        txConfirmed: true,
        nickname: 'Pedro',
        recipient: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        address: '0x5AbFEc25f74Cd88437631a7731906932776356f9',
        referee: '0x5AbFEc25f74Cd88437631a7731906932776356f8',
        type: 'Withdraw pledger',
isWithdrawTxConfirmed: false,
        userToRespondToMetaMask: true,
        isPledgeConfirming: false,
      },
    ];

    let ethRate = 700;

    let PledgesButton = ({type, item}) => {
      const referee = '0x5AbFEc25f74Cd88437631a7731906932776356f9';
      const recipient = '0x5AbFEc25f74Cd88437631a7731906932776356f9';
      const address = '0x5AbFEc25f74Cd88437631a7731906932776356f9';
      if (type === 'Confirm') {
        return (
          <Button
            className="confirm-pledge-button"
            color={'yellow'}
            onClick={() => this.confirmPledge(item)}
            disabled={item.isPledgeConfirming}>
            {item.isPledgeConfirming ? 'Confirming. Please wait...' : 'Confirm'}
          </Button>
        );
      } else if (type === 'Confirm notice') {
        return (
          <div className="confirm-pledge-notice pledge-notice">
            <p>
              This pledge is waiting confirmation by the referee ({referee}).
            </p>
          </div>
        );
      } else if (type === 'Withdraw recipient') {
        return (
          <Button
            className="withdraw-pledge-button"
            color={'green'}
            onClick={() => this.withdrawPledge(item, 'recipient')}
            disabled={
              item.isWithdrawTxConfirmed === false ||
              item.userToRespondToMetaMask
            }>
            {item.isWithdrawTxConfirmed === false
              ? 'Withdrawing. Please wait...'
              : item.userToRespondToMetaMask
                ? 'Confirm withdrawal on MetaMask'
                : 'Withdraw'}
          </Button>
        );
      } else if (type === 'Pledge expired notice') {
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
      } else if (type === 'Withdraw pledger') {
        return (
          <Button
            className="withdraw-pledge-button"
            color={'green'}
            onClick={() => this.withdrawPledge(item, 'pledger')}
            disabled={
              item.isWithdrawTxConfirmed === false ||
              item.userToRespondToMetaMask
            }>
            {item.isWithdrawTxConfirmed === false
              ? 'Withdrawing. Please wait...'
              : item.userToRespondToMetaMask
                ? 'Confirm withdrawal on MetaMask'
                : 'Withdraw'}
          </Button>
        );
      } else if (type === 'Can be withdrawn') {
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

    const userAccount = '0x5AbFEc25f74Cd88437631a7731906932776356f9';

    let PledgeCard = items.map((item, id) => (
      <Card className="pledge-list-item" fluid key={id}>
        <Card.Content>
          <Card.Header>
            <span className="pledge-description">Item Description</span>
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
          <PledgesButton item={item} type={item.type} />
        )}
      </Card>
    ));

    return (
      <div>
        <Navbar history={history} nickname={'User Name'} />
        <div className="style-guide-container container">
          <TextComponent />
          <div className="red--button__wrapper">
            <RedButton
              onClick={() => console.log('Test')}
              text={'Red Button'}
            />
          </div>
          <RedButton
            onClick={() => console.log('Test')}
            text={'Fluid Red Button'}
            fluid
          />
          <Card.Group key="1">{PledgeCard}</Card.Group>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.registration.user,
  };
}

export default connect(mapStateToProps)(StyleGuide);
