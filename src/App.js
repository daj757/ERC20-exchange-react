import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import exchange_artifact from '../build/contracts/Exchange.json';
import token_artifact from '../build/contracts/FixedSupplyToken.json';
import NavBar from './components/navBar'
import LandingPage from './components/main'
import Erc20Management from './components/ERC20TokenManagement'
import ExchangeManagement from './components/ExchangeManagement'
import TokenTrading from './components/TokenTrading'
import Footer from './components/Footer'
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
      amountDeposit: "",
      amountDepositButton: true,
      amountWithdraw: "",
      amountWithdrawButton: true,
      ethLoading: false,
      ethLoading2: false,
      amountDepositFieldError: false,
      amountWithdrawFieldError: false,
      tokenDepositLoading: false,
      tokenWithdrawLoading: false,
      allowanceTokenLoading: false,
      loadingSendToken: false,
      loadingAddToken: false,
      tokenAmountDeposit: 0,
      tokenName: "FIXED",
      tokenName2: "",
      tokenAmountWithdraw: 0,
      exchangeAddress: "",
      tokenAddress: "",
      tokenAmountAllowance: 0,
      sendAmount: 0,
      sendAddress: "",
      tokenTradingStatus: "",
      tokenNameToBuy: "",
      tokenAmountToBuy: 0,
      tokenNameToSell: "",
      tokenAmountToSell: 0,
      tokenPriceToBuy: 0,
      tokenPriceToSell: 0,
      sellOrders: null,
      buyOrders: null

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
      that.setState({ balanceTokenInExchange: balance.toNumber() })
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
      this.updateOrderBook()
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

    that.setState({ managementStatus: "Initiating deposit of Token into your account on the Exchange....Please wait", tokenDepositLoading: true });
    var exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.depositToken(symbolName, amount, { from: that.state.account });
    }).then(function (txResult) {
      console.log(txResult);
      that.updateBalanceExchange();
      that.setState({ managementStatus: "Token(s) successfully deposited into your account on the Exchange", tokenDepositLoading: false });
    }).catch(function (e) {
      console.log(e);
      that.setState({ managementStatus: "There was an error depositing Token into your account on the Exchange", tokenDepositLoading: false });
    })
  }

  // withdraw token(s) from Exchange on index.html
  withdrawTokenFromExchange() {
    var that = this;

    let symbolName = that.state.tokenName2;
    let amount = that.state.tokenAmountWithdraw;
    that.setState({
      managementStatus: "Initiating withdrawal of Token from your account on the Exchange...Please wait",
      tokenWithdrawLoading: true
    });

    let exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.withdrawToken(symbolName, amount, { from: that.state.account });
    }).then(function (txResult) {
      console.log(txResult);
      that.updateBalanceExchange();
      that.setState({ managementStatus: "Token(s) successfully withdrawn from your account on the Exchange", tokenWithdrawLoading: false });
    }).catch(function (e) {
      console.log(e);
      that.setState({ managementStatus: "There was an error withdrawing Token(s) from your account on the Exchange", tokenWithdrawLoading: false });
    })
  }

  // allow an address to receive tokens from FixedSupplyToken on managetoken.html
  allowanceToken() {
    var that = this;
    let amount = that.state.tokenAmountAllowance;
    let receiver = that.state.exchangeAddress;
    that.setState({ allowanceTokenLoading: true, managementTokenStatus: "Initiating allowance of token...please wait" });
    let tokenInstance;
    TokenContract.deployed().then(function (instance) {
      console.log(instance, receiver, amount, that.state.account, that.state.allowanceTokenLoading)
      tokenInstance = instance;
      return tokenInstance.approve(receiver, amount, { from: that.state.account });
    }).then(function (txResults) {
      console.log(txResults)
      that.setState({ allowanceTokenLoading: false, managementTokenStatus: "Token allowance accepted" });
    }).catch(function (e) {
      console.log(e);
      that.setState({ allowanceTokenLoading: false, managementTokenStatus: "Token allowance rejected" });
    })
  }
  //Add ERC20 token to exchange
  addTokenToExchange(tokenName, address) {
    var that = this;
    let nameOfToken = tokenName;
    let addressOfToken = address;

    that.setState({ loadingAddToken: true, managementTokenStatus: "Initiating addition of Token to Exchange...please wait" })

    var exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.addToken(nameOfToken, addressOfToken, { from: that.state.account });
    }).then(function (txResult) {
      console.log(txResult);
      that.updateTokenBalance()
      that.setState({ loadingAddToken: false, managementTokenStatus: "Token succesfully added to Exchange" });
    }).catch(function (e) {
      console.log(e);
      that.setState({ loadingAddToken: false, managementTokenStatus: "There was an error adding Token to the Exchange. See logs" });
    })
  }

  // send token to an address on managetoken.html
  sendToken() {
    var that = this
    var amount = that.state.sendAmount;
    var receiver = that.state.sendAddres;

    that.setState({ loadingSendToken: true, managementTokenStatus: "Initiating transaction...please wait" });

    var tokenInstance;
    TokenContract.deployed().then(function (instance) {
      tokenInstance = instance;
      return tokenInstance.transfer(receiver, amount, { from: that.state.account });
    }).then(function (txResults) {
      that.setState({ loadingSendToken: false, managementTokenStatus: "Transfer complete!" });
      that.updateTokenBalance();
    }).catch(function (e) {
      console.log(e);
      that.setStatus({ loadingSendToken: false, managementTokenStatus: "Error sending coin. See log." });
    })
  }

  buyToken() {
    var that = this;

    var symbolName = that.state.tokenNameToBuy;
    var priceInWei = that.state.tokenPriceToBuy
    var amount = that.state.tokenAmountToBuy

    that.setState({ tokenTradingStatus: "Attempting to buy token on Exchange" });

    var exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.buyToken(symbolName, priceInWei, amount, { from: that.state.account });
    }).then(function (txResult) {
      console.log(txResult);
      if (txResult.logs[0].event === "buyOfferCreated") {
        that.setState({ tokenTradingStatus: "Buy order succesfully created" });
      }
      if (txResult.logs[0].event === "buyOrderFulfilled") {
        that.setState({ tokenTradingStatus: "Token(s) successfully purchased" });
      }
      that.updateBalanceExchange();
    }).catch(function (e) {
      console.log(e);
      that.setState({ tokenTradingStatus: "There was an error attempting to create a buy order" });
    })
  }

  // sell token on Exchange on trading.html
  sellToken() {
    var that = this;

    var symbolName = that.state.tokenNameToSell;
    var priceInWei = that.state.tokenPriceToSell;
    var amount = that.state.tokenAmountToSell;

    that.setState({ tokenTradingStatus: "Attempting to sell token on Exchange" });

    var exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.sellToken(symbolName, priceInWei, amount, { from: that.state.account });
    }).then(function (txResult) {
      console.log(txResult);
      if (txResult.logs[0].event === "sellOfferCreated") {
        that.setState({ tokenTradingStatus: "Buy order succesfully created" });
      }
      if (txResult.logs[0].event === "sellOrderFulfilled") {
        that.setState({ tokenTradingStatus: "Token(s) successfully purchased" });
      }
      that.updateBalanceExchange();
    }).catch(function (e) {
      console.log(e);
      that.setState({ tokenTradingStatus: "There was an error attempting to create a sell order" });
    })
  }

  // display outstanding buy and sell orders on trading.html
  updateOrderBook() {
    var that = this
    let exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.getBuyOrderBook(that.state.tokenName, { from: that.state.account });
    }).then(function (orderbook) {
      if (orderbook[0].length === 0) {
        that.setState({ buyOrders: 'No buy orders' })
      }
      for (var i = 0; i < orderbook[0].length; i++) {
        that.setState({ buyOrders: `buy ${orderbook[1][i]}@${orderbook[0][i]}` })
      }
      return exchangeInstance.getSellOrderBook(that.state.tokenName, { from: that.state.account });
    }).then(function (orderbook) {
      if (orderbook[0].length === 0) {
        that.setState({ sellOrders: 'No sell orders' })
      }
      for (var i = 0; i < orderbook[0].length; i++) {
        that.setState({ buyOrders: `Sell ${orderbook[1][i]}@${orderbook[0][i]}` })
      }
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

  handleChangeEther = (e, { name, value }) => {
    if (isFinite(value) && value >= 0) {
      this.setState({ [name]: value, [name + "FieldError"]: false, [name + "Button"]: false })
    }
    else {
      this.setState({ [name + "FieldError"]: true, [name + "Button"]: true })
    }
  }
  handleChange = (e, { name, value }) => {
    if (isFinite(value)) {
      this.setState({ [name]: value })
    }
    else {
      this.setState({ [name + "FieldError"]: true })
    }
  }


  handleSend = () => {
    this.sendToken()
  }

  handleTokenAllowance = () => {
    const { allowanceTokenLoading } = this.state
    this.allowanceToken()

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
        <LandingPage metaMask={this.state.web3}
          address={this.state.account} network={this.state.network}
          etherBalance={this.state.etherBalance}
          tokenBalanceInExchange={this.state.balanceTokenInExchange}
          tokenBalance={this.state.balanceToken}
          exchangeEther={this.state.balanceEth} />
        <ExchangeManagement managementStatus={this.state.managementStatus}
          ethLoading={this.state.ethLoading} balanceEth={this.state.balanceEth}
          handleTokenDeposit={this.handleTokenDeposit.bind(this)}
          handleSubmitDeposit={this.handleSubmitDeposit.bind(this)}
          handleSubmitWithdraw={this.handleSubmitWithdraw.bind(this)}
          amountDepositFieldError={this.state.amountDepositFieldError}
          amountDeposit={this.state.amountDeposit}
          handleChange={this.handleChange.bind(this)}
          ethLoading2={this.state.ethLoading2}
          amountWithdraw={this.state.amountWithdraw}
          amountWithdrawFieldError={this.state.amountWithdrawFieldError}
          handleSubmitWithdraw={this.handleSubmitWithdraw.bind(this)}
          balanceTokenInExchange={this.state.balanceTokenInExchange}
          handleTokenWithdraw={this.handleTokenWithdraw.bind(this)}
          handleChangeLetters={this.handleChangeLetters.bind(this)}
          etherBalance={this.state.etherBalance}
          amountDepositButton={this.state.amountDepositButton}
          amountWithdrawButton={this.state.amountWithdrawButton}
          handleChangeEther={this.handleChangeEther.bind(this)}
        />
        <Erc20Management handleChange={this.handleChange.bind(this)}
          handleLetterChange={this.handleChangeLetters.bind(this)}
          allowanceToken={this.allowanceToken.bind(this)}
          address={this.state.tokenAddress} exchangeAddress={this.state.exchangeAddress}
          addToken={this.addTokenToExchange.bind(this)}
          status={this.state.managementTokenStatus}
          tokenAmount={this.state.balanceToken}
          loading={this.state.allowanceTokenLoading}
          handleTokenAllowance={this.handleTokenAllowance.bind(this)}
          tokenAmountAllowance={this.state.tokenAmountAllowance}
          handleSend={this.handleSend.bind(this)}
          loadingSend={this.state.loadingSendToken}
          loadingAdd={this.state.loadingAddToken}
          tokenName={this.state.tokenName} />
        <TokenTrading
          etherBalance={this.state.balanceEth}
          tokenBalanceInExchange={this.state.balanceTokenInExchange}
          status={this.state.tokenTradingStatus}
          tokenNameToBuy={this.state.tokenNameToBuy}
          tokenAmountToBuy={this.state.tokenAmountToBuy}
          tokenNameToSell={this.state.tokenNameToSell}
          tokenAmountToSell={this.state.tokenAmountToSell}
          handleChange={this.handleChange.bind(this)}
          handleLetterChange={this.handleChangeLetters.bind(this)}
          buyToken={this.buyToken.bind(this)}
          sellToken={this.sellToken.bind(this)}
          sellOrders={this.state.sellOrders}
          buyOrders={this.state.buyOrders}
        />
        <Footer />
      </div>
    );
  }
}

export default App
