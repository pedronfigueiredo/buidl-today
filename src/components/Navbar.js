import React, {Component} from 'react';

import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

export class Navbar extends Component {
  constructor(props) {
    super(props);
    this.goHome = this.goHome.bind(this);
  }

  goHome() {
    const {history} = this.props;
    history.push('/');
  }

  render() {
    const {
      nickname,
    } = this.props;

    const Navbar = () => (
      <div className="nav-bar">
        <div className="heading" onClick={this.goHome}>
          Buidl.Today
        </div>
        <div className="username">{nickname}</div>
      </div>
    );

    return <Navbar />;
  }
}

export default Navbar;
