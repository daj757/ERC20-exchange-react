import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import exchange_artifact from '../build/contracts/Exchange.json';
import token_artifact from '../build/contracts/FixedSupplyToken.json';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contract = require('truffle-contract')
var ExchangeContract = contract(exchange_artifact);
var TokenContract = contract(token_artifact);
var tokenName = "FIXED";


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      account: null,
      status: "",
      etherBalance: 0,
      balanceToken: 0,
      balanceEth: 0,
      network: ''
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        // Instantiate contract once web3 provided.
        this.instantiateContract()


      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  updateBalanceExchange() {
    var that = this;
    // Get balance 
    that.state.web3.eth.getBalance(that.state.account, (error, balance) => {
      if (!error) {
        that.setState({ etherBalance: that.state.web3.fromWei(balance.toNumber(), "ether") })
      }
      else {
        console.log(error)
      }

    })

    var exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.getBalance.call(tokenName, { from: that.state.account });
    }).then(function (balance) {
      that.setState({ balanceToken: balance.toNumber() })
      return exchangeInstance.getEthBalanceInWei.call({ from: that.state.account });
    }).then(function (balance) {
      that.setState({ balanceEth: that.state.web3.fromWei(balance.toNumber(), "ether") })
    }).catch(function (e) {
      console.log(e);
      that.setState({ status: "Error getting balance. See log." })
    })
  }

  instantiateContract() {

    //Check network
    this.state.web3.version.getNetwork((err, netId) => {
      switch (netId) {
        case "1":
          this.setState({ network: "This is the mainnet" })
          break
        case "2":
          this.setState({ network: 'This is the Mordan test network.' })
          break
        case "3":
          this.setState({ network: 'This is the Ropsten test network.' })
          break
        case "4":
          this.setState({ network: 'This is the Rinkeby test network.' })
          break
        case "42":
          this.setState({ network: 'This is the Kovan test network.' })
          break
        default:
          this.setState({ network: 'This is an unknown network.' })
      }
    })
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    // Declaring this for later so we can chain functions on SimpleStorage.
    ExchangeContract.setProvider(this.state.web3.currentProvider);
    TokenContract.setProvider(this.state.web3.currentProvider);
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accs) => {
      if (error != null) {
        alert("There was an error obtaining accounts");
        return;
      }
      if (accs.length === 0) {
        alert("Make sure ethereum client is configured correctly");
        return;
      }

      this.setState({ account: accs[0] })

      this.updateBalanceExchange()

    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
              <p>The stored value is: {this.state.account}</p>
              <p>{this.state.status}</p>
              <p>Ether Balance: {this.state.balanceEth}</p>
              <p>Token Balance: {this.state.balanceToken}</p>
              <p>Network: {this.state.network}</p>
              <p>Ether balance in wallet: {this.state.etherBalance}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
