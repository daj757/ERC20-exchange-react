import React, { Component } from 'react'
import { Menu, Responsive, Dropdown } from 'semantic-ui-react'

export default class Header extends Component {
    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state

        return (
            <div>
                <Responsive minWidth={768}>
                    <Menu
                        style={{ fontFamily: 'Russo One, sans-serif' }}
                        inverted
                        fluid
                        fixed="top"
                    >

                        <Menu.Item
                            name="tokenExchange"
                            active={activeItem === 'tokenExchange'}
                            onClick={this.handleItemClick}
                            link={true}
                            href="#main"
                            header
                        >
                            Decentralized Token Exchange
            </Menu.Item>
                        <Menu.Menu position="right">

                            <Menu.Item
                                name="accountManagement"
                                active={activeItem === 'accountManagement'}
                                onClick={this.handleItemClick}
                                href="#exchangeManagement"
                            >
                                Account Management
            </Menu.Item>

                            <Menu.Item
                                name="tokenManagement"
                                active={activeItem === 'tokenManagement'}
                                onClick={this.handleItemClick}
                                href="#tokenManagement"
                            >
                                Token Management
            </Menu.Item>
                            <Menu.Item
                                name="tokenTrading"
                                active={activeItem === 'tokenTrading'}
                                onClick={this.handleItemClick}
                                href="#trading"
                            >
                                Token Trading
            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                </Responsive>
                <Responsive {...Responsive.onlyMobile}>
                    <Menu
                        style={{ fontFamily: 'Russo One, sans-serif' }}
                        inverted
                        fixed="top"
                    >
                        <Menu.Menu position="left">
                            <Dropdown
                                style={{
                                    color: 'white',
                                    marginLeft: '15px',
                                    marginTop: '10px',
                                    fontSize: '20px',

                                }}
                                icon="bars"
                            >
                                <Dropdown.Menu >
                                    <Dropdown.Item
                                        name="main"
                                        active={activeItem === 'main'}
                                        onClick={this.handleItemClick}
                                        href="#exchangeManagement"
                                    >
                                        About Exchange
                  </Dropdown.Item>


                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Menu>
                    </Menu>
                </Responsive>
            </div>
        )
    }
}