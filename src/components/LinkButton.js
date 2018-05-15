import React from 'react';
import {withRouter} from 'react-router-dom';

import {Button} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const LinkButton = props => {
  const {
    history,
    location, // eslint-disable-line no-unused-vars
    match, // eslint-disable-line no-unused-vars
    staticContext, // eslint-disable-line no-unused-vars
    to,
    onClick,
    // ⬆ filtering out props that `button` doesn’t know what to do with.
    ...rest
  } = props;
  return (
    <Button
      {...rest} // `children` is just another prop!
      onClick={event => {
        onClick && onClick(event);
        history.push(to);
      }}
    />
  );
};

export default withRouter(LinkButton);
