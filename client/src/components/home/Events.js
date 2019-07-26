import { withStyles } from '@material-ui/styles';
import React from 'react';
import axios from 'axios';
import { Flex, Text, EthAddress, Tooltip } from 'rimble-ui';
import { Accordion, AccordionItem } from 'react-sanfona';
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
    },
    inputSelect: {
        color: '#3F3D4B',
        backgroundColor: '#fff',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: '16px',
        paddingRight: '16px',
        height: "3rem",
        border: '1px solid transparent',
        borderColor: '#CCC',
        borderRadius: '4px',
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
        fontSize: '1rem',
        fontFamily: '"Source Sans Pro",sans-serif',
        width:'100%'
    },
});

class Events extends React.Component {
    _isMounted = false;
    state = {
        items: [
            {
                text: 'IZalarify - NewCompanyCreated',
                event: 'NewCompanyCreated',
                key: 1,
            },
            {
                text: 'IReceiptRegistry - NewReceiptCreated',
                event: 'NewReceiptCreated',
                key: 2,
            },
            {
                text: 'ISettings - PlatformPaused',
                event: 'PlatformPaused',
                key: 3,
            },
            {
                text: 'ISettings - PlatformUnpaused',
                event: 'PlatformUnpaused',
                key: 4,
            },
        ],
        eventSelected: undefined,
        errorMessage: undefined,
        loading: false,
        itemSelected: undefined,
        events: [],
        itemsPerPage: 5,
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

    onChangeSmartContract = async (e) => {
        const value = e.target.value;
        if( value !== '') {
            const { config } = this.props;
            try {
                const { itemsPerPage } = this.state;
                const getEventsResult = await axios.get(`${config.urls.backend}/events?eventName=${value}&itemsPerPage=${itemsPerPage}`);
                if (this._isMounted) {
                    this.setState({
                        ...this.state,
                        eventSelected: value,
                        events: getEventsResult.data.data,
                        loading: false,
                    });
                }
            } catch (reason) {
                this.setState({
                    errorMessage: `Error getting data: ${reason.toString()}`,
                });
            }
        }
    }

    onChangeItemsPerPage = (e) => {
        this.setState({
            itemsPerPage: e.target.value,
        });
    }

    renderSelectOptions = () => {
        return this.state.items.map(item => {
          return <option
                  value={item.event}
                  key={item.key}>{item.text}</option>;
        });
    };

    renderEventDetails = (item) => {
        const { eventSelected } = this.state;
        if(eventSelected === 'NewCompanyCreated') {
            return (
                <>
                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="15px">
                        <strong>Contract:</strong> {item.thisContract} <strong>Company Address:</strong> {item.companyAddress}
                    </Text>
                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="15px">
                        <strong>Created At:</strong> {new Date(parseInt(item.createdAt) * 1000).toLocaleString()}
                    </Text>
                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="15px">
                        <strong>Creator:</strong> 
                        <Tooltip message={item.creator}>
                            <EthAddress
                                address={item.creator}
                                truncate={true}
                            />
                        </Tooltip>
                    </Text>
                </>
            );
        }
        if(eventSelected === 'NewReceiptCreated') {
            return (
                <>
                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="15px">
                        <strong>Employee:</strong> {item.employee} <strong>Company Address:</strong> {item.company}
                    </Text>
                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="15px">
                        <strong>Contract:</strong> {item.thisContract}
                    </Text>
                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="15px">
                        <strong>Receipt Hash:</strong> 
                        <Tooltip message={item.receiptHash}>
                            <EthAddress
                                address={item.receiptHash}
                                truncate={true}
                            />
                        </Tooltip>
                    </Text>
                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="15px">
                        <strong>IPFS Path:</strong> 
                        <Tooltip message={item.path}>
                            <EthAddress
                                address={item.path}
                                truncate={true}
                            />
                        </Tooltip>
                    </Text>
                </>
            );
        }
        if(eventSelected === 'PlatformPaused' || eventSelected === 'PlatformUnpaused') {
            return (
                <>
                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="15px">
                        <strong>Contract:</strong> {item.thisContract}
                    </Text>
                    <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="15px">
                        <strong>Reason:</strong> {item.reason}
                    </Text>
                </>
            );
        }
        return '';
    };

    renderAccordion = () => {
        return (
            <Accordion>
                {this.state.events.map((item, index) => {
                return (
                    <AccordionItem key={item.txHash} title={`${index + 1}# Event ${this.state.eventSelected} ${item.txHash}`} expanded={item === 1}>
                        <hr width="100%"></hr>
                        <Flex m={2} width={1} height="auto" flexDirection="column">
                            <Flex m={1} width={1} flexDirection="column">
                                <Text width={1} p={'0'} mr={4} textAlign="left" fontSize="18px">
                                Event Info:
                                </Text>
                                {this.renderEventDetails(item)}
                            </Flex>
                            <Flex m={1} width={1}  flexDirection="column">
                                <Text width={1} p={'0'} mr={4} textAlign="left" fontSize="18px">
                                Transaction Info:
                                </Text>
                                <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="15px">
                                    <strong>Tx Gas Used:</strong> {item.txGasUsed} <strong>Tx Gas Price:</strong> {item.txGasPrice}
                                </Text>
                                <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="15px">
                                    <strong>Tx Value:</strong> {item.txValue} 
                                    
                                    <strong>Tx Input:</strong> 
                                    <Tooltip message={item.txInput}>
                                        <EthAddress
                                            address={item.txInput}
                                            truncate={true}
                                        />
                                    </Tooltip>
                                </Text>
                            </Flex>
                            <Flex m={1} width={1} flexDirection="column">
                                <Text width={1} p={'0'} mr={4} textAlign="left" fontSize="18px">
                                Block Info:
                                </Text>
                                <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="15px">
                                    <strong>Block Number:</strong> {item.blockNumber} <strong>Block Gas Used:</strong> {item.blockGasUsed}
                                </Text>
                                <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="15px">
                                    <strong>Block Timestamp:</strong> {new Date(parseInt(item.blockTimestamp)).toLocaleString()}
                                </Text>
                                <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="15px">
                                    <strong>Block Gas Limit:</strong> {item.blockGasLimit} 
                                </Text>
                                <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="15px">
                                    <strong>Block Hash:</strong> 
                                    <Tooltip message={item.blockHash}>
                                        <EthAddress
                                            address={item.blockHash}
                                            truncate={true}
                                        />
                                    </Tooltip>
                                </Text>
                            </Flex>
                        </Flex>
                    </AccordionItem>
                );
                })}
            </Accordion>
        );
    }

    render() {
        const { classes, info } = this.props;
        const { events } = this.state;
        const renderEvents = events.length === 0 ?   <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px" italic>
                                                    Not events yet.
                                                    </Text> :
                                                    this.renderAccordion();
        const isDisabledEvents = info.network !== 'ROPSTEN';

        const disabledMessage = isDisabledEvents ? <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px" color="red">
                                                    It is disabled due to the current network is not Ropsten.
                                                    </Text>: '';

        return (
            <div className={classes.wrapper}>
                <section className={`${classes.section} ${classes.style1}`} >
                    <div className={classes.inner}>
                        <header className={classes.header}>
                            <h1>Smart Contract Events!</h1>
                            <p>Query the smart contract events of Zalarify using TheGraph platform.</p>
                        </header>    
                    </div>
                    <Flex width={1}>
                        <CardInfo
                            width={1}
                            title="Select An Event and Get Its Data"
                            viewButtons={false}>
                            <Text width={1} p={'0'} mr={4} textAlign="center" fontSize="20px" color="red">
                            It only works on Ropsten testnet.
                            </Text>
                            {disabledMessage}
                            <select
                                required
                                disabled={isDisabledEvents}
                                className={classes.inputSelect}
                                onChange={this.onChangeSmartContract}
                            >
                                <option
                                    value={''}
                                    key={0}>Select a 'Contract Name - Event Name'...</option>;
                                {this.renderSelectOptions()}
                            </select>
                            <select
                                required
                                disabled={isDisabledEvents}
                                className={classes.inputSelect}
                                onChange={this.onChangeItemsPerPage}
                            >
                                <option value={5} key={0}>5 items</option>;
                                <option value={10} key={1}>10 items</option>;
                                <option value={50} key={2}>50 items</option>;
                            </select>
                        </CardInfo>
                    </Flex>
                    <Flex width={1}>
                        <CardInfo
                            width={1}
                            title="Events (click for details)"
                            viewButtons={false}>
                            {renderEvents}
                        </CardInfo>
                    </Flex>
                    
                </section>
            </div>
        );
    }
}

export default withStyles(styles)(Events);
