import React, {Component} from 'react';
import {Dimmer, Loader, Segment} from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class LoaderScreen extends Component {
  render() {
    const loaderStyles = {
      height: '100vh',
      border: 'none',
      boxShadow: 'none',
    };
    const LoaderComponent = (
      <Segment style={loaderStyles}>
        <Dimmer inverted active>
          <Loader>Loading</Loader>
        </Dimmer>
      </Segment>
    );
    return LoaderComponent;
  }
}

export default LoaderScreen;
