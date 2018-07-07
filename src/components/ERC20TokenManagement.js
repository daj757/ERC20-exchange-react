import React, { Component } from 'react'
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
import market from "../../public/static/images/market.jpg"
function TokenMessage(props) {
    switch (props.tokenState) {
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
export default function Erc20TokenManagement(props) {

    return (
        <div>
            <Responsive minWidth={768}>
                <div style={{ backgroundImage: `url(${market})`, backgroundSize: "cover" }} id="tokenManagement">
                    <Container>
                        <Header as="h1" textAlign="center">ERC20 Token management</Header>
                        <Segment color="blue">
                            <Header as='h4' textAlign='center'>
                                For demonstration purposes the add token fields have been added for you. This will contact a smart contract for an ERC20 token I have created
                                called "FIXED". The contract will give you 100,000 FIXED tokens into your account.
                    </Header>
                            <Header as='h4' textAlign='center'>
                                {`Token address is ${props.address}`}
                            </Header>
                            <Header as='h4' textAlign='center'>
                                {`Exchange address is ${props.exchangeAddress}`}
                            </Header>
                            <Header as="h4" textAlign="center" >You have {props.tokenAmount} Tokens in your account</Header>
                        </Segment>
                        <TokenMessage status={props.status} tokenState={props.tokenState} />
                        <Grid style={{ padding: "20px" }} verticalAlign="middle">
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <Header as="h3" >Add token to exchange</Header>
                                    <Form loading={props.loadingAdd} onSubmit={props.handleTokenAddition}>
                                        <Form.Input
                                            required
                                            placeholder='Token Name'
                                            name='tokenName'
                                            value={props.tokenName}
                                            onChange={props.handleLetterChange}
                                        />
                                        <Form.Input
                                            required
                                            placeholder="Token Address"
                                            name="tokenAddress"
                                            value={props.address}
                                            onChange={props.handleLetterChange}
                                        />
                                        <Form.Button color='blue' labelPosition='left' icon='add' content='Add Token' />

                                    </Form>
                                </Grid.Column>
                                <Grid.Column>
                                    <Header as="h3" >Allow tokens to be taken from your account and put into the exchange.</Header>
                                    <Form loading={props.loading} onSubmit={props.handleTokenAllowance}>
                                        <Form.Input
                                            required
                                            error={props.tokenAmountAllowanceFieldError}
                                            placeholder='Amount of tokens allowed'
                                            name='tokenAmountAllowance'
                                            value={props.tokenAmountAllowance}
                                            onChange={props.handleChangeEther}
                                        />
                                        <Form.Input
                                            required
                                            placeholder="Address"
                                            name="exchangeAddress"
                                            value={props.exchangeAddress}
                                            onChange={props.handleLetterChange}
                                        />
                                        <Form.Button color='blue' labelPosition='left' icon='key' content='Allow' />

                                    </Form>

                                </Grid.Column>
                                <Grid.Column>
                                    <Header as="h3" >Send Tokens to Someone</Header>
                                    <Form loading={props.loadingSend} onSubmit={props.handleSend}>
                                        <Form.Input
                                            required
                                            error={props.sendAmountFieldError}
                                            placeholder='Token Amount'
                                            name='sendAmount'
                                            value={props.sendAmount}
                                            onChange={props.handleChangeEther}
                                        />
                                        <Form.Input
                                            required
                                            placeholder="Token Address"
                                            name="sendAddress"
                                            value={props.sendAddress}
                                            onChange={props.handleLetterChange}
                                        />
                                        <Form.Button color='blue' labelPosition='left' icon='send' content='Send Token' />

                                    </Form>
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
