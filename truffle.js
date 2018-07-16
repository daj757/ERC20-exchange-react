// Allows us to use ES6 in our migrations and tests.
// const Web3 = require("web3");
// const web3 = new Web3();
var keys = require('./keys.js');
require("babel-register");
// const ProviderEngine = require('web3-provider-engine')
// var engine = new ProviderEngine()
// const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
// engine.addProvider(new FilterSubprovider())
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
      gas: 7500000,
      gasPrice: 40000000000,
      network_id: "1"

    }

  }
};
