import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import exchange_artifact from '../build/contracts/Exchange.json';
import token_artifact from '../build/contracts/FixedSupplyToken.json';
import NavBar from './components/navBar'
import LandingPage from './components/main'
import Exchange from './components/exchange'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import {
  Header,
  Grid,
  Form,
  Container,
  Divider
} from 'semantic-ui-react'

import { default as contract } from 'truffle-contract';
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
      managementStatus: "",
      etherBalance: 0,
      balanceToken: 0,
      balanceEth: 0,
      network: '',
      amountDeposit: 0,
      amountWithdraw: 0
    }
    this.instantiateContract = this.instantiateContract.bind(this);
    this.updateBalanceExchange = this.updateBalanceExchange.bind(this);

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

    // Get balance 
    this.state.web3.eth.getBalance(this.state.account, (error, balance) => {
      if (!error) {
        this.setState({ etherBalance: this.state.web3.fromWei(balance.toNumber(), "ether") })
      }
      else {
        console.log(error)
      }

    })

    var exchangeInstance;
    var that = this;
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
          this.setState({ network: "the Mainnet" })
          break
        case "2":
          this.setState({ network: 'Mordan test network.' })
          break
        case "3":
          this.setState({ network: 'Ropsten test network.' })
          break
        case "4":
          this.setState({ network: 'Rinkeby test network.' })
          break
        case "42":
          this.setState({ network: 'Kovan test network.' })
          break
        default:
          this.setState({ network: 'an unknown network.' })
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

  // deposit ether into Exchange on index.html
  depositEtherIntoExchange = () => {
    // var amount = parseInt(document.getElementById("inputAmountDepositEther").value);

    this.setState({ managementStatus: "Initiating deposit of Ether into your account on the Exchange...Please wait" });

    var exchangeInstance;
    var that = this;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.depositEther({ from: that.state.account, to: exchangeInstance.address, value: that.state.web3.toWei(that.state.amountDeposit, "ether") });
    }).then(function (txResult) {
      console.log(txResult);
      that.updateBalanceExchange();
      that.setState({ managementStatus: `Ether successfully deposited into your account on the Exchange. Tx id ${txResult.tx}` });
      that.setState({ amountDeposit: 0 })
    }).catch(function (e) {
      console.log(e);
      that.setState({ managementStatus: "There was an error depositing Ether into your account on the Exchange" });
    })
  }
  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmitDeposit = () => {
    const { amountDeposit } = this.state;

    this.depositEtherIntoExchange();

  }
  handleSubmitWithdraw = () => {
    const { amountWithdraw } = this.state

  }


  render() {
    const { amountDeposit, amountWithdraw } = this.state
    return (
      <div className="App">
        <NavBar />
        <LandingPage metaMask={this.state.web3} address={this.state.account} network={this.state.network} etherBalance={this.state.etherBalance} tokenBalance={this.state.balanceToken} exchangeEther={this.state.balanceEth} />

        <Container>
          <Header as="h1" textAlign="center">Exchange Account Management</Header>
          <Divider />
          <div style={{ textAlign: "center", marginBottom: "15px" }}>{this.state.managementStatus}</div>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Header as="h3" >You have {this.state.balanceEth} Ether in your account</Header>
                <Form onSubmit={this.handleSubmitDeposit}>
                  <Form.Input
                    placeholder='Amount to Deposit'
                    name='amountDeposit'
                    value={amountDeposit}
                    onChange={this.handleChange}
                  />
                  <Form.Button color='green' labelPosition='left' icon='money bill alternate outline' content='Deposit' />

                </Form>
                <Form style={{ marginTop: '20px' }} onSubmit={this.handleSubmitWithdraw}>
                  <Form.Input
                    placeholder='Amount to Withdraw'
                    name='amountWithdraw'
                    value={amountWithdraw}
                    onChange={this.handleChange}
                  />
                  <Form.Button color='green' labelPosition='left' icon='money bill alternate outline' content='Withdraw' />

                </Form>

              </Grid.Column>
              <Grid.Column>
                <Header as="h3" >You have {this.state.balanceToken} Tokens in your account</Header>

              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
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
