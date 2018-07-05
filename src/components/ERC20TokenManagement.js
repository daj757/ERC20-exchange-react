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

export default class Erc20Management extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokenName: "FIXED",
            tokenAddress: "",
            tokenAmount: 0,
            address: "",
            amountFieldError: false
        }

    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props !== prevProps) {
            this.setState({ address: this.props.exchangeAddress, tokenAddress: this.props.address })
        }
    }
    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleNumberChange = (e, { name, value }) => {
        if (isFinite(value)) {
            this.setState({ [name]: value, [name + "FieldError"]: false })
        }
        else {
            this.setState({ [name + "FieldError"]: true })
        }
    }
    handleTokenAddition = () => {
        const { tokenName, tokenAddress } = this.state
        this.props.addToken(tokenName, tokenAddress)
        // this.props.addToken(tokenName, address)
    }
    handleTokenAllowance = () => {
        const { tokenAmount, address } = this.state

        console.log(this.state)
    }

    render() {

        const { tokenName, tokenAddress, tokenAmount, address } = this.state
        return (
            <div>
                <Container>
                    <Header as="h1" textAlign="center">ERC20 Token management</Header>
                    {this.props.status}
                    <br />
                    {`Exchange address is ${this.props.exchangeAddress}`}
                    <br />
                    {`Token address is ${this.props.address}`}
                    <Divider />
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Header as="h3" >Add token to exchange</Header>
                                <Form loading={this.props.loading} onSubmit={this.handleTokenAddition}>
                                    <Form.Input
                                        placeholder='Token Name'
                                        name='tokenName'
                                        value={tokenName}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Input
                                        placeholder="Token Address"
                                        name="tokenAddress"
                                        value={this.props.address}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Button color='blue' labelPosition='left' icon='add' content='Add Token' />

                                </Form>
                            </Grid.Column>
                            <Grid.Column>
                                <Header as="h3" >You have {this.props.tokenAmount} Tokens in your account</Header>
                                <Header as="h4" >Allow tokens to be taken from your account and put into the exchange.</Header>
                                <Form loading={this.props.loading} onSubmit={this.handleTokenAllowance}>
                                    <Form.Input
                                        error={this.state.amountFieldError}

                                        placeholder='Amount of tokens allowed'
                                        name='tokenAmount'
                                        value={tokenAmount}
                                        onChange={this.handleNumberChange}
                                    />
                                    <Form.Input

                                        placeholder="Address"
                                        name="address"
                                        value={this.props.exchangeAddress}
                                        onChange={this.handleChange}
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
}