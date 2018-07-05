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
                            href="#token-exchange"
                            header
                        >
                            Decentralized Token Exchange
            </Menu.Item>
                        <Menu.Menu position="right">

                            <Menu.Item
                                name="accountManagement"
                                active={activeItem === 'accountManagement'}
                                onClick={this.handleItemClick}
                                href="#account-management"
                            >
                                Account Management
            </Menu.Item>

                            <Menu.Item
                                name="tokenManagement"
                                active={activeItem === 'tokenManagement'}
                                onClick={this.handleItemClick}
                                href="#token-management"
                            >
                                Token Management
            </Menu.Item>
                            <Menu.Item
                                name="tokenTrading"
                                active={activeItem === 'tokenTrading'}
                                onClick={this.handleItemClick}
                                href="#token-trading"
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
                        <Menu.Menu position="right">
                            <Dropdown
                                style={{
                                    color: 'white',
                                    marginRight: '15px',
                                    marginTop: '10px',
                                    fontSize: '20px',

                                }}
                                icon="bars"
                            >
                                <Dropdown.Menu >
                                    <Dropdown.Item
                                        name="our-people"
                                        active={activeItem === 'our-people'}
                                        onClick={this.handleItemClick}
                                        href="#our-people"
                                    >
                                        About Exchange
                  </Dropdown.Item>
                                    <Dropdown.Item
                                        name="our-process"
                                        active={activeItem === 'our-process'}
                                        onClick={this.handleItemClick}
                                        href="#process"
                                    >
                                        Metamask
                  </Dropdown.Item>
                                    <Dropdown.Item
                                        name="how-it-workds"
                                        active={activeItem === 'how-it-works'}
                                        onClick={this.handleItemClick}
                                        href="#how-it-works"
                                    >
                                        How it works
                  </Dropdown.Item>
                                    <Dropdown.Item
                                        name="Employment"
                                        active={activeItem === 'Employment'}
                                        onClick={this.handleItemClick}
                                        href="#employment"
                                    >
                                        Employment
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