import {storeWeb3, storeUserAccount} from '../redux/registration.js';
import {
  requestCreateAgreement,
  createAgreementConfirmed,
} from '../redux/pledges.js';

import api from '../utils/api.js';

import BuidlContract from '../contracts/Buidl.json';
import contract from 'truffle-contract';
import getWeb3 from '../utils/getWeb3';
const Buidl = contract(BuidlContract);

const blockchain = {
  getWeb3(dispatch) {
    getWeb3.then(results => {
      dispatch(storeWeb3(results.web3));
    });
  },
  setProvider(web3) {
    Buidl.setProvider(web3.currentProvider);
  },
  getUserAddress(web3, dispatch) {
    if (web3) {
      web3.eth.getAccounts((error, accounts) => {
        Buidl.defaults({
          from: accounts[0],
          gas: 3000000,
        });
        dispatch(storeUserAccount(accounts[0]));
      });
    }
  },
  // Contract Call Template
  getOwner() {
    Buidl.deployed()
      .then(instance => instance.getOwner())
      .then(result => {
        console.log('Owner Address', result);
      });
  },
  createAgreement(agreementId, web3, dispatch) {
    let storeTxHash;
    Buidl.deployed()
      .then(instance => instance.createAgreement.sendTransaction(agreementId))
      .then(txHash => {
        storeTxHash = txHash;
        dispatch(requestCreateAgreement(agreementId, txHash));
        return web3.eth.getTransactionReceipt(txHash);
      })
      .then(receipt => {
        return web3.eth.getBlock(receipt.blockHash).timestamp;
      })
      .then(timestamp => {
        dispatch(createAgreementConfirmed(agreementId, timestamp));
        let updates = {
          txHash: storeTxHash,
          timestamp,
          txConfirmed: true,
          isStakePaid: false,
          isPledgeConfirmed: false,
        };
        console.log('updates', updates);
        const updatePledge = api.post('updatepledge', updates);
        if (updatePledge[0] === 'error') {
          console.error('error updating');
          this.props.history.push('/error');
        }
      });
  },
};

export default blockchain;
