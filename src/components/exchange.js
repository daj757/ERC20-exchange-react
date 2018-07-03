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

export default class Exchange extends Component {
    state = { amountDeposit: 0, amountWithdraw: 0 }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleSubmitDeposit = () => {
        const { amountDeposit } = this.state
        this.props.deposit(this.state.amountDeposit)

    }
    handleSubmitWithdraw = () => {
        const { amountWithdraw } = this.state

    }
    render() {
        const { amountDeposit, amountWithdraw } = this.state
        return (
            <div>
                <Container>
                    <Header as="h1" textAlign="center">Exchange Account Management</Header>
                    <Divider />
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Header as="h3" >You have {this.props.ether} Ether in your account</Header>
                                {this.props.status}
                                <Form onSubmit={this.handleSubmitDeposit}>
                                    <Form.Input
                                        placeholder='Amount to Deposit'
                                        name='amountDeposit'
                                        value={amountDeposit}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Button color='green' labelPosition='left' icon='money bill alternate outline' content='Deposit' />

                                </Form>
                                <Form style={{ marginTop: '20px' }} onSubmit={this.handleSubmitWithdraw}>
                                    <Form.Input
                                        placeholder='Amount to Withdraw'
                                        name='amountWithdraw'
                                        value={amountWithdraw}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Button color='green' labelPosition='left' icon='money bill alternate outline' content='Withdraw' />

                                </Form>

                            </Grid.Column>
                            <Grid.Column>
                                <Header as="h3" >You have {this.props.token} Tokens in your account</Header>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>


                </Container>
            </div>
        )
    }
}