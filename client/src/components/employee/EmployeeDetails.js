import { withStyles } from '@material-ui/styles';
import axios from "axios";
import React from 'react';
import { Text, Flex, Table, Button, EthAddress, PublicAddress, QR, Tooltip, Loader } from 'rimble-ui';

const styles = theme => ({
    wrapper: {
	    padding: '2rem 0 4rem 0',
    },
    inner: {
        margin: '0 auto',
		maxWidth: '100%',
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
});

class EmployeeDetails extends React.Component {
    state = {
        employee: undefined,
        loading: true,
        errorMessage: undefined,
        action: {
            isSuccess: false,
            message: undefined,
        }
    }

    updateEmployee() {
        const { config, companyAddress, employeeAddress } = this.props;

        axios.get(`${config.urls.backend}/companies/${companyAddress}/employees/${employeeAddress}`)
        .then( getEmployeeResult => {
            this.setState({
                ...this.state,
                employee: getEmployeeResult.data,
                loading: false,
            });
        }).catch(reason => {
            const errorMessage = reason.response && reason.response.data && reason.response.data.message ? reason.response.data.message : reason.toString();
            this.setState({
                errorMessage,
            });
        });
    }

    componentDidMount() {
        this.updateEmployee();
    }

    renderReceipts = () => {
        const { employee } = this.state;
        const employeesRender = employee.receipts.map( receipt => {
            return <tr key={receipt.ipfsHash}>
                <td>
                    <Tooltip message={receipt.ipfsHash}>
                        <EthAddress
                            address={receipt.ipfsHash}
                            truncate={true}
                        />
                    </Tooltip>
                </td>
                <td>{receipt.createdAt}</td>
                <td><Tooltip message={receipt.path}>
                        <EthAddress
                            address={receipt.path}
                            truncate={true}
                        />
                    </Tooltip></td>
                <td><a href={receipt.ipfsUrl} rel="noopener noreferrer" target="_blank">View</a></td>
            </tr>;
        });
        return employeesRender;
    }

    renderEmployee() {
        const { companyAddress, classes } = this.props;
        const { employee } = this.state;
        const renderReceipts = this.renderReceipts();
        return (
            <div className={classes.wrapper}>
                <section className={`${classes.section}`} >
                    <div className={`${classes.inner} ${classes.style1}`}>
                        <header className={classes.header}>
                            <h1>Employee Details</h1>
                            <p>{employee.name} | {employee.role}</p>
                        </header>    
                    </div>
                    <Flex flexDirection="row" width={1} >
                        <Flex flexDirection="column" width={1/4}>
                            <Flex
                                width={1}
                                flexDirection="column"
                                alignItems="center"
                                borderRadius="10px"
                            >
                                <Text width={1} p={2} textAlign="center" fontSize="18px">
                                Wallet QR Code
                                </Text>
                                <QR
                                    value={employee.wallet}
                                />
                                <br/>
                                <hr width={'100%'}></hr>
                                <PublicAddress
                                    label="Employee Wallet"
                                    address={employee.wallet}
                                />
                                <Text width={1} p={1} textAlign="left" fontSize="17px" bold={true}>
                                Employee Type
                                </Text>
                                <Text width={1} p={1} textAlign="left" fontSize="14px">
                                {employee.employeeType}
                                </Text>
                                <Text width={1} p={1} textAlign="left" fontSize="17px" bold={true}>
                                Email
                                </Text>
                                <Text width={1} p={1} textAlign="left" fontSize="14px">
                                {employee.email}
                                </Text>
                                <Text width={1} p={1} textAlign="left" fontSize="17px" bold={true}>
                                Salary Amount
                                </Text>
                                {/* <Text width={1} p={1} textAlign="left" fontSize="14px"> */}
                                    <Text.p width={1} textAlign="left" fontSize="14px">{employee.salaryAmount} {employee.preferredTokenPayment.symbol}</Text.p>
                                {/* </Text> */}
                                <Text width={1} p={1} textAlign="left" fontSize="17px" bold={true}>
                                Enabled?
                                </Text>
                                <Text width={1} p={1} textAlign="left" fontSize="14px">
                                {`${employee.enabled === true}`}
                                </Text>
                            </Flex>
                        </Flex>
                        <Flex flexDirection="column" width={3/4} p={2}>
                            <Flex flexDirection="row" width={1} p={3}>
                                <Button.Outline height={'20hv'} m={1} as="a" href={`/company/${companyAddress}`} >
                                    View Company
                                </Button.Outline>
                            </Flex>
                            <Text width={1} p={2} mr={5} textAlign="center" fontSize="21px">
                                List of payment receipts.
                            </Text>
                            <br/>
                            <Table width={1}>
                                <thead>
                                    <tr>
                                        <th>IPFS Hash</th>
                                        <th>Created At</th>
                                        <th>Path</th>
                                        <th>URL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderReceipts}
                                </tbody>
                            </Table>
                        </Flex>
                    </Flex>
                </section>
            </div>
        );
    }

    renderContent(content) {
        const { classes } = this.props;
        return (
            <div className={classes.wrapper}>
                <section className={`${classes.section} ${classes.style1}`} >
                    <div className={classes.inner}>
                        <header className={classes.header}>
                            <h1>Employee Details</h1>
                            {content}
                        </header>    
                    </div>
                </section>
            </div>
        );
    }

    render() {
        const { loading, errorMessage } = this.state;

        if(errorMessage !== undefined) {
            return this.renderContent(
                <>
                    <Text width={1} p={2} mr={5} textAlign="center" fontSize="21px">
                        {errorMessage}. Please try later.
                    </Text>
                </>
            );
        }

        if(loading) {
            return this.renderContent(
                <>
                    <Loader color="black" size="80px" width={1}/>
                    <Text width={1} p={2} mr={5} textAlign="center" fontSize="21px">
                    Loading employee information...
                    </Text>
                </>
            );
        }
        return this.renderEmployee();
    }
}

export default withStyles(styles)(EmployeeDetails);
