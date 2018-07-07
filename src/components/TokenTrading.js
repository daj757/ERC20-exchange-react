import React from 'react'
import {
    Image,
    Segment,
    Header,
    Input,
    Responsive,
    Container,
    Card,
    Icon,
    Divider,
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
export default function TokenTrading(props) {

    return (
        <div style={{ backgroundImage: `url(${tokens})`, backgroundSize: "cover" }} id="trading">
            <Container>
                <Header as="h1" textAlign="center">Token Trading</Header>
                <Segment color="blue">
                    <Header as='h4' textAlign='center'>
                        {`You have ${props.etherBalance} Ether in the exchange.`}
                    </Header>
                    <Header as='h4' textAlign='center'>
                        {`You have ${props.tokenBalanceInExchange} tokens in the Exchange`}
                    </Header>
                </Segment>
                <TradeMessage status={props.status} tradeState={props.tradeState} />

                <Grid>
                    <Grid.Row columns={2} style={{ marginTop: "20px" }}>
                        <Grid.Column>
                            <Header as="h3" >Buy Token</Header>
                            <Form loading={props.buyLoading} onSubmit={props.buyToken}>
                                <Form.Input
                                    placeholder='Token Name'
                                    name='tokenNameToBuy'
                                    value={props.tokenNameToBuy}
                                    onChange={props.handleLetterChange}
                                />
                                <Form.Input
                                    placeholder="Token Amount"
                                    name="tokenAmountToBuy"
                                    value={props.tokenAmountToBuy}
                                    onChange={props.handleChange}
                                />
                                <Form.Button color='green' labelPosition='left' icon='add' content='Buy Token' />

                            </Form>
                            <div style={{ marginTop: "40px" }}>
                                <Header as='h2' attached='top'>
                                    Buy Orders
    </Header>
                                <Segment attached>
                                    {props.buyOrders}
                                </Segment>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <Header as="h3" >Sell Token</Header>
                            <Form loading={props.sellLoading} onSubmit={props.sellToken}>
                                <Form.Input
                                    placeholder='Token Name'
                                    name='tokenNameToSell'
                                    value={props.tokenNameToSell}
                                    onChange={props.handleLetterChange}
                                />
                                <Form.Input
                                    placeholder="Amount to sell."
                                    name="tokenAmountToSell"
                                    value={props.tokenAmountToSell}
                                    onChange={props.handleChange}
                                />
                                <Form.Button color='red' labelPosition='left' icon='minus' content='Sell Token' />
                            </Form>
                            <div style={{ marginTop: "40px" }}>
                                <Header as='h2' attached='top'>
                                    Sell Orders
    </Header>
                                <Segment attached>
                                    {props.sellOrders}
                                </Segment>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </Container>
        </div>
    )
}
