import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import exchange_artifact from '../build/contracts/Exchange.json';
import token_artifact from '../build/contracts/FixedSupplyToken.json';
import NavBar from './components/navBar'
import LandingPage from './components/main'
import Erc20Management from './components/ERC20TokenManagement'
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
      managementTokenStatus: "",
      etherBalance: 0,
      balanceToken: 0,
      balanceTokenInExchange: 0,
      balanceEth: 0,
      network: '',
      amountDeposit: 0,
      amountWithdraw: 0,
      ethLoading: false,
      ethLoading2: false,
      amountDepositFieldError: false,
      amountWithdrawFieldError: false,
      tokenAmountDeposit: 0,
      tokenName: "",
      tokenName2: "",
      tokenAmountWithdraw: 0,
      exchangeAddress: "",
      tokenAddress: ""

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

  // update token balance on managetoken.hmtl
  updateTokenBalance() {
    var that = this;
    var tokenInstance;
    TokenContract.deployed().then(function (instance) {
      tokenInstance = instance;
      return tokenInstance.balanceOf.call(that.state.account);
    }).then(function (balance) {
      that.setState({ balanceToken: balance.valueOf() })
    }).catch(function (e) {
      console.log(e);
      that.setState({ managementTokenStatus: "Error getting balance. See log." })
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
      this.updateTokenBalance()
      this.printImportantInformation()
    })
  }

  // deposit ether into Exchange on index.html
  depositEtherIntoExchange = () => {
    // var amount = parseInt(document.getElementById("inputAmountDepositEther").value);

    this.setState({ managementStatus: "Initiating deposit of Ether into your account on the Exchange...Please wait" });
    this.setState({ ethLoading: true })
    var exchangeInstance;
    var that = this;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.depositEther({ from: that.state.account, to: exchangeInstance.address, value: that.state.web3.toWei(that.state.amountDeposit, "ether") });
    }).then(function (txResult) {
      console.log(txResult);
      that.updateBalanceExchange();
      that.setState({ managementStatus: `Ether successfully deposited into your account on the Exchange. Tx id ${txResult.tx}` });
      that.setState({ amountDeposit: 0, ethLoading: false })
    }).catch(function (e) {
      console.log(e);
      that.setState({ managementStatus: `There was an error depositing Ether into your account on the Exchange. ${e.message}`, ethLoading: false });
    })
  }
  //withdraw Ether from exchange function
  withdrawEthFromExchange() {
    var that = this;

    that.setState({ managementStatus: "Initiating withdraw of Ether from your account on the Exchange...Please wait", ethLoading2: true });

    var exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.withdrawEther(that.state.web3.toWei(that.state.amountWithdraw, "ether"), { from: that.state.account });
    }).then(function (txResult) {
      console.log(txResult);
      that.updateBalanceExchange();
      that.setState({ managementStatus: `Ether successfully withdrawn from your account on the Exchange. TX id ${txResult.tx}` });
      that.setState({ amountWithdraw: 0, ethLoading2: false })
    }).catch(function (e) {
      console.log(e);
      that.setState({ managementStatus: `There was an error withdrawing Ether from your account on the Exchange. ${e.message}`, ethLoading2: false });
    })
  }
  //Deposit token into exchange

  depositTokenIntoExchange() {
    var that = this;
    var symbolName = this.state.tokenName;
    var amount = this.state.tokenAmountDeposit;
    that.setState({ managementStatus: "Initiating deposit of Token into your account on the Exchange....Please wait" });
    var exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.depositToken(symbolName, amount, { from: that.state.account });
    }).then(function (txResult) {
      console.log(txResult);
      that.updateBalanceExchange();
      that.setState({ managementStatus: "Token(s) successfully deposited into your account on the Exchange" });
    }).catch(function (e) {
      console.log(e);
      that.setState({ managementStatus: "There was an error depositing Token into your account on the Exchange" });
    })
  }

  // withdraw token(s) from Exchange on index.html
  withdrawTokenFromExchange() {
    var that = this;

    let symbolName = that.state.tokenName2;
    let amount = that.state.tokenAmountWithdraw;

    that.setState({ managementStatus: "Initiating withdrawal of Token from your account on the Exchange...Please wait" });

    let exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.withdrawToken(symbolName, amount, { from: that.state.account });
    }).then(function (txResult) {
      console.log(txResult);
      that.updateBalanceExchange();
      that.setState({ managementStatus: "Token(s) successfully withdrawn from your account on the Exchange" });
    }).catch(function (e) {
      console.log(e);
      that.setState({ managementStatus: "There was an error withdrawing Token(s) from your account on the Exchange" });
    })
  }

  // allow an address to receive tokens from FixedSupplyToken on managetoken.html
  allowanceToken(allowance, address) {
    let amount = allowance
    let receiver = address
    var that = this;

    that.setState({ managementTokenStatus: "Initiating allowance of token...please wait" });

    let tokenInstance;
    TokenContract.deployed().then(function (instance) {
      tokenInstance = instance;
      tokenInstance.approve(receiver, amount, { from: that.state.account });
    }).then(function (txResults) {
      console.log(txResults)
      that.setState({ managementTokenStatus: "Token allowance accepted" });
    }).catch(function (e) {
      console.log(e);
      that.setState({ managementTokenStatus: "Token allowance rejected" });
    })
  }
  //Add ERC20 token to exchange
  addTokenToExchange(tokenName, address) {
    var that = this;
    let nameOfToken = tokenName;
    let addressOfToken = address;

    that.setState({ managementTokenStatus: "Initiating addition of Token to Exchange...please wait" })

    var exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.addToken(nameOfToken, addressOfToken, { from: that.state.account });
    }).then(function (txResult) {
      console.log(txResult);
      that.updateTokenBalance()
      that.setState({ managementTokenStatus: "Token succesfully added to Exchange" });
    }).catch(function (e) {
      console.log(e);
      that.setState({ managementTokenStatus: "There was an error adding Token to the Exchange. See logs" });
    })
  }

  printImportantInformation() {
    var that = this
    ExchangeContract.deployed().then(function (instance) {
      that.setState({ exchangeAddress: instance.address });
    })
    TokenContract.deployed().then(function (instance) {
      console.log(instance.address)
      that.setState({ tokenAddress: instance.address });
    })

  }

  handleChange = (e, { name, value }) => {
    if (isFinite(value)) {
      this.setState({ [name]: value, [name + "FieldError"]: false })
    }
    else {
      this.setState({ [name + "FieldError"]: true })
    }
  }

  handleChangeLetters = (e, { name, value }) => {
    this.setState({ [name]: value })
  }
  handleSubmitDeposit = () => {
    const { amountDeposit } = this.state;

    this.depositEtherIntoExchange();

  }
  handleSubmitWithdraw = () => {
    const { amountWithdraw } = this.state
    this.withdrawEthFromExchange();

  }
  handleTokenDeposit = () => {
    const { tokenName, tokenAmountDeposit } = this.state
    this.depositTokenIntoExchange();
  }
  handleTokenWithdraw = () => {
    const { tokenName, tokenAmountWithdraw } = this.state
    this.withdrawTokenFromExchange();
  }

  render() {
    const { amountDeposit, amountWithdraw, tokenAmountDeposit, tokenName, tokenAmountWithdraw, tokenName2 } = this.state
    return (
      <div className="App">
        <NavBar />
        <LandingPage metaMask={this.state.web3} address={this.state.account} network={this.state.network} etherBalance={this.state.etherBalance} tokenBalanceInExchange={this.state.balanceTokenInExchange} tokenBalance={this.state.balanceToken} exchangeEther={this.state.balanceEth} />

        <Container>
          <Header as="h1" textAlign="center">Exchange Account Management</Header>
          <Divider />
          <div style={{ textAlign: "center", marginBottom: "15px" }}>{this.state.managementStatus}</div>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Header as="h3" >Deposit and withdraw Ether from exchange.</Header>
                <Header as="h4" >You have {this.state.balanceEth} Ether in your account</Header>
                <Form loading={this.state.ethLoading} onSubmit={this.handleSubmitDeposit}>
                  <Form.Input
                    error={this.state.amountDepositFieldError}
                    placeholder='Amount to Deposit'
                    name='amountDeposit'
                    value={amountDeposit}
                    onChange={this.handleChange}
                  />
                  <Form.Button color='green' labelPosition='left' icon='money bill alternate outline' content='Deposit' />

                </Form>
                <Form loading={this.state.ethLoading2} style={{ marginTop: '20px' }} onSubmit={this.handleSubmitWithdraw}>
                  <Form.Input
                    error={this.state.amountWithdrawFieldError}
                    placeholder='Amount to Withdraw'
                    name='amountWithdraw'
                    value={amountWithdraw}
                    onChange={this.handleChange}
                  />
                  <Form.Button color='green' labelPosition='left' icon='money bill alternate outline' content='Withdraw' />

                </Form>

              </Grid.Column>
              <Grid.Column>
                <Header as="h3" >Deposit any custom ERC20 token below. First head to ERC20 token management to add a token.</Header>
                <Header as="h4" >You have {this.state.balanceTokenInExchange} Tokens in the exchange.</Header>
                <Form loading={this.state.tokenLoading} style={{ marginTop: '20px' }} onSubmit={this.handleTokenDeposit}>
                  <Form.Input
                    placeholder='Token Name'
                    name='tokenName'
                    value={tokenName}
                    onChange={this.handleChangeLetters}>
                  </Form.Input>
                  <Form.Input
                    error={this.state.amountTokenFieldError}
                    placeholder='Amount to Deposit'
                    name='tokenAmountDeposit'
                    value={tokenAmountDeposit}
                    onChange={this.handleChange}>
                  </Form.Input>
                  <Form.Button color='blue' labelPosition='left' icon='money bill alternate outline' content='Deposit' />
                </Form>
                <Form loading={this.state.tokenLoading} style={{ marginTop: '20px' }} onSubmit={this.handleTokenWithdraw}>
                  <Form.Input
                    placeholder='Token Name'
                    name='tokenName2'
                    value={tokenName2}
                    onChange={this.handleChangeLetters}>
                  </Form.Input>
                  <Form.Input
                    error={this.state.amountTokenFieldError}
                    placeholder='Amount to Withdraw'
                    name='tokenAmountWithdraw'
                    value={tokenAmountWithdraw}
                    onChange={this.handleChange}>
                  </Form.Input>
                  <Form.Button color='blue' labelPosition='left' icon='money bill alternate outline' content='Withdraw' />
                </Form>

              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Erc20Management allowanceToken={this.allowanceToken.bind(this)} address={this.state.tokenAddress} exchangeAddress={this.state.exchangeAddress} addToken={this.addTokenToExchange.bind(this)} status={this.state.managementTokenStatus} tokenAmount={this.state.balanceToken} />
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
