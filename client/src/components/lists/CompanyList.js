import { withStyles } from '@material-ui/styles';
import axios from "axios";
import React from 'react';
import { Flex, Text, Loader, Button } from 'rimble-ui';
import CompanyItem from './items/CompanyItem';
import CompanyFormModal from '../modals/CompanyFormModal';
import MessageModal from '../modals/MessageModal';

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
/*

        */
class CompanyList extends React.Component {
    _isMounted = false;
    state = {
        items: [],
        loading: true,
        errorMessage: undefined,
        isCompanyFormOpened: false,
        isActionMessageOpened: false,
        action: {
            isSuccess: false,
            message: undefined,
        }
    }

    updateCompanies = async () => {
        const { config } = this.props;
        try {
            const getCompaniesResult = await axios.get(`${config.urls.backend}/companies`)
            if (this._isMounted) {
                this.setState({
                    ...this.state,
                    items: getCompaniesResult.data.items,
                    loading: false,
                });
            }
        } catch (reason) {
            console.log(reason);
            this.setState({
                errorMessage: `Error getting data: ${reason.toString()}`,
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount = () => {
        this._isMounted = true;
        this.updateCompanies();
    }

    renderCompanies = () => {
        const { items } = this.state;
        const itemsRender = items.map(item => <CompanyItem key={item.id} item={item} maxDescriptionLength="100"/>);
        return (
            <>
                <Text width={1} p={'0'} mr={4} height={3} textAlign="center" fontSize="21px">
                {items.length} companies in Zalarify
                </Text>
                {itemsRender}
            </>
        );
    }

    renderLoading = () => {
        return (
            <Flex flexDirection="column" width={1}>
                <Loader color="black" size="80px" width={1}/>
                <Text width={1} p={'0'} mr={4} height={3} textAlign="center" fontSize="21px">
                    Loading companies...
                </Text>
            </Flex>
        );
    }

    onClickCreateCompany = () => {
        this.setState({
            isCompanyFormOpened: true
        });
    }

    onCompanyCreatedCallback = (item) => {
        this.setState({
            isCompanyFormOpened: false
        });
        this.updateCompanies();
        this.openActionMessage(`Your company was created successfully.`, true);
    }

    onCloseCompanyForm = () => {
        this.setState({
            isCompanyFormOpened: false
        });
    }

    onCloseActionMessage = () => {
        this.setState({
            isActionMessageOpened: false,
            action: {
                isSuccess: false,
                message:undefined
            }
        });
    }

    openActionMessage = (message, isSuccess) => {
        this.setState({
            isActionMessageOpened: true,
            action: {
                isSuccess,
                message
            }
        });
    }

    renderContent = (content) => {
        const { classes, config, ...others } = this.props;
        return (
            <div className={classes.wrapper}>
                <section className={`${classes.section} ${classes.style1}`} >
                    <div className={classes.inner}>
                        <header className={classes.header}>
                            <h1>Companies That Trust Us</h1>
                            <p>They are some companies which already have joined us.</p>
                        </header>    
                    </div>
                    <Flex flexDirection="row" width={1} p={3}>
                        <Button height={'20hv'} m={1} onClick={ this.onClickCreateCompany }>
                            + Company
                        </Button>
                    </Flex>
                    <div className={classes.spotlights}>
                        {content}
                    </div>
                </section>
                <Flex flexDirection="row" width={1}>
                    <CompanyFormModal
                        config={config}
                        width={2/3}
                        isOpen={this.state.isCompanyFormOpened}
                        companies={this.state.companies}
                        closeModal={this.onCloseCompanyForm}
                        companyCreatedCallback={this.onCompanyCreatedCallback}
                        {...others}
                    />
                    <MessageModal
                        width={2/3}
                        isOpen={this.state.isActionMessageOpened}
                        closeModal={this.onCloseActionMessage}
                        message={this.state.action.message}
                        isSuccess={this.state.action.isSuccess}
                        {...others}
                    />
                </Flex>
            </div>
        );
    }

    render() {
        const { loading, errorMessage } = this.state;
        if(errorMessage !== undefined) {
            return this.renderContent(
                <Text width={1} p={'0'} mr={4} height={3} textAlign="center" fontSize="21px">
                    {errorMessage}. Please try later.
                </Text>
            );
        }
        
        const tableContent = loading ? this.renderLoading() : this.renderCompanies();

        return this.renderContent(
            <>{tableContent}</>
        );;
    }
}

export default withStyles(styles)(CompanyList);
