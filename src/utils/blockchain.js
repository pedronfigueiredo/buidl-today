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
  getWeb(dispatch) {
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
  // // Contract Call Template
  // getOwner() {
  //   Buidl.deployed()
  //     .then(instance => instance.getOwner())
  //     .then(result => {
  //       console.log('Owner Address', result);
  //     });
  // },
  createAgreement(newPledgeDetails, web3, dispatch, history) {
    Buidl.deployed()
      .then(instance => {
        return instance.createAgreement.sendTransaction(
          newPledgeDetails.agreementId,
        );
      })
      .then(txHash => {
        let data = {
          ...newPledgeDetails,
          txHash,
          txConfirmed: false,
          isStakePaid: false,
          isPledgeConfirmed: false,
        };
        const newPledge = api.post('insertpledge', data);
        if (newPledge[0] === 'error') {
          console.error('Error inserting pledge');
          history.push('/error');
        } else {
          dispatch(requestCreateAgreement(data));
          blockchain.fetchReceipt(data, web3, dispatch, history);
          history.push('/home');
        }
      });
  },
  fetchReceipt(data, web3, dispatch, history) {
    web3.eth.getTransactionReceipt(data.txHash, function(error, result) {
      if (!error) {
        if (result === null) {
          setTimeout(function() {
            blockchain.fetchReceipt(data, web3, dispatch, history);
          }, 10 * 1000);
        } else {
          web3.eth.getBlock(result.blockHash, function(error, result) {
            if (!error) {
              let updatedData = {
                ...data,
                timestamp: result.timestamp,
                txConfirmed: true,
              };
              const newPledge = api.post('updatepledge', updatedData);
              if (newPledge[0] === 'error') {
                console.error('error updating');
                history.push('/error');
              } else {
                dispatch(createAgreementConfirmed(updatedData));
              }
            } else {
              console.error('Error getting transaction receipt');
              console.error('Error message:', error);
              history.push('/error');
            }
          });
        }
      } else {
        console.error(error);
      }
    });
  },
};

export default blockchain;
