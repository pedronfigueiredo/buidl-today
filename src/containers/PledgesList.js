import React, {Component} from 'react';
import {Button, Card} from 'semantic-ui-react';
import LinkButton from '../components/LinkButton';

import {connect} from 'react-redux';

import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PledgesList.css';

export class PledgesList extends Component {
  componentWillMount() {
    const {userAccount, isAuthenticated} = this.props;
    if (!userAccount || !isAuthenticated) {
      this.props.history.push('/');
    }
  }

  render() {
    const List = ({nickname}) => (
      <div>
        <h1 className="welcome-back--heading">
          Welcome back {nickname}!
        </h1>
        <Button
          className="welcome-back--button"
          fluid
          color="orange"
          onClick={() => this.testButton()}>
          Create new Pledge!
        </Button>
        <Card.Group>
          <Card fluid color="red" header="Option 1" />
          <Card fluid color="orange" header="Option 2" />
          <Card fluid color="yellow" header="Option 3" />
        </Card.Group>
      </div>
    );
    return (
      <div className="pledges-list-container">
        <div className="container">
          <List nickname={'Pedrocas'} />
          <LinkButton to="/new">New Pledge!</LinkButton>
          <LinkButton to="/about">Learn more about the science</LinkButton>
          <LinkButton to="/">Welcome Screen</LinkButton>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userAccount: state.registration.userAccount,
    isAuthenticated: state.registration.isAuthenticated,
  };
}

export default connect(mapStateToProps)(PledgesList);
