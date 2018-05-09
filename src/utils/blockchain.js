import {storeWeb3, storeUserAccount} from '../redux/registration.js';
import {
  requestCreateAgreement,
  createAgreementConfirmed,
  requestWithdrawPledge,
  confirmWithdrawPledge,
  clearPledgeForm,
  errorSubmitPledge,
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
          gas: 3 * 1000 * 1000,
        });
        dispatch(storeUserAccount(accounts[0]));
      });
    }
  },

  createAgreement(newPledgeDetails, web3, dispatch, history) {
    Buidl.deployed()
      .then(function(instance) {
        return instance.createAgreement.estimateGas(
          newPledgeDetails.agreementId,
          {
            value: newPledgeDetails.stake * 10 ** 18,
          },
        );
      })
      .then(function(estimatedCostInUnits) {
        Buidl.deployed()
          .then(instance => {
            return instance.createAgreement
              .sendTransaction(newPledgeDetails.agreementId, {
                gas: Number(estimatedCostInUnits),
                value: newPledgeDetails.stake * 10 ** 18,
              })
              .catch(err => {
                if (
                  err.message.includes('User denied transaction') ||
                  err.message.includes('Request has been rejected.') ||
                  err.message.includes('transaction has been discarded') ||
                  err.message.includes('Transaction not confirmed')
                ) {
                  dispatch(errorSubmitPledge());
                  return Promise.reject('User cancelled');
                }

                if (err.message.includes('nonce too low')) {
                  return Promise.reject('web3NonceTooLow');
                }

                if (err.message.includes('nonce may not be larger than')) {
                  return Promise.reject('web3NonceTooHigh');
                }

                if (err.message.includes('insufficient funds for gas')) {
                  return Promise.reject('web3InsufficientFundsForGas');
                }

                if (err.message.includes('intrinsic gas too low')) {
                  return Promise.reject('web3GasTooLow');
                }
                return Promise.reject(err);
              });
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
              history.push('/error');
              console.error('Error inserting pledge');
              dispatch(clearPledgeForm());
              dispatch(errorSubmitPledge());
            } else {
              dispatch(requestCreateAgreement(data));
              blockchain.fetchReceipt(data, web3, dispatch, history);
              history.push('/home');
            }
          })
          .catch(err => {
            if (err !== 'User cancelled') {
              console.log('err', err);
              dispatch(errorSubmitPledge());
              history.push('/error');
            }
          });
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
                history.push('/error');
                console.error(
                  'Error updating pledge with confirmation timestamp',
                );
                dispatch(clearPledgeForm());
                dispatch(errorSubmitPledge());
              } else {
                dispatch(clearPledgeForm());
                dispatch(createAgreementConfirmed(updatedData));
              }
            } else {
              history.push('/error');
              console.error('Error getting transaction receipt');
              console.error('Error message:', error);
              dispatch(clearPledgeForm());
              dispatch(errorSubmitPledge());
            }
          });
        }
      } else {
        history.push('/error');
        console.error(error);
        dispatch(clearPledgeForm());
        dispatch(errorSubmitPledge());
      }
    });
  },

  withdraw(item, type, web3, dispatch, history) {
    let address;
    if (type === 'recipient') {
      address = item.recipient;
    } else if (type === 'pledger') {
      address = item.address;
    } else {
      history.push('/error');
      console.error('Wrong type of withdrawal');
      return;
    }
    Buidl.deployed()
      .then(function(instance) {
        return instance.withdraw.estimateGas(address, item.agreementId);
      })
      .then(function(estimatedCostOfWithdrawal) {
        Buidl.deployed()
          .then(instance => {
            return instance.withdraw
              .sendTransaction(address, item.agreementId, {
                gas: Number(estimatedCostOfWithdrawal),
              })
              .catch(err => {
                if (
                  err.message.includes('User denied transaction') ||
                  err.message.includes('Request has been rejected.') ||
                  err.message.includes('transaction has been discarded') ||
                  err.message.includes('Transaction not confirmed')
                ) {
                  return Promise.reject('User cancelled');
                }

                if (err.message.includes('nonce too low')) {
                  return Promise.reject('web3NonceTooLow');
                }

                if (err.message.includes('nonce may not be larger than')) {
                  return Promise.reject('web3NonceTooHigh');
                }

                if (err.message.includes('insufficient funds for gas')) {
                  return Promise.reject('web3InsufficientFundsForGas');
                }

                if (err.message.includes('intrinsic gas too low')) {
                  return Promise.reject('web3GasTooLow');
                }
                return Promise.reject(err);
              });
          })
          .then(withdrawTxHash => {
            let data = {
              ...item,
              withdrawTxHash,
              isWithdrawTxConfirmed: false,
            };
            const updatePledge = api.post('requestwithdrawpledge', data);
            if (updatePledge[0] === 'error') {
              history.push('/error');
              console.error('Error inserting pledge');
            } else {
              dispatch(requestWithdrawPledge(data));
              blockchain.fetchWithdrawReceipt(data, web3, dispatch, history);
            }
          })
          .catch(err => {
            if (err !== 'User cancelled') {
              console.log('err', err);
              history.push('/error');
            }
          });
      });
  },

  fetchWithdrawReceipt(data, web3, dispatch, history) {
    web3.eth.getTransactionReceipt(data.withdrawTxHash, function(
      error,
      result,
    ) {
      if (!error) {
        if (result === null) {
          setTimeout(function() {
            blockchain.fetchWithdrawReceipt(data, web3, dispatch, history);
          }, 10 * 1000);
        } else {
          web3.eth.getBlock(result.blockHash, function(error, result) {
            if (!error) {
              let updatedData = {
                ...data,
                txWithdrawalTimestamp: result.timestamp,
                isWithdrawTxConfirmed: true,
                isStakePaid: true,
              };
              const updatedPledge = api.post(
                'confirmwithdrawpledge',
                updatedData,
              );
              if (updatedPledge[0] === 'error') {
                history.push('/error');
                console.error('error updating');
              } else {
                dispatch(confirmWithdrawPledge(updatedData));
              }
            } else {
              history.push('/error');
              console.error('Error getting transaction receipt');
              console.error('Error message:', error);
            }
          });
        }
      } else {
        history.push('/error');
        console.error(error);
      }
    });
  },
};

export default blockchain;
