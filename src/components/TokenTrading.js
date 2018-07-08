import React from 'react'
import {
    Segment,
    Header,
    Responsive,
    Container,
    Grid,
    Form,
    Message
} from 'semantic-ui-react'
import tokens from "../../public/static/images/coins.jpg"

function TradeMessage(props) {
    switch (props.tradeState) {
        case "info":
            return <Message info>
                <Message.Header>{props.status}</Message.Header>
                <p>This may take a few moments </p>
            </Message>
        case "success":
            return <Message positive>
                <Message.Header>{props.status}</Message.Header>
            </Message>
        case "error":
            return <Message negative>
                <Message.Header>{props.status}</Message.Header>

            </Message>
        default:
            return null
    }
}
function TradeOrders(props) {
    if (props.tradeOrders.length > 0) {
        const tradeOrders = props.tradeOrders
        const tradeList = tradeOrders.map((order, i) =>
            <li key={i}>{order}</li>
        );
        return (
            <ul>{tradeList}</ul>
        )
    }
    else {
        return <div>No {props.name} orders</div>
    }
}




export default function TokenTrading(props) {

    return (
        <div>
            <Responsive minWidth={768}>
                <div style={{ backgroundImage: `url(${tokens})`, backgroundSize: "cover" }} id="trading">
                    <Container>
                        <Header style={{ paddingBottom: "25px" }} as="h1" textAlign="center">Token Trading</Header>
                        <Grid centered columns={4}>
                            <Grid.Column>
                                <Segment circular style={{ width: 175, height: 175 }}>
                                    <Header as='h2'>
                                        Ether
        <Header.Subheader>{parseFloat(props.etherBalance).toFixed(4)}</Header.Subheader>
                                    </Header>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment circular inverted style={{ width: 175, height: 175 }}>
                                    <Header as='h2' inverted>
                                        Tokens
        <Header.Subheader>{props.tokenBalanceInExchange.toFixed(2)}</Header.Subheader>
                                    </Header>
                                </Segment>
                            </Grid.Column>
                        </Grid>
                        <TradeMessage status={props.status} tradeState={props.tradeState} />

                        <Grid>
                            <Grid.Row columns={2} style={{ marginTop: "20px" }}>
                                <Grid.Column>
                                    <Header as="h3" >Buy Token</Header>
                                    <Form loading={props.buyLoading} onSubmit={props.buyToken}>
                                        <Form.Input
                                            required
                                            placeholder='Token Name'
                                            name='tokenNameToBuy'
                                            value={props.tokenNameToBuy}
                                            onChange={props.handleLetterChange}
                                        />
                                        <Form.Input
                                            required
                                            error={props.tokenPriceToBuyFieldError}
                                            placeholder='Price (in wei)'
                                            name='tokenPriceToBuy'
                                            value={props.tokenPriceToBuy}
                                            onChange={props.handleChangeEther}
                                        />
                                        <Form.Input
                                            required
                                            error={props.tokenAmountToBuyFieldError}
                                            placeholder="Amount to buy"
                                            name="tokenAmountToBuy"
                                            value={props.tokenAmountToBuy}
                                            onChange={props.handleChangeEther}
                                        />
                                        <Form.Button color='green' labelPosition='left' icon='add' content='Buy Token' />

                                    </Form>
                                    <div style={{ marginTop: "40px" }}>
                                        <Header as='h2' attached='top'>
                                            Buy Orders
    </Header>
                                        <Segment attached>
                                            <TradeOrders name="Buy" tradeOrders={props.buyOrders} />
                                        </Segment>
                                    </div>
                                </Grid.Column>
                                <Grid.Column>
                                    <Header as="h3" >Sell Token</Header>
                                    <Form loading={props.sellLoading} onSubmit={props.sellToken}>
                                        <Form.Input
                                            required
                                            placeholder='Token Name'
                                            name='tokenNameToSell'
                                            value={props.tokenNameToSell}
                                            onChange={props.handleLetterChange}
                                        />
                                        <Form.Input
                                            required
                                            error={props.tokenPriceToSellFieldError}
                                            placeholder='Price (in wei)'
                                            name='tokenPriceToSell'
                                            value={props.tokenPriceToSell}
                                            onChange={props.handleChangeEther}
                                        />
                                        <Form.Input

                                            required
                                            error={props.tokenAmountToSellFieldError}
                                            placeholder="Amount to sell"
                                            name="tokenAmountToSell"
                                            value={props.tokenAmountToSell}
                                            onChange={props.handleChangeEther}
                                        />
                                        <Form.Button color='red' labelPosition='left' icon='minus' content='Sell Token' />
                                    </Form>
                                    <div style={{ marginTop: "40px" }}>
                                        <Header as='h2' attached='top'>
                                            Sell Orders
    </Header>
                                        <Segment attached>
                                            <TradeOrders name="Sell" tradeOrders={props.sellOrders} />
                                        </Segment>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </div>
            </Responsive>
            <Responsive {...Responsive.onlyMobile}>
            </Responsive>
        </div>

    )
}
