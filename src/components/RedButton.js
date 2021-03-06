import React from 'react';
import LinkButton from '../components/LinkButton';
import {Button} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RedButton.css';

const RedButton = props => {
  return (
    <div className={props.name + '--button__wrapper red--button__wrapper'}>
      {!!props.link && (
        <LinkButton
          className={props.name + '--button red--button'}
          fluid={props.fluid}
          to={props.to}
          disabled={props.disabled}>
          {props.text}
        </LinkButton>
      )}
      {!props.link && (
        <Button
          className={props.name + '--button red--button'}
          fluid={props.fluid}
          onClick={props.onClick}
          disabled={props.disabled}>
          {props.text}
        </Button>
      )}
    </div>
  );
};

export default RedButton;
