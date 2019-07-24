import { withStyles } from '@material-ui/styles';
import React from 'react';
import { Flex, Text, Tooltip, Icon, } from 'rimble-ui';
import MenuButton from './MenuButton';
import BigNumber from 'bignumber.js';

const styles = theme => ({
  header: {
    '-moz-justify-content': 'space-between',
    '-webkit-justify-content': 'space-between',
    '-ms-justify-content': 'space-between',
    justifyContent: 'space-between',
    cursor: 'default',
    height: '3.25rem',
    lineHeight: '3.25rem',
    '& > nav': {
        '& > a[href="#menu"]': {
            color: '#ffffff',
            display: 'inline-block',
            fontFamily: '"Fjalla One", sans-serif',
            fontWeight: 400,
            marginTop: '0.125rem',
            padding: '0 0.75rem',
            position: 'relative',
            textDecoration: 'none',
            textTransform: 'uppercase',
        },
    } 
  },
  logo: {
    color: '#ffffff',
    fontFamily: "'Fjalla One', 'sans-serif'",
    fontWeight: '400',
    letterSpacing: '0.1rem',
    padding: '0 1.25rem',
    textDecoration: 'none',
    textTransform: 'uppercase',
    marginTop: '0.125rem',
    '& span': {
        color: 'rgba(255, 255, 255, 0.5)',
    }
  },
  menu: {
    margin: 0,
	padding: 0,
	border: 0,
	fontSize: '100%',
	font: 'inherit',
    verticalAlign: 'baseline',
    display: 'block'
  },
    menuButton: {
        color: 'white',
        borderColor: 'transparent',
        '&:hover': {    
            color: 'white',
            borderColor: 'white'
        },
        '&:focus': {    
            color: 'white',
            borderColor: 'black'
        },
        '&:active': {    
            color: 'black',
            borderColor: 'black',
            background: 'transparent'
        },
    }
});

class Header extends React.Component {

    onClickMenuButton = (e, name) => {
        console.log(name);
    }

    onClickSeeWallet(address) {
        const { config } = this.props;
        const url = `${config.explorer.address}${address}`;
        const win = window.open(url, '_blank');
        win.focus();   
    }

    render() {
        const { info, config } = this.props;
        return (
            <Flex
                width={1}
                flexDirection={'row'}
                bg="#4468ca">
                <Flex
                    width={1 / 4}
                    pl="15px"
                    pt="5px"
                    verticalAlign="middle"
                    flexDirection={'row'}>
                    <Text
                        fontFamily="Fjalla One"
                        fontSize="24px"
                        color="white"
                        height={'100hv'} verticalAlign="middle">
                        Zalarify
                    </Text>
                </Flex>
                <Flex width={3 / 4} flexDirection={'row'}>
                    <MenuButton width="25vw" text="Home" value="home" link="/" onClick={this.onClickMenuButton} />
                    <MenuButton width="25vw" text="Companies" value="company" link="/companies" onClick={this.onClickMenuButton} />
                    <MenuButton width="25vw" text="Integration" value="integration" link="/integration" onClick={this.onClickMenuButton} />
                    <MenuButton width="25vw" text="Events" value="event" link="/events" onClick={this.onClickMenuButton} />
                    <Flex flexDirection="column" justifyContent="center" height={'100%'}>
                        <Flex flexDirection="row" justifyContent="center" height={'100%'} p="1">
                            <Tooltip message={`You are using the account: ${info.selectedAddress}`}>
                                <Text
                                    fontFamily="Fjalla One"
                                    fontSize="15px"
                                    color="white"
                                    p="1"
                                    height={'100%'} verticalAlign="middle">
                                    {info.selectedAddress}
                                </Text>
                            </Tooltip>
                            <Tooltip message="View address on Etherscan.io.">
                                <Icon color="white" name="Pageview" size="24px" onClick={ e => this.onClickSeeWallet(info.selectedAddress)}/>
                            </Tooltip>
                        </Flex>
                        <Flex flexDirection="row" justifyContent="center" height={'100%'} p="1">
                            <Tooltip message={`Your current networ is: ${config.name}`}>
                                <Text
                                    fontFamily="Fjalla One"
                                    fontSize="15px"
                                    color="white"
                                    textAlign="center"
                                    height={'100%'} verticalAlign="middle">
                                    {config.name} - 
                                </Text>
                            </Tooltip>
                            <Tooltip message={`Your current balance is: ${info.selectedAddressBalance.balanceWei} WEI`}>
                                <Text
                                    fontFamily="Fjalla One"
                                    fontSize="15px"
                                    color="white"
                                    textAlign="center"
                                    height={'100%'} verticalAlign="middle">
                                    {BigNumber(info.selectedAddressBalance.balanceEther).toFixed(2)} ETH
                                </Text>
                            </Tooltip>
                        </Flex>
                    </Flex>
                </Flex>
			</Flex>
        );
    }
}

export default withStyles(styles)(Header);
