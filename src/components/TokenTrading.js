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
    Form
} from 'semantic-ui-react'
export default function TokenTrading(props) {

    return (
        <div>
            <Container>
                <Header as="h1" textAlign="center">Token Trading</Header>
            
                {props.status}
                <Segment color="blue">
                    <Header as='h4' textAlign='center'>
                        {`You have ${props.etherBalance} Ether in the exchange.`}
                    </Header>
                    <Header as='h4' textAlign='center'>
                        {`You have ${props.tokenBalanceInExchange} tokens in the Exchange`}
                    </Header>
                </Segment>

                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Header as="h3" >Buy Token</Header>
                            <Form loading={props.loadingAdd} onSubmit={props.buyToken}>
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
                            <div style={{ marginTop: "20px" }}>
                                <Header as='h2' attached='top'>
                                    Buy Orders
    </Header>
                                <Segment attached>
                                    {props.buyOrders}
                                </Segment>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <Header as="h4" >Sell Token</Header>
                            <Form loading={props.loading} onSubmit={props.sellToken}>
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
                            <div style={{ marginTop: "20px" }}>
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
