import React, {Component} from 'react';
import {connect} from 'react-redux';

import RedButton from '../components/RedButton.js';
import Navbar from '../components/Navbar.js';

import './About.css';

export class About extends Component {
  render() {
    const {history} = this.props;

    return (
      <div className="about-container">
        <Navbar history={history} />
        <div className="container">
          <h1 id="about">About</h1>
          <p>
            Buidl.Today is a decentralised app that combines the technology of
            the Ethereum blockchain and principles of cognitive psychology to
            help you build stuff.
          </p>

          <h3 id="lossaversion">Loss Aversion</h3>
          <p>
            In cognitive psychology and decision theory, loss aversion is
            people's tendency to prefer avoiding losses to acquiring equivalent
            gains: it is better to not lose $50 than to find $50.
          </p>
          <p>
            Loss aversion was first identified by Amos Tversky and Daniel
            Kahneman.[1] Some studies have suggested that losses are twice as
            powerful, psychologically, as gains.[2]
          </p>
          <p>Simply put, a stick is more efficient than a carrot.</p>
          <small>
            <p>
              [1] Kahneman, D. &amp; Tversky, A. (1984). "Choices, Values, and
              Frames". American Psychologist. 39 (4): 341–350.
              doi:10.1037/0003-066x.39.4.341.
            </p>
          </small>
          <small>
            <p>
              [2] Kahneman, D. &amp; Tversky, A. (1992). "Advances in prospect
              theory: Cumulative representation of uncertainty". Journal of Risk
              and Uncertainty. 5 (4): 297–323. doi:10.1007/BF00122574.
            </p>
          </small>

          <h3 id="accountability">Accountability</h3>
          <p>
            Accountability is just a fancy word to describe the outsourcing of
            willpower.
          </p>
          <p>
            With Buidl.Today, it becomes up to your friend or other third-party
            to decide if you completed your work, so your brain doesn't trick
            you.
          </p>

          <h3>Referee and Recipient</h3>
          <p>
            A <strong>referee</strong> is the Ethereum address of the person
            that can confirm if the pledge is fullfilled on time. If the pledge
            isn't confirmed before the deadline, the <strong>recipient</strong>{' '}
            can withdraw the money.
          </p>
          <p>
            In the future, Buidl Today will feature Ethereum addresses owned by
            charities as suggested recipients.
          </p>

          <h2 id="whydoyouneedtheblockchainforthis">
            Why do you need the blockchain for this?
          </h2>
          <ul>
            <li>No passwords, use the blockchain to login.</li>
            <li>Instant, confirmed transaction.</li>
            <li>And it feels good!</li>
          </ul>

          <h2 id="isthisforme">Is this for me?</h2>
          <p>Only if you have some work to do. You can Pledge to:</p>
          <ul>
            <li>Launch a side hustle</li>
            <li>Study for a test</li>
            <li>Finish an online course</li>
            <li>Establish a freelance career</li>
            <li>Build a home-based business</li>
            <li>Block out office distractions</li>
            <li>...and any others!</li>
          </ul>

          <h2 id="whythetypo">Why the typo?</h2>
          <p>First of all, it's cool.</p>
          <p>
            Hodl is a meme originating from a misspelling on the{' '}
            <a
              href="https://bitcointalk.org/index.php?topic=375643.0"
              target="_blank"
              rel="noopener noreferrer">
              BitcoinTalk Forums
            </a>. The poster was stating his plan to keep his Bitcoin stake even
            while admiting his uncertainty about the future.
          </p>
          <p>
            Buidl is the builders version of hodl, an expression born out of the
            urgency to invest time and skill in creating new tools and
            applications of the technology, instead of concentrating on the
            finantial side.
          </p>

          <h2 id="whomadethis">Who made this?</h2>
          <p>
            I'm Pedro, a Software Engineer currently diving into Blockchain
            Technology. Drop me a line via{' '}
            <a href="mailto:pnfigueiredo@me.com">email</a> or{' '}
            <a
              href="https://twitter.com/pnfigueiredo"
              target="_blank"
              rel="noopener noreferrer">
              Twitter
            </a>.
          </p>

          <div className="go-back--wrapper">
            <RedButton onClick={() => history.push('/')} text={'Home'} />
          </div>
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
