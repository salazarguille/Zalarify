import { withStyles } from '@material-ui/styles';
import axios from "axios";
import React from 'react';
import { Text, Flex, Table, Button, Loader, Icon } from 'rimble-ui';
import CompanyDetailsItem from './CompanyDetailsItem';
import EmployeeFormModal from '../modals/EmployeeFormModal';
import EmployeePaymentFormModal from '../modals/EmployeePaymentFormModal';
import { randomHex } from 'web3-utils';

const styles = theme => ({
    wrapper: {
	    padding: '6rem 0 4rem 0',
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
        backgroundColor: 'red',
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
});
/*

        */
class CompanyDetails extends React.Component {
    state = {
        company: undefined,
        employees: [],
        isEmployeeFormOpened: false,
        isEmployeePaymentFormOpened: false,
        loading: true,
        errorMessage: undefined,
        selectedEmployee: undefined,
    }

    updateCompany() {
        const { config, companyAddress } = this.props;

        axios.get(`${config.urls.backend}/companies/${companyAddress}`)
        .then( getCompanyResult => {
            console.log(getCompanyResult.data);
            this.setState({
                ...this.state,
                company: getCompanyResult.data.info,
                employees: getCompanyResult.data.employees,
                loading: false,
            });
        }).catch(reason => {
            //console.log(reason.response);
            const errorMessage = reason.response && reason.response.data && reason.response.data.message ? reason.response.data.message : reason.toString();
            this.setState({
                errorMessage,
            });
        });
    }

    componentDidMount() {
        this.updateCompany();
    }

    handleValidation = (e, field) => {
        e.preventDefault();
        this.setState({
            name: e.target.value
        });
        e.target.parentNode.classList.add('was-validated');
    };

    onCloseModal = () => {
        this.setState({
            isEmployeeFormOpened: false,
        });
    };

    onCloseEmployeePaymentModal = () => {
        this.setState({
            isEmployeePaymentFormOpened: false,
        });
    }

    onClickCreateEmployee = e => {
        this.setState({
            isEmployeeFormOpened: true,
        });
    }

    onEmployeeCreatedCallback = (item, receipt) => {
        this.onCloseModal();
        this.updateCompany();
    }

    onClickPayment(employee) {
        console.log(employee);
        this.setState({
            isEmployeePaymentFormOpened: true,
            selectedEmployee: employee,
        });
    }

    onClickSeeWallet(employee) {
        const { config } = this.props;
        const url = `${config.explorer.address}${employee.wallet}`;
        const win = window.open(url, '_blank');
        win.focus();   
    }

    renderEmployees = () => {
        const { info } = this.props;
        const { company } = this.state;
        const isOwner = company ? company.creator.toUpperCase() === info.selectedAddress.toUpperCase() : false;

        const employeesRender = this.state.employees.map( employee => {
            const actionsForOwner = isOwner ? 
                    <><Icon color="blue" name="Payment" size="24px" onClick={ e => this.onClickPayment(employee)}/></>
                    : '';
            return <tr key={`${employee.wallet}_${employee.email}_${employee.name}_${employee.role}_${randomHex(5)}`}>
                <td>{employee.wallet} / {employee.email}</td>
                <td>{employee.role} ({employee.employeeType})</td>
                <td>{employee.salaryAmount} {employee.preferedTokenPayment.symbol}</td>
                <td>
                    <Flex flexDirection="row" width={1}>
                    {actionsForOwner}
                    <Icon color="blue" name="LocalSee" size="24px" onClick={ e => this.onClickSeeWallet(employee)}/>
                    </Flex>
                </td>
            </tr>;
        });
        return employeesRender;
    }

    renderCompanyDetails = () => {
        const { classes, ...others} = this.props;
        return this.state.company ? <CompanyDetailsItem
                width={1}
                height={1}
                item={this.state.company}
                employees={this.state.employees}
                {...others}/> : '';
    }

    renderCompany() {
        const { classes, config, info, ...others } = this.props;
        const { company } = this.state;

        const isOwner = company ? company.creator.toUpperCase() === info.selectedAddress.toUpperCase() : false;

        const companyDetailsRender = this.renderCompanyDetails();
        const employeesRender = this.renderEmployees();
        return (
            <div className={classes.wrapper}>
                <section className={`${classes.section} ${classes.style1}`} >
                    <div className={classes.inner}>
                        <header className={classes.header}>
                            <h1>'{this.state.company.name}' Details</h1>
                            <p>{this.state.company.description}</p>
                        </header>    
                    </div>
                    {/* <div className={classes.spotlights}> */}
                        <Flex flexDirection="row" width={1} height={1}>
                            <Flex flexDirection="column" width={1/4}>
                                {companyDetailsRender}
                            </Flex>
                            <Flex flexDirection="column" width={3/4} p={2}>
                                <Flex flexDirection="row" width={1} p={3}>
                                    <Button.Outline height={'20hv'} m={1} as="a" href="/companies" >
                                        Companies
                                    </Button.Outline>
                                    <Button disabled={!isOwner} height={'20hv'} m={1} onClick={ this.onClickCreateEmployee }>
                                        + Employee
                                    </Button>
                                </Flex>
                                <Text width={1} p={2} mr={5} textAlign="center" fontSize="21px">
                                    List of employees who work on {this.state.company.name} company.
                                </Text>
                                <br/>
                                <Table width={1}>
                                    <thead>
                                        <tr>
                                        <th>Name / Email</th>
                                        <th>Role</th>
                                        <th>Salary</th>
                                        <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employeesRender}
                                    </tbody>
                                </Table>
                            </Flex>
                            <EmployeeFormModal
                                config={config}
                                info={info}
                                width={2/3}
                                isOpen={this.state.isEmployeeFormOpened}
                                companies={this.state.companies}
                                closeModal={this.onCloseModal}
                                currentCompany={this.state.company}
                                employeeCreatedCallback={this.onEmployeeCreatedCallback}
                                {...others}
                            />
                            <EmployeePaymentFormModal
                                config={config}
                                info={info}
                                width={2/3}
                                isOpen={this.state.isEmployeePaymentFormOpened}
                                closeModal={this.onCloseEmployeePaymentModal}
                                employee={this.state.selectedEmployee}
                                //employeeCreatedCallback={this.onEmployeeCCallback}
                                {...others}
                            />
                        </Flex>
                    {/* </div> */}
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
                            <h1>Company Details</h1>
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
                    Loading company information...
                    </Text>
                </>
            );
        }
        return this.renderCompany();
    }
}

export default withStyles(styles)(CompanyDetails);
