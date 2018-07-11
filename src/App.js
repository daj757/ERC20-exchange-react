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

import { default as contract } from 'truffle-contract';
var ExchangeContract = contract(exchange_artifact);
var TokenContract = contract(token_artifact);


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      account: null,
      managementStatus: "",
      managementState: "",
      tokenState: "",
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
      tokenAmountDepositFieldError: false,
      tokenAmountWithdrawFieldError: false,
      tokenAmountAllowanceFieldError: false,
      tokenAmountToBuyFieldError: false,
      tokenAmountToSellFieldError: false,
      sendAmountFieldError: false,
      tokenDepositLoading: false,
      tokenWithdrawLoading: false,
      allowanceTokenLoading: false,
      loadingSendToken: false,
      loadingAddToken: false,
      tokenAmountDeposit: "",
      tokenName: "PLAY",
      tokenName1: "PLAY",
      tokenName2: "",
      tokenName3: "",
      tokenAmountWithdraw: "",
      exchangeAddress: "",
      exchangeAddressInput: "",
      tokenAddress: "",
      tokenAddressInput: "",
      tokenAmountAllowance: "",
      sendAmount: "",
      sendAddress: "",
      tokenTradingStatus: "",
      tradeState: "",
      tokenNameToBuy: "",
      tokenAmountToBuy: "",
      tokenNameToSell: "",
      tokenAmountToSell: "",
      sellOrders: [],
      buyOrders: [],
      buyLoading: false,
      sellLoading: false,
      tokenPriceToBuy: "",
      tokenPriceToSell: "",
      tokenPriceToBuyFieldError: false,
      tokenPriceToSellFieldError: false,
      tokenAllowanceAmount: 0,
      myToken: "PLAY",
      buyWarning: true,
      sellWarning: true

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
      that.setState({ tokenState: "error", managementTokenStatus: "Error getting balance. See log." })
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
      return exchangeInstance.getBalance.call(that.state.myToken, { from: that.state.account });
    }).then(function (balance) {
      that.setState({ balanceTokenInExchange: balance.toNumber() })
      if (that.state.balanceTokenInExchange > 0) {
        that.setState({ sellWarning: false })
      }
      else {
        that.setState({ sellWarning: true })
      }
      return exchangeInstance.getEthBalanceInWei.call({ from: that.state.account });
    }).then(function (balance) {
      that.setState({ balanceEth: that.state.web3.fromWei(balance.toNumber(), "ether") })
      if (that.state.balanceEth > 0) {
        that.setState({ buyWarning: false })
      }
      else {
        that.setState({ buyWarning: true })
      }
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
          this.setState({ network: "the Mainnet." })
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
    this.setState({ managementState: "info", managementStatus: "Initializing deposit of Ether into your account on the Exchange... Please wait" });
    this.setState({ ethLoading: true })
    var exchangeInstance;
    var that = this;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.depositEther({ from: that.state.account, to: exchangeInstance.address, value: that.state.web3.toWei(that.state.amountDeposit, "ether") });
    }).then(function (txResult) {

      that.updateBalanceExchange();
      that.setState({ managementState: "success", managementStatus: `Ether successfully deposited into your account on the Exchange. Tx id ${txResult.tx}` });
      that.setState({ amountDeposit: "", ethLoading: false })
    }).catch(function (e) {
      console.log(e);
      that.setState({ managementState: "error", managementStatus: `There was an error depositing Ether into your account on the Exchange. ${e.message}`, ethLoading: false });
    })
  }
  //withdraw Ether from exchange function
  withdrawEthFromExchange() {
    var that = this;

    that.setState({ managementState: "info", managementStatus: "Initializing withdraw of Ether from your account on the Exchange... Please wait", ethLoading2: true });

    var exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.withdrawEther(that.state.web3.toWei(that.state.amountWithdraw, "ether"), { from: that.state.account });
    }).then(function (txResult) {

      that.updateBalanceExchange();
      that.setState({ managementState: "success", managementStatus: `Ether successfully withdrawn from your account on the Exchange. TX id ${txResult.tx}` });
      that.setState({ amountWithdraw: "", ethLoading2: false })
    }).catch(function (e) {
      console.log(e);
      that.setState({ managementState: "error", managementStatus: `There was an error withdrawing Ether from your account on the Exchange. ${e.message}`, ethLoading2: false });
    })
  }
  //Deposit token into exchange

  depositTokenIntoExchange() {
    let symbolName = this.state.tokenName;
    let amount = parseInt(this.state.tokenAmountDeposit, 10);
    var that = this;

    that.setState({ managementState: "info", managementStatus: "Initiating deposit of Token into your account on the Exchange....Please wait", tokenDepositLoading: true });
    var exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.depositToken(symbolName, amount, { from: that.state.account });
    }).then(function (txResult) {

      that.updateBalanceExchange();
      that.setState({ tokenAmountDeposit: "", tokenName: "", tokenAllowanceAmount: that.state.tokenAllowanceAmount - Number(amount), managementState: "success", managementStatus: `Token(s) successfully deposited into your account on the Exchange. Tx: ${txResult.tx}`, tokenDepositLoading: false });
    }).catch(function (e) {
      console.log(e);
      that.setState({ managementState: "error", managementStatus: "There was an error depositing Token into your account on the Exchange", tokenDepositLoading: false });
    })
  }

  // withdraw token(s) from Exchange on index.html
  withdrawTokenFromExchange() {
    let symbolName2 = this.state.tokenName2
    let amount2 = parseInt(this.state.tokenAmountWithdraw, 10)
    var that = this;
    that.setState({
      managementState: "info",
      managementStatus: "Initiating withdrawal of Token from your account on the Exchange...Please wait",
      tokenWithdrawLoading: true
    });

    var exchangeInstance2;
    ExchangeContract.deployed().then(function (instance) {

      exchangeInstance2 = instance;
      return exchangeInstance2.withdrawToken(symbolName2, amount2, { from: that.state.account })
    })
      .then(function (txResult) {

        that.updateBalanceExchange();
        that.setState({ tokenName2: "", tokenAmountWithdraw: "", managementState: "success", managementStatus: "Token(s) successfully withdrawn from your account on the Exchange", tokenWithdrawLoading: false });
      })
      .catch(function (error) {
        console.log(error);
        that.setState({ managementState: "error", managementStatus: "There was an error withdrawing Token(s) from your account on the Exchange", tokenWithdrawLoading: false });
      })
  }

  // allow an address to receive tokens from FixedSupplyToken on managetoken.html
  allowanceToken() {
    var that = this;
    let amount = that.state.tokenAmountAllowance;
    let receiver = that.state.exchangeAddress;
    that.setState({ tokenState: "info", allowanceTokenLoading: true, managementTokenStatus: "Initiating allowance of token...please wait" });
    let tokenInstance;
    TokenContract.deployed().then(function (instance) {

      tokenInstance = instance;
      return tokenInstance.approve(receiver, amount, { from: that.state.account });
    }).then(function (txResults) {
      that.setState({ tokenAmountAllowance: "", tokenAllowanceAmount: that.state.tokenAllowanceAmount += Number(amount), tokenState: "success", allowanceTokenLoading: false, managementTokenStatus: `Token allowance accepted. You have allowed ${amount} to be deposited into the exchange. Tx: ${txResults.tx}` });

    }).catch(function (e) {
      console.log(e);
      that.setState({ tokenState: "error", allowanceTokenLoading: false, managementTokenStatus: "Token allowance rejected" });
    })
  }
  //Add ERC20 token to exchange
  addTokenToExchange() {
    var that = this;
    let nameOfToken = this.state.tokenName1;
    let addressOfToken = this.state.tokenAddress;

    that.setState({ tokenState: "info", loadingAddToken: true, managementTokenStatus: "Initiating addition of Token to Exchange...please wait" })

    var exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.addToken(nameOfToken, addressOfToken, { from: that.state.account });
    }).then(function (txResult) {

      that.updateTokenBalance()
      that.setState({ tokenState: "success", loadingAddToken: false, managementTokenStatus: "Token succesfully added to Exchange" });
    }).catch(function (e) {
      console.log(e);
      that.setState({ tokenState: "success", loadingAddToken: false, managementTokenStatus: "There was an error adding Token to the Exchange. See logs" });
    })
  }

  // send token to an address on managetoken.html
  sendToken() {
    var that = this
    var amount = that.state.sendAmount;
    var receiver = that.state.sendAddres;

    that.setState({ tokenState: "info", loadingSendToken: true, managementTokenStatus: "Initiating transaction...please wait" });

    var tokenInstance;
    TokenContract.deployed().then(function (instance) {
      tokenInstance = instance;
      return tokenInstance.transfer(receiver, amount, { from: that.state.account });
    }).then(function (txResults) {
      that.setState({ tokenState: "success", loadingSendToken: false, managementTokenStatus: "Transfer complete!" });
      that.updateTokenBalance();
    }).catch(function (e) {
      console.log(e);
      that.setState({ tokenState: "error", loadingSendToken: false, managementTokenStatus: "Error sending coin. See log." });
    })
  }

  buyToken() {
    var that = this;

    let symbolName1 = that.state.tokenNameToBuy;
    let priceInWei1 = parseInt(that.state.tokenPriceToBuy, 10)
    let amount1 = parseInt(that.state.tokenAmountToBuy, 10)

    that.setState({ buyLoading: true, tradeState: "info", tokenTradingStatus: "Attempting to buy token(s) on Exchange" });

    let exchangeInstance1;
    ExchangeContract.deployed().then(function (instance) {

      exchangeInstance1 = instance;

      return exchangeInstance1.buyToken(symbolName1, priceInWei1, amount1, { from: that.state.account });
    }).then(function (txResult) {

      let tx = txResult.tx
      if (txResult.logs[0].event === "LimitBuyOrderCreated") {
        that.setState({ buyLoading: false, tradeState: "success", tokenTradingStatus: `Buy order succesfully created. Tx: ${tx}` });
      }
      if (txResult.logs[0].event === "SellOrderFulfilled") {

        that.setState({ buyLoading: false, tradeState: "success", tokenTradingStatus: `Token(s) successfully purchased. Tx: ${tx}` });
      }
      that.setState({ tokenPriceToBuy: "", tokenNameToBuy: "", tokenAmountToBuy: "" });
      that.updateBalanceExchange();
      that.updateOrderBook()
    }).catch(function (e) {
      console.log(e);
      that.setState({ buyLoading: false, tradeState: "error", tokenTradingStatus: "There was an error attempting to create a buy order" });
    })
  }

  // sell token on Exchange on trading.html
  sellToken() {
    var that = this;

    let symbolName = that.state.tokenNameToSell;
    let priceInWei = parseInt(that.state.tokenPriceToSell, 10);
    let amount = parseInt(that.state.tokenAmountToSell, 10);

    that.setState({ sellLoading: true, tradeState: "info", tokenTradingStatus: "Attempting to sell token on Exchange" });

    let exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;

      return exchangeInstance.sellToken(symbolName, priceInWei, amount, { from: that.state.account });
    }).then(function (txResult) {

      let tx = txResult.tx
      if (txResult.logs[0].event === "LimitSellOrderCreated") {
        that.setState({ sellLoading: false, tradeState: "success", tokenTradingStatus: `Sell order created. Tx: ${tx}` });
      }
      if (txResult.logs[0].event === "SellOrderFulfilled") {
        that.setState({ sellLoading: false, tradeState: "success", tokenTradingStatus: `Token(s) successfully sold. Tx: ${tx} ` });
      }
      that.setState({ tokenPriceToSell: "", tokenNameToSell: "", tokenAmountToSell: "" });
      that.updateBalanceExchange();
      that.updateOrderBook()
    }).catch(function (e) {
      console.log(e);
      that.setState({ tokenPriceToSell: "", tokenNameToSell: "", sellLoading: false, tradeState: "error", tokenAmountToSell: "", tokenTradingStatus: "There was an error attempting to create a sell order" });
    })
  }
  //hardcoded mytoken updates for getOrderBook and getSellBook not dynamic expecting only Play tokens in exchange
  // display outstanding buy and sell orders on trading.html
  updateOrderBook() {
    let that = this
    that.setState({ buyOrders: [], sellOrders: [] })
    let exchangeInstance;
    ExchangeContract.deployed().then(function (instance) {
      exchangeInstance = instance;
      return exchangeInstance.getBuyOrderBook(that.state.myToken, { from: that.state.account });
    }).then(function (orderbook) {

      if (orderbook[0].length === 0) {

      }

      for (let i = 0; i < orderbook[0].length; i++) {
        that.setState({ buyOrders: that.state.buyOrders.concat(`Buy ${orderbook[1][i]} ${that.state.tokenName} @ ${orderbook[0][i]} wei`) })

      }
      return exchangeInstance.getSellOrderBook(that.state.myToken, { from: that.state.account });
    }).then(function (orderbook) {

      if (orderbook[0].length === 0) {

      }
      for (let i = 0; i < orderbook[0].length; i++) {
        that.setState({ sellOrders: that.state.sellOrders.concat(`Sell ${orderbook[1][i]} ${that.state.tokenName} @ ${orderbook[0][i]} wei`) })
      }
    })
  }

  printImportantInformation() {
    let that = this
    ExchangeContract.deployed().then(function (instance) {
      that.setState({ exchangeAddress: instance.address, exchangeAddressInput: instance.address });
    })
    TokenContract.deployed().then(function (instance) {
      that.setState({ tokenAddress: instance.address, tokenAddressInput: instance.address });
    })

  }

  //Event handlers

  handleChangeEther = (e, { name, value }) => {
    if (isFinite(value) && value >= 0) {
      this.setState({ [name]: value, [name + "FieldError"]: false })
    }
    else {
      this.setState({ [name + "FieldError"]: true })
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

    this.allowanceToken()

  }

  handleChangeLetters = (e, { name, value }) => {
    this.setState({ [name]: value })
  }
  handleSubmitDeposit = () => {

    this.depositEtherIntoExchange();

  }
  handleSubmitWithdraw = () => {

    this.withdrawEthFromExchange();

  }
  handleTokenDeposit = () => {

    this.depositTokenIntoExchange();
  }
  handleTokenWithdraw = () => {

    this.withdrawTokenFromExchange();
  }

  handleTokenAddition = () => {
    this.addTokenToExchange()
  }

  handleBuyToken = () => {
    this.buyToken()
  }

  handleSellToken = () => {
    this.sellToken()
  }

  render() {
    return (
      <div className="App" >
        <NavBar />
        <LandingPage metaMask={this.state.web3}
          address={this.state.account} network={this.state.network}
          etherBalance={this.state.etherBalance}
          tokenBalanceInExchange={this.state.balanceTokenInExchange}
          tokenBalance={this.state.balanceToken}
          exchangeEther={this.state.balanceEth}
        />
        <ExchangeManagement managementState={this.state.managementState}
          managementStatus={this.state.managementStatus}
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
          tokenAmountDepositFieldError={this.state.tokenAmountDepositFieldError}
          tokenAmountWithdrawFieldError={this.state.tokenAmountWithdrawFieldError}
          balanceTokenInExchange={this.state.balanceTokenInExchange}
          handleTokenWithdraw={this.handleTokenWithdraw.bind(this)}
          handleChangeLetters={this.handleChangeLetters.bind(this)}
          etherBalance={this.state.etherBalance}
          amountDepositButton={this.state.amountDepositButton}
          amountWithdrawButton={this.state.amountWithdrawButton}
          handleChangeEther={this.handleChangeEther.bind(this)}
          tokenDepositLoading={this.state.tokenDepositLoading}
          tokenWithdrawLoading={this.state.tokenWithdrawLoading}
          tokenAmountWithdraw={this.state.tokenAmountWithdraw}
          tokenAmountDeposit={this.state.tokenAmountDeposit}
          tokenAllowanceAmount={this.state.tokenAllowanceAmount}
          tokenName3={this.state.tokenName3}
          tokenName2={this.state.tokenName2}
        />
        <Erc20Management handleChange={this.handleChange.bind(this)}
          handleLetterChange={this.handleChangeLetters.bind(this)}
          allowanceToken={this.allowanceToken.bind(this)}
          address={this.state.tokenAddress} exchangeAddress={this.state.exchangeAddress}
          handleTokenAddition={this.handleTokenAddition.bind(this)}
          status={this.state.managementTokenStatus}
          tokenAmount={this.state.balanceToken}
          loading={this.state.allowanceTokenLoading}
          handleTokenAllowance={this.handleTokenAllowance.bind(this)}
          tokenAmountAllowance={this.state.tokenAmountAllowance}
          handleSend={this.handleSend.bind(this)}
          loadingSend={this.state.loadingSendToken}
          loadingAdd={this.state.loadingAddToken}
          tokenName1={this.state.tokenName1}
          tokenState={this.state.tokenState}
          tokenAmountAllowanceFieldError={this.state.tokenAmountAllowanceFieldError}
          sendAmountFieldError={this.state.sendAmountFieldError}
          handleChangeEther={this.handleChangeEther.bind(this)}
          sendAmount={this.state.sendAmount}
          exchangeAddressInput={this.state.exchangeAddressInput}
          tokenAddressInput={this.state.tokenAddressInput} />
        <TokenTrading
          etherBalance={this.state.balanceEth}
          tokenBalanceInExchange={this.state.balanceTokenInExchange}
          tokenState={this.state.tokenState}
          status={this.state.tokenTradingStatus}
          tokenNameToBuy={this.state.tokenNameToBuy}
          tokenAmountToBuy={this.state.tokenAmountToBuy}
          tokenNameToSell={this.state.tokenNameToSell}
          tokenAmountToSell={this.state.tokenAmountToSell}
          handleChange={this.handleChange.bind(this)}
          handleLetterChange={this.handleChangeLetters.bind(this)}
          handleChangeEther={this.handleChangeEther.bind(this)}
          tokenAmountToSellFieldError={this.state.tokenAmountToSellFieldError}
          tokenAmountToBuyFieldError={this.state.tokenAmountToBuyFieldError}
          buyToken={this.handleBuyToken.bind(this)}
          sellToken={this.handleSellToken.bind(this)}
          sellOrders={this.state.sellOrders}
          buyOrders={this.state.buyOrders}
          tradeState={this.state.tradeState}
          buyLoading={this.state.buyLoading}
          sellLoading={this.state.sellLoading}
          tokenPriceToBuy={this.state.tokenPriceToBuy}
          tokenPriceToSell={this.state.tokenPriceToSell}
          tokenPriceToSellFieldError={this.state.tokenPriceToSellFieldError}
          tokenPriceToBuyFieldError={this.state.tokenPriceToBuyFieldError}
          buyWarning={this.state.buyWarning}
          sellWarning={this.state.sellWarning}

        />
        <Footer />
      </div>
    );
  }
}

export default App
