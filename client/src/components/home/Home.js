import { withStyles } from '@material-ui/styles';
import React from 'react';
import { Flex, Text, } from 'rimble-ui';
import CardInfo from '../common/CardInfo';

const styles = theme => ({
    wrapper: {
	    padding: '2rem 0 4rem 0',
    },
    inner: {
        margin: '0 auto',
		maxWidth: 'calc(100% - 10rem)',
		width: '80rem',
    },
    header: {
        borderBottom: '1px solid',
		margin: '0 auto 2rem auto',
		maxWidth: '80%',
		textAlign: 'center',
		width: '45.7142857143rem',
        '& h1': {
            fontSize: '3rem',
            fontFamily: "'Fjalla One', sans-serif",
            fontWeight: 400,
            lineHeight: 1.5,
            margin: '0 0 1.5rem 0',
            textTransform: 'uppercase',
            letterSpacing: '0.25rem',
        },
        '& p': {
            fontSize: '1.5rem',
            color: '#4468ca',
        },
    },
    row: {
        display: 'flex',
		flexWrap: 'wrap',
		boxSizing: 'border-box',
		alignItems: 'stretch',
        marginBottom: 0,
    },
    section: {
        margin: 0,
        padding: 0,
        border: 0,
        fontSize: '100%',
        font: 'inherit',
        verticalAlign: 'baseline',
    },
    style1: {
        background: '#f3f3f3'
    },
    spotlights: {
		// display: '-moz-flex',
		// display: '-webkit-flex',
		// display: '-ms-flex',
		display: 'flex',
		'-moz-flex-wrap': 'wrap',
		'-webkit-flex-wrap': 'wrap',
		'-ms-flex-wrap': 'wrap',
		flexWrap: 'wrap',
		'-moz-align-items': '-moz-stretch',
		'-webkit-align-items': '-webkit-stretch',
		'-ms-align-items': '-ms-stretch',
		alignItems: 'stretch',
		width: '100%',
		marginBottom: '2rem'
    },
    spotlight: {
        margin: 0,
        padding: 0,
        border: 0,
        fontSize: '100%',
        font: 'inherit',
        verticalAlign: 'baseline',
        textAlign: 'center'
    },
    spotlight_image: {
        marginBottom: 0,
        '& img': {
            borderRadius: '4px 4px 0 0'
        }
    },
    spotlight_image_content: {
        background: '#ffffff',
        borderRadius: '0 0 4px 4px',
        padding: '2rem',
        '& h3': {
            fontFamily: '"Fjalla One", sans-serif',
            fontWeight: 400,
            lineHeight: 1.5,
            margin: '0 0 1.5rem 0',
            textTransform: 'uppercase',
            letterSpacing: '0.25rem'
        },
        '& p': {
            margin: '0 0 2rem 0'
        }
    }
});

class Home extends React.Component {
    _isMounted = false;
    state = {
        errorMessage: undefined,
        isActionMessageOpened: false,
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount = () => {
        this._isMounted = true;
    }

    onClickFaucet = () => {
        var win = window.open(`https://faucet.metamask.io/`, '_blank');
        win.focus();
    }

    onClickSwap = () => {
        var win = window.open(`https://ropsten.kyber.network/swap`, '_blank');
        win.focus();
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.wrapper}>
                <section className={`${classes.section} ${classes.style1}`} >
                    <div className={classes.inner}>
                        <header className={classes.header}>
                            <h1>Welcome to Zalarify!</h1>
                            <p>The platform to transfer payrolls using any ERC20 token.</p>
                        </header>    
                    </div>
                    <Flex flexDirection="row" width={1}>
                        <Text width={1} p={'0'} mr={4} height={3} textAlign="center" fontSize="21px">
                            Please before starting to play with the platform, read the following considerations:
                        </Text>
                    </Flex>
                    <Flex width={1}>
                        <CardInfo
                            width={1}
                            title="Platform Network / Ether & Token Balances"
                            primaryText="Ropsten Faucet"
                            primaryTooltip="This website will allow you to get some play ether in the Ropsten testnet."
                            onPrimaryClick={this.onClickFaucet}
                            secondaryText="Ether <=> Tokens"
                            secondaryTooltip="This website will allow you to swap ether and tokens in order to able to play with Zalarify."
                            onSecondaryClick={this.onClickSwap}
                            >
                            <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                            The platform may be deployed on a local Ganache or access on the Ropsten testnet in the website http://zalarify.io.
                            </Text>
                            <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                            If you are accessing the platform in the local Ganache (with the mnemonic pre-configure -see readme file-), you will already have enough balance and tokens to play with the platform.
                            </Text>
                            <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                            If you are accessing the platform in the Ropsten testnet, please remember to get enough ether and tokens in order to able execute some functionalities in the platform.
                            </Text>
                            <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                            If you don't have Ether, you can go to the faucet website, or if you need to get ERC20 tokens, you can visit a swapping website.
                            </Text>
                        </CardInfo>
                    </Flex>
                    <Flex width={1} flexDirection="row">
                        <CardInfo
                            width={1 / 2}
                            title="What Can I Do The First Time?"
                            primaryText="Companies List"
                            primaryTooltip="You will see all the registered companies in the platform, and you will able to create your own."
                            onPrimaryLink="/companies"
                            >
                            <ul>
                                <li>
                                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                                    See all the current registered companies.
                                    </Text>
                                </li>
                                <li>
                                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                                    Create your own company.
                                    </Text>
                                </li>
                            </ul>
                        </CardInfo>
                        <CardInfo
                            width={1 / 2}
                            title="What Can I Do as Company Owner?"
                            onPrimaryLink="/companies"
                            primaryText="Companies List"
                            primaryTooltip="You will see all the registered companies in the platform, and you will able to create your own."
                            >
                            <ul>
                                <li>
                                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                                    See all the current registered companies.
                                    </Text>
                                </li>
                                <li>
                                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                                    Create your own company.
                                    </Text>
                                </li>
                                <li>
                                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                                    Add employees to your own company.
                                    </Text>
                                </li>
                                <li>
                                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                                    Transfer payrolls to your employees using StablePay.
                                    </Text>
                                </li>
                                <li>
                                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                                    Register a receipt payment for the transfered payroll on Ethereum and IPFS.
                                    </Text>
                                </li>
                            </ul>
                        </CardInfo>
                    </Flex>
                </section>
            </div>
        );
    }
}

export default withStyles(styles)(Home);
