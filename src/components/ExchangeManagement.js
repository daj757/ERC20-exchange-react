import React, { Component } from 'react'
import {
    Image,
    Segment,
    Header,
    Input,
    Responsive,
    Container,
    Divider,
    Grid,
    Form
} from 'semantic-ui-react'
export default function ExchangeManagement(props) {

    return (
        <div>
            <Container>
                <Header as="h1" textAlign="center">Exchange Account Management</Header>
                <Divider />
                <div style={{ textAlign: "center", marginBottom: "15px" }}>{props.managementStatus}</div>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Header as="h3" >Deposit and withdraw Ether from exchange.</Header>
                            <Header as="h4" >You have {props.balanceEth} Ether in the exchange.</Header>
                            {/* <Header as="h4" >You have {props.etherBalance} Ether in your account.</Header> */}
                            <Form loading={props.ethLoading} onSubmit={props.handleSubmitDeposit}>
                                <Form.Input
                                    error={props.amountDepositFieldError}
                                    placeholder='Amount to Deposit'
                                    name='amountDeposit'
                                    value={props.amountDeposit}
                                    onChange={props.handleChange}
                                />
                                <Form.Button color='green' labelPosition='left' icon='money bill alternate outline' content='Deposit' />

                            </Form>
                            <Form loading={props.ethLoading2} style={{ marginTop: '20px' }} onSubmit={props.handleSubmitWithdraw}>
                                <Form.Input
                                    error={props.amountWithdrawFieldError}
                                    placeholder='Amount to Withdraw'
                                    name='amountWithdraw'
                                    value={props.amountWithdraw}
                                    onChange={props.handleChange}
                                />
                                <Form.Button color='green' labelPosition='left' icon='money bill alternate outline' content='Withdraw' />

                            </Form>

                        </Grid.Column>
                        <Grid.Column>
                            <Header as="h3" >Deposit any custom ERC20 token below. First head to ERC20 token management to add a token.</Header>
                            <Header as="h4" >You have {props.balanceTokenInExchange} Tokens in the exchange.</Header>
                            <Form loading={props.tokenDepositLoading} style={{ marginTop: '20px' }} onSubmit={props.handleTokenDeposit}>
                                <Form.Input
                                    placeholder='Token Name'
                                    name='tokenName'
                                    value={props.tokenName}
                                    onChange={props.handleChangeLetters}>
                                </Form.Input>
                                <Form.Input
                                    error={props.amountTokenFieldError}
                                    placeholder='Amount to Deposit'
                                    name='tokenAmountDeposit'
                                    value={props.tokenAmountDeposit}
                                    onChange={props.handleChange}>
                                </Form.Input>
                                <Form.Button color='blue' labelPosition='left' icon='money bill alternate outline' content='Deposit' />
                            </Form>
                            <Form loading={props.tokenWithdrawLoading} style={{ marginTop: '20px' }} onSubmit={props.handleTokenWithdraw}>
                                <Form.Input
                                    placeholder='Token Name'
                                    name='tokenName2'
                                    value={props.tokenName2}
                                    onChange={props.handleChangeLetters}>
                                </Form.Input>
                                <Form.Input
                                    error={props.amountTokenFieldError}
                                    placeholder='Amount to Withdraw'
                                    name='tokenAmountWithdraw'
                                    value={props.tokenAmountWithdraw}
                                    onChange={props.handleChange}>
                                </Form.Input>
                                <Form.Button color='blue' labelPosition='left' icon='money bill alternate outline' content='Withdraw' />
                            </Form>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </div>
    )
}