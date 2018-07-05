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
                <br />
                <p style={{ textAlign: 'center' }}>{`You have ${props.etherBalance} Ether in the exchange.`}</p>
                <br />
                <p style={{ textAlign: 'center' }}>{`You have ${props.tokenBalanceInExchange} tokens in the Exchange`}</p>
                <Divider />
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Header as="h3" >Buy Token</Header>
                            <Form loading={props.loadingAdd} onSubmit={props.handleTokenBuy}>
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
                        </Grid.Column>
                        <Grid.Column>
                            <Header as="h4" >Sell Token</Header>
                            <Form loading={props.loading} onSubmit={props.handleTokenAllowance}>
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
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </Container>
        </div>
    )
}
