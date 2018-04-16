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
    const {nickname} = this.props;

    const Navbar = () => (
      <div className="nav-bar">
        <div className="heading" onClick={this.goHome}>
          Buidl.Today
        </div>
        <div className="username">{nickname}</div>
      </div>
    );

    const List = () => (
      <div className="PledgesList">
        <Card.Group>
          <Card fluid color="red" header="Option 1" />
          <Card fluid color="orange" header="Option 2" />
          <Card fluid color="yellow" header="Option 3" />
        </Card.Group>
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
          <LinkButton to="/about">Learn more about the science</LinkButton>
        </div>
      </div>
    );

    return !!nickname ? <PledgeListComponent /> : <LoaderScreen />;
  }
}

function mapStateToProps(state) {
  return {
    userAccount: state.registration.userAccount,
    nickname:
      state.registration.registrationFormState &&
      state.registration.registrationFormState.nickname,
    isAuthenticated: state.registration.isAuthenticated,
  };
}

export default connect(mapStateToProps)(PledgesList);
