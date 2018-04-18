import React, {Component} from 'react';
import {Card} from 'semantic-ui-react';
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
    console.log('pledges', pledges);

    const Navbar = () => (
      <div className="nav-bar">
        <div className="heading" onClick={this.goHome}>
          Buidl.Today
        </div>
        <div className="username">{nickname}</div>
      </div>
    );

    const pledgeMap = pledges.map(item => (
      <Card className="pledge-list-item" fluid key={item._id}>
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
              {item.referee}
            </p>
            <p className="pledge-recipient">
              <span className="heading">Recipient: </span>
              {item.recipient}
            </p>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <p className="pledge-creation-timestamp">
            <a href={'https://etherscan.io/tx/' + item.tx}>
              Created {moment(item.dateOfCreation, 'X').format('YYYY-MM-DD')} ({moment(
                item.dateOfCreation,
                'X',
              ).fromNow()})
            </a>
          </p>
          <p>
            <span className="pledge-creator-nickname">
              By {item.address === userAccount ? 'you' : item.nickname}
            </span>&nbsp;<span className="pledge-creator-address">
              ({item.address})
            </span>
          </p>
        </Card.Content>
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
