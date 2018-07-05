import exchange from "../../public/static/images/exchange.jpg"
import user from "../../public/static/images/user.jpg"
import mask from "../../public/static/images/metamask.png"
import React, { Component } from 'react'
import {
    Image,
    Header,
    Responsive,
    Container,
    Card,
    Icon
} from 'semantic-ui-react'

export default class LandingPage extends Component {
    
    render() {
        const web3 = this.props.metaMask;
        let card;
        if(web3) {
            card = <Card
            style={{
                position: 'absolute',
                top: '25%',
                right: '65%',
                opacity: '0.7',
                wordWrap: 'break-word'
            }}>
            <Image src={user} />
            <Card.Content>
                <Card.Header>Welcome: {this.props.address}</Card.Header>
                <Card.Meta>
                    <p>You are currently on the {this.props.network} </p>
                    <p>You have {this.props.etherBalance} Ether. </p>
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
                top: '25%',
                right: '65%',
                opacity: '0.7',
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
            id="about-us"
            style={{
                position: 'relative',
            }}
        >
            <Image src={exchange} fluid style={{ marginBottom: '4px' }} />
            <Responsive minWidth={700}>
            {card}
                <Header
                    size="huge"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '75%',
                        textTransform: 'uppercase',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        opacity: '0.7',
                        textAlign: 'right',
                        fontSize: '55px',
                        fontFamily: 'Russo One, sans-serif',
                    }}
                >
                    Welcome <br /><div style={{ textAlign: 'center' }}>to the</div> Exchange
    
            </Header>

            </Responsive>
            <Responsive maxWidth={699}>
                <Header
                    size="huge"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '75%',
                        textTransform: 'uppercase',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        opacity: '0.6',
                        textAlign: 'center',
                        fontSize: '55px',
                        fontFamily: 'Russo One, sans-serif',
                        marginTop: '10px',
                    }}
                >
                    Lockhart
    
            </Header>
            </Responsive>
        </div>
        )
    }
}