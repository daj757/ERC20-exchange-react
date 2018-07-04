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
            tokenName: "FIXED", tokenAddress: "0xb9472049b46c02940ebf8b1b953942b920b9c064"
        }
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleTokenAddition = () => {
        const { tokenName, tokenAddress } = this.state
        this.props.addToken(tokenName, tokenAddress)
        // this.props.addToken(tokenName, address)

    }

    render() {
        const { tokenName, tokenAddress } = this.state
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
                                        value={tokenAddress}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Button color='blue' labelPosition='left' icon='add' content='Add Token' />

                                </Form>


                            </Grid.Column>
                            <Grid.Column>
                                <Header as="h3" >You have  Tokens in your account</Header>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                </Container>
            </div>
        )
    }
}