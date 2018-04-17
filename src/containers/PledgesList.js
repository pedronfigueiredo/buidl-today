import React, {Component} from 'react';
import {Card} from 'semantic-ui-react';
import LinkButton from '../components/LinkButton';
import LoaderScreen from '../components/LoaderScreen.js';
import RedButton from '../components/RedButton.js';

import {connect} from 'react-redux';

import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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

  goHome() {
    const {history} = this.props;
    history.push('/');
  }

  render() {
    console.log('this.props', this.props);
    const {nickname, pledges} = this.props;

    const Navbar = () => (
      <div className="nav-bar">
        <div className="heading" onClick={this.goHome}>
          Buidl.Today
        </div>
        <div className="username">{nickname}</div>
      </div>
    );

    const pledgeMap = pledges.map(item => (
      <Card fluid key={item._id}>
        <Card.Content>
          <Card.Header>
            <span className="">{item.description}</span>&nbsp;<span className="">
              {item.stake} ETH
            </span>&nbsp;<span className="">{item.stake} ETH</span>
          </Card.Header>
          <Card.Meta>
            <span className="date">{item.deadline}</span>
          </Card.Meta>
          <Card.Description>
            <p className="">{item.description}</p>
            <p className="">{item.stake}</p>
            <p className="">{item.referee}</p>
            <p className="">{item.recipient}</p>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <a href={'https://etherscan.io/tx/' + item.tx}>
            {item.dateOfCreation}
          </a>
        </Card.Content>
        <Card.Content extra>
          <p className="">
            <span className="">{item.nickname}</span>&nbsp;<span className="">
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
  };
}

export default connect(mapStateToProps)(PledgesList);
