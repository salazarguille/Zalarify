import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Card, Box, Flex, Button, Image, Heading } from 'rimble-ui';

const styles = theme => ({
    button: {
        height: '100%',
        'align-self': 'center',
        width: '50%'
    }
});

const colors = [
    'b8b8b8',
    'b383b3',
    '629dd1',
    '1587eb',
    '15ebb9',
    '99ffe6',
    'c75325',
    'deb8ab',
    'ffee6b',
    'b0a656'
];

class CompanyDetailsItem extends React.Component {
    state = {
        loading: true,
        item: undefined,
        employees: [],
        isSelectedAddressOwner: false,
    }

    getChars = (name) => {
        const array = name.split(' ');
        const result = array.map(word => word.substr(0,1));
        const text = result.length > 3 ? result.slice(0, 3) : result;
        return text.join('').toUpperCase();
    }
    
    randomNumber = () => {
        return Math.floor((Math.random() * 9));
    }

    onClickDetails = (e, item) => {
        const { onClick } = this.props;
        if( onClick ) {
            onClick(e, item);
        }
    }

    onClickVisitWebsite = (url) => {
        const win = window.open(url, '_blank');
        if(win !== undefined) {
            win.focus();
        }
    }

    toFixedLength = (text, length) => {
        return text.length > length ? text.substr(0, length) + '...' : text;
    }

    getCompanyInfo = () => {
        const { employees } = this.state;
        const info = employees
            .map( employee => employee.salaryAmount)
            .reduce( (p, c) => p + c, 0);
        return info;
    }

    static getDerivedStateFromProps(nextProps, nextContext) {
        if( nextProps.employees && nextProps.item) {
            return {
                employees: nextProps.employees,
                item: nextProps.item,
                loading: false,
            };
        }
    }

    componentDidMount() {
        // const { info } = this.props;
        // console.log(info.selectedAddress);
        // console.log(this.state.item.creator);
        // this.setState({
        //     isSelectedAddressOwner: this.state.item.creator === info.selectedAddress,
        // });
    }

    render() {
        const getChars = this.getChars;
        const randomNumber = this.randomNumber;
        const { classes } = this.props;
        const { item, employees } = this.state;
        const companyInfo = this.getCompanyInfo();
        return (
            <Card width={1} mx={'auto'} my={2} p={0}>
                <Image
                    width={1}
                    src={`https://dummyimage.com/200x170/${colors[randomNumber()]}/000000.png&text=${getChars(item.name)}`}
                    alt={`Name: ${item.name} - ID: ${item.id}`}
                />
                <Box px={4} py={3} width={1}>
                    <hr width="100%"/>
                    <Flex width={1} px={2} borderTop={1} borderColor={'#E8E8E8'} flexDirection="row">
                        <Button height={10} icon="Web" className={classes.button} onClick={e => this.onClickVisitWebsite(item.website)}>
                            Visit
                        </Button>
                    </Flex>
                    
                    <hr width="100%"/>
                    <Heading.h5 width={1} textAlign="center" color="#666">{`${employees.length} employees`}</Heading.h5>
                    <Heading.h5 width={1} textAlign="center" color="#666">{`${companyInfo} DAIs in salary`}</Heading.h5>
                </Box>
                <Flex width={1} px={4} borderTop={1} borderColor={'#E8E8E8'} flexDirection="column">
                    <hr width="100%"/>
                    <Heading.h5 textAlign="center" color="#666">{item.description}</Heading.h5>
                </Flex>
            </Card>
            );
    }
}

export default withStyles(styles)(CompanyDetailsItem);
