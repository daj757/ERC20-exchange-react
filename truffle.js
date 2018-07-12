// Allows us to use ES6 in our migrations and tests.
var keys = require('./keys.js');
require("babel-register");
var HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = {
  solc: { optimizer: { enabled: true, runs: 200 } },
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(keys.keyPhrase, keys.infura)
      },
      network_id: "4"
    },
    live: {
      provider: function () {
        return new HDWalletProvider(keys.mainNetPhrase, keys.infuraMainNet)
      },

      network_id: 1,

      gas: 7500000,
      gasPrice: 15

    }

  }
};
