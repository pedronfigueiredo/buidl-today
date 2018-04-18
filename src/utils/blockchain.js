import {storeWeb3, storeUserAccount} from '../redux/registration.js';

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
  createAgreement(agreementId, web3) {
    Buidl.deployed()
      .then(instance => instance.createAgreement.sendTransaction(agreementId))
      .then(hash => {
        console.log('Create Agreement');
        console.log('Transaction hash:', hash);
        return web3.eth.getTransactionReceipt(hash);
        // Transaction created: spinning wheel
        // Transaction hash for etherscan
      })
      .then(receipt => {
        console.log('receipt', receipt);
        console.log('confirmation on Block', receipt.blockHash);
        return web3.eth.getBlock(receipt.blockHash).timestamp;
      })
      .then(timestamp => {
        console.log('Timestamp');
        console.log(timestamp);
        // Transaction confirmed send timestamp
      });
  },
};

export default blockchain;
