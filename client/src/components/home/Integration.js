import { withStyles } from '@material-ui/styles';
import React from 'react';
import { Flex, Text } from 'rimble-ui';
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

class Integration extends React.Component {
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

    onClickStablePay = () => {
        var win = window.open(`https://stablepay.io/`, '_blank');
        win.focus();
    }

    onClickIPFS = () => {
        var win = window.open(`https://en.wikipedia.org/wiki/InterPlanetary_File_System`, '_blank');
        win.focus();
    }

    onClickEternalStorage = () => {
        var win = window.open(`https://fravoll.github.io/solidity-patterns/eternal_storage.html`, '_blank');
        win.focus();
    }

    onClickABIEncoderV2 = () => {
        var win = window.open(`https://medium.com/@dillonsvincent/solidity-enable-experimental-abiencoderv2-to-use-a-struct-as-function-parameter-27979603a879`, '_blank');
        win.focus();
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.wrapper}>
                <section className={`${classes.section} ${classes.style1}`} >
                    <div className={classes.inner}>
                        <header className={classes.header}>
                            <h1>Zalarify Integrations!</h1>
                            <p>Details about external platforms and smart contracts designs which Zalarify integrated and implemented.</p>
                        </header>    
                    </div>
                    <Flex width={1}>
                        <CardInfo
                            width={1}
                            title="StablePay.io"
                            primaryText="StablePay Website"
                            primaryTooltip="Visit StablePay Website."
                            onPrimaryClick={this.onClickStablePay}
                            >
                            <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                            StablePay is a Layer I protocol which allows you (people and DApps) to transfer any ERC20/Ether to any ERC20/Ether.
                            StablePay calculates the best rate between all the swapping providers (KyberNetwork, and Uniswap) to swap the tokens.
                            The platform is deployed in Ropsten, and they will deploy on mainnet in some weeks. Also, they will support new swapping providers after launching.
                            </Text>
                            <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                            <strong>StablePay gets a fixed fee for each payment/transfer it does.</strong> That fee is 1 %, and it means if you want to transfer 10 DAIs, the receiver will get 9 DAIs.]
                            The DAI left will be transfered to a StablePay smart contract.
                            </Text>
                            <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                            Zalarify uses StablePay to transfer the payrolls to the employees. The employees usually prefer to get the payrolls using a stable coin (like DAI), but Zalarify allows to the company owner can pay with any ERC20 token (supported by StablePay and its swapping providers).
                            </Text>
                        </CardInfo>
                    </Flex>
                    <Flex width={1}>
                        <CardInfo
                            width={1}
                            title="IPFS"
                            primaryText="What Is IPFS?"
                            primaryTooltip="IPFS Explained."
                            onPrimaryClick={this.onClickIPFS}
                            >
                            <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                            InterPlanetary File System (IPFS) is a protocol and network designed to create a content-addressable, peer-to-peer method of storing and sharing hypermedia in a distributed file system.
                            </Text>
                            <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                            Zalarify uses IPFS to store the payroll receipts.
                            </Text>
                        </CardInfo>
                    </Flex>
                    <Flex width={1}>
                        <CardInfo
                            width={1}
                            title="Eternal Storage Pattern"
                            primaryText="What Is Eternal Storage Pattern?"
                            primaryTooltip="Eternal Storage Pattern Explained."
                            onPrimaryClick={this.onClickEternalStorage}
                            >
                            <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                            The Eternal Storage pattern is a smart contract designed to store data using mappings. It needs a mapping for each type of data you need to store.
                            This pattern is used to able update smart contracts after they have been deployed on a network.
                            </Text>
                            <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                            Zalarify uses this pattern to allow to update smart contracts in the platform.
                            </Text>
                        </CardInfo>
                    </Flex>
                    <Flex width={1}>
                        <CardInfo
                            width={1}
                            title="Using ABIEncoderV2 in Smart Contracts"
                            primaryText="What Is ABIEncoderV2?"
                            primaryTooltip="ABIEncoderV2 Explained."
                            onPrimaryClick={this.onClickABIEncoderV2}
                            >
                            <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px">
                            The ABIEncoderV2 enabled you can pass a struct type into a function from web3 or another contract. When compiling a contract with ABIEncoderV2 enabled there are a few changes to the compiled ABI output.
                            </Text>
                        </CardInfo>
                    </Flex>
                </section>
            </div>
        );
    }
}

export default withStyles(styles)(Integration);
