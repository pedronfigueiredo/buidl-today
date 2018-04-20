let HDWalletProvider = require('truffle-hdwallet-provider');

// Getting mnemonic from file
var fs = require('fs');
const mnemonic = fs.readFileSync('./metamask-mnemonic.txt', 'utf8');
console.log(mnemonic);

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          'https://rinkeby.infura.io/XbD2llj6cDZiQCmQtLg2',
        );
      },
      network_id: 4,
    },
  },
};
