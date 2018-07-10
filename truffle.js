tr// Allows us to use ES6 in our migrations and tests.
var keys = require('./keys.js');
require("babel-register");
var HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = {
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
      network_id: "4" // Rinkeby network id
      // from: "0x59ec72026e0259bb726940ef7ee29290fb4cc166",
      // gas: 860000
      //address of storage contract
      //0x19d1bd4dd48efd575d3bb27f63f7767870544889e01f2fb3ae47cdcd3baf9c17
    },
    live: {
      provider: function () {
        return new HDWalletProvider(keys.mainNetPhrase, keys.infuraMainNet)
      },
      network_id: "1" // Rinkeby network id
      // from: "0x59ec72026e0259bb726940ef7ee29290fb4cc166",
      // gas: 860000
      //address of storage contract
      //0x19d1bd4dd48efd575d3bb27f63f7767870544889e01f2fb3ae47cdcd3baf9c17
    }
    
  }
};
