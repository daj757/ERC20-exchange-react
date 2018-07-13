import account from "../../public/static/images/account.jpg"
import  exchange1 from "../../public/static/images/exchange1.jpg"
import mask from "../../public/static/images/metamask.png"
import React, { Component } from 'react'
import {
    Image,
    Header,
    Responsive,
    Card,
    Message
} from 'semantic-ui-react'


export default class LandingPage extends Component {
    state = { visible: true }
    handleDismiss = () => {
        this.setState({ visible: false})
    
      }
    
    render() {
        const web3 = this.props.metaMask;
        const network = this.props.network.toString()
        let card;
        let MessageNetwork;
        if(network === "Rinkeby test network."|| this.state.visible === false){
            MessageNetwork = null
        }
        else {
            MessageNetwork = <Message info onDismiss={this.handleDismiss} style={{ position: 'absolute',
            top: '10%',
            left: '4%',
    }}>To interact with this smart contract you must be logged onto the Rinkeby test network.</Message>
        }
        if(web3) {
            card = <Card
            id="card"
            style={{
                position: 'absolute',
                top: '14%',
                left: '65%',
                wordWrap: 'break-word',
                marginBottom: "20px" 
            }}>
            <Image src={account} />
            <Card.Content>
                <Card.Header>Welcome: {this.props.address}</Card.Header>
                <Card.Meta>
                    <p>You are currently on the {this.props.network} </p>
                    <p>You have {this.props.etherBalance} Ether in your account. </p>
                    <p>You have {this.props.exchangeEther} Ether in the exchange. </p>
                    <p> You have {this.props.tokenBalance} tokens in your account.</p>
                    <p> You have {this.props.tokenBalanceInExchange} tokens in the exchange.</p>
                </Card.Meta>
            </Card.Content>
        </Card>
        }
        else{
            card =  <Card
            style={{
                position: 'absolute',
                top: '20%',
                left: '65%',
                opacity: '0.7',
                wordWrap: 'break-word',
                marginBottom: "20px"
            }}>
            <Image src={mask} />
            <Card.Content>
                <Card.Header>This site is deployed on Ethereum network.</Card.Header>
                <Card.Meta>
                    <p>Please install <a href="https://metamask.io/" >MetaMask</a> to interact with this site.</p>
                </Card.Meta>
            </Card.Content>
        </Card>
        }
        return(
        <div
            id="main"
            style={{
                position: 'relative',
            }}
        >
            <Image src={exchange1} fluid  />
            <Responsive minWidth={900}>
            {MessageNetwork}
            {card}
                <Header
                    size="huge"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '50%',
                        textTransform: 'uppercase',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        
                        textAlign: 'center',
                        fontSize: '55px',
                        fontFamily: 'Russo One, sans-serif',
                    }}
                >
                    Welcome <br /><div style={{ textAlign: 'center' }}>to the</div> Exchange
    
            </Header>

            </Responsive>
            <Responsive maxWidth={899} minWidth={768}>
            {MessageNetwork}
                <Header
                    size="huge"
                    style={{
                        position: 'absolute',
                        top: '80%',
                        left: '50%',
                        textTransform: 'uppercase',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        opacity: '0.8',
                        textAlign: 'center',
                        fontSize: '45px',
                        fontFamily: 'Russo One, sans-serif',
                        marginTop: '10px',
                    }}
                >
                   The Exchange
    
            </Header>
            </Responsive>
            <Responsive {...Responsive.onlyMobile}>
                <Header
                    size="small"
                    style={{
                        position: 'absolute',
                        top: '85%',
                        left: '50%',
                        textTransform: 'uppercase',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        opacity: '0.8',
                        textAlign: 'center',
                        fontSize: '15px',
                        fontFamily: 'Russo One, sans-serif',
                        
                    }}
                >
                   Decentralized Token Exchange
    
            </Header>
            </Responsive>
        </div>
        )
    }
}