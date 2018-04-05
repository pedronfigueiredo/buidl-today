import React, {Component} from 'react';
import {connect} from 'react-redux';

import './About.css';

export class About extends Component {
  render() {
    const {history} = this.props;
    console.log('about', this.props);
    return (
      <div className="about-container">
        <div className="container">
          <h1>ABOUT</h1>
          <button onClick={() => history.goBack('/')}>Go Back</button>
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

export default connect(mapStateToProps)(About);
