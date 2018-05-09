import React from 'react';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';
import './MetamaskModal.css';

const MetamaskModal = () => (
  <div className="metamask-modal container">
    <h2>Wanna try it out?</h2>
    <p>
      To use Buidl.Today, you will need to install MetaMask, a digital wallet.
      You will need to put money in it to make your first purchase.
    </p>
    <p>
      Note: A digital wallet like MetaMask acts like a bank account—treat it
      with respect and make sure you don’t forget your password or the seed
      words.
    </p>
    <div className="iframe-wrapper">
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/tfETpi-9ORs?rel=0&amp;showinfo=0"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      />
    </div>
    <p className="cta">
      <a target="_blank" href="https://metamask.io/">
        Visit MetaMask website
      </a>
    </p>
  </div>
);

export default MetamaskModal;
