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
    Form,
    Message
} from 'semantic-ui-react'
import money from "../../public/static/images/money.jpg"
import mask from "../../public/static/images/metamask.png"
function MainMessage(props) {
    switch (props.managementState) {
        case "info":
            return <Message info>
                <Message.Header>{props.managementStatus}</Message.Header>
                <p>This may take a few moments </p>
            </Message>
        case "success":
            return <Message positive>
                <Message.Header>{props.managementStatus}</Message.Header>
            </Message>
        case "error":
            return <Message negative>
                <Message.Header>{props.managementStatus}</Message.Header>

            </Message>
        default:
            return null
    }
}
export default function ExchangeManagement(props) {

    return (
        <div style={{ backgroundImage: `url(${money})`, backgroundSize: "cover" }} id="exchangeManagement">
            <Container>
                <Responsive minWidth={768}>
                    <Header as="h1" textAlign="center">Exchange Account Management</Header>
                    <Divider />
                    <MainMessage managementState={props.managementState} managementStatus={props.managementStatus} />
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Header as="h3" >Deposit and withdraw Ether from exchange.</Header>
                                <Header as="h4" >You have {props.balanceEth} Ether in the exchange.</Header>

                                <Form loading={props.ethLoading} onSubmit={props.handleSubmitDeposit}>
                                    <Form.Input
                                        error={props.amountDepositFieldError}
                                        placeholder='Amount to Deposit'
                                        name='amountDeposit'
                                        value={props.amountDeposit}
                                        onChange={props.handleChangeEther}
                                        required

                                    />
                                    <Form.Button color='green' labelPosition='left' icon='money bill alternate outline' content='Deposit' />

                                </Form>
                                <Form loading={props.ethLoading2} style={{ marginTop: '20px' }} onSubmit={props.handleSubmitWithdraw}>
                                    <Form.Input
                                        required
                                        error={props.amountWithdrawFieldError}
                                        placeholder='Amount to Withdraw'
                                        name='amountWithdraw'
                                        value={props.amountWithdraw}
                                        onChange={props.handleChangeEther}
                                    />
                                    <Form.Button color='green' labelPosition='left' icon='money bill alternate outline' content='Withdraw' />

                                </Form>

                            </Grid.Column>
                            <Grid.Column>
                                <Header as="h3" >Deposit any custom ERC20 token below. First head to ERC20 token management to add a token.</Header>
                                <Header as="h4" >You have {props.balanceTokenInExchange} Tokens in the exchange.</Header>
                                <Form loading={props.tokenDepositLoading} style={{ marginTop: '20px' }} onSubmit={props.handleTokenDeposit}>
                                    <Form.Input
                                        required
                                        placeholder='Token Name'
                                        name='tokenName'
                                        value={props.tokenName}
                                        onChange={props.handleChangeLetters}>
                                    </Form.Input>
                                    <Form.Input
                                        required
                                        error={props.tokenAmountDepositFieldError}
                                        placeholder='Amount to Deposit'
                                        name='tokenAmountDeposit'
                                        value={props.tokenAmountDeposit}
                                        onChange={props.handleChangeEther}>
                                    </Form.Input>
                                    <Form.Button color='blue' labelPosition='left' icon='money bill alternate outline' content='Deposit' />
                                </Form>
                                <Form loading={props.tokenWithdrawLoading} style={{ marginTop: '20px' }} onSubmit={props.handleTokenWithdraw}>
                                    <Form.Input
                                        required
                                        placeholder='Token Name'
                                        name='tokenName2'
                                        value={props.tokenName2}
                                        onChange={props.handleChangeLetters}>
                                    </Form.Input>
                                    <Form.Input
                                        required
                                        error={props.tokenAmountWithdrawFieldError}
                                        placeholder='Amount to Withdraw'
                                        name='tokenAmountWithdraw'
                                        value={props.tokenAmountWithdraw}
                                        onChange={props.handleChangeEther}>
                                    </Form.Input>
                                    <Form.Button color='blue' labelPosition='left' icon='money bill alternate outline' content='Withdraw' />
                                </Form>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Responsive>
                <Responsive {...Responsive.onlyMobile}>
                    <Header as="h1" textAlign="center">How to use Exchange</Header>
                    <Image src={mask} circular centered size="medium" />
                    <Container fluid>


                        <p style={{ fontSize: "20px" }}>
                            This site is built to allow you to exchange ERC20 standard tokens on both the rinkeby and the main net on the Ethereum
                            network. To access and interact with the site please use a desktop browser with metamask installed.
                            Find out more about metamask and interacting with the ethereum network by visiting the site below.
      </p>
                        <Header as="h3" textAlign="center" color="orange"><a id="metaLink" target="_blank" href="https://metamask.io/">Metamask</a></Header>

                    </Container>
                </Responsive>
            </Container>
        </div>
    )
}