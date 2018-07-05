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
    Form
} from 'semantic-ui-react'
export default function Erc20TokenManagement(props) {

    return (
        <div>
            <Container>
                <Header as="h1" textAlign="center">ERC20 Token management</Header>
                {props.status}
                <br />
                {`Exchange address is ${props.exchangeAddress}`}
                <br />
                {`Token address is ${props.address}`}
                <Divider />
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Header as="h3" >Add token to exchange</Header>
                            <Form loading={false} onSubmit={props.handleTokenAddition}>
                                <Form.Input
                                    placeholder='Token Name'
                                    name='tokenName'
                                    value={props.tokenName}
                                    onChange={props.handleLetterChange}
                                />
                                <Form.Input
                                    placeholder="Token Address"
                                    name="tokenAddress"
                                    value={props.address}
                                    onChange={props.handleLetterChange}
                                />
                                <Form.Button color='blue' labelPosition='left' icon='add' content='Add Token' />

                            </Form>
                        </Grid.Column>
                        <Grid.Column>
                            <Header as="h3" >You have {props.tokenAmount} Tokens in your account</Header>
                            <Header as="h4" >Allow tokens to be taken from your account and put into the exchange.</Header>
                            <Form loading={props.loading} onSubmit={props.handleTokenAllowance}>
                                <Form.Input


                                    placeholder='Amount of tokens allowed'
                                    name='tokenAmountAllowance'
                                    value={props.tokenAmountAllowance}
                                    onChange={props.handleChange}
                                />
                                <Form.Input

                                    placeholder="Address"
                                    name="exchangeAddress"
                                    value={props.exchangeAddress}
                                    onChange={props.handleLetterChange}
                                />
                                <Form.Button color='blue' labelPosition='left' icon='add' content='Add Token' />

                            </Form>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </Container>
        </div>
    )
}
