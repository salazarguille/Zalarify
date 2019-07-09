import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Card, Box, Flex, Button, Image, Heading } from 'rimble-ui';
import { Link } from "react-router-dom";

const styles = theme => ({
    row: {
        display: 'flex',
		flexWrap: 'wrap',
		boxSizing: 'border-box',
		alignItems: 'stretch',
        marginBottom: 0,
    },
    link: {
        'align-self': 'center',
        width: '50%'
    },
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

class CompanyItem extends React.Component {
    state = {
        name: undefined,
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

    render() {
        const getChars = this.getChars;
        const randomNumber = this.randomNumber;
        const { item, classes, maxDescriptionLength } = this.props;
        return (
            <Card width={'420px'} mx={'auto'} my={3} p={0}>
                <Image
                    width={1}
                    src={`https://dummyimage.com/420x240/${colors[randomNumber()]}/000000.png&text=${getChars(item.name)}`}
                    alt={`Name: ${item.name} - ID: ${item.id}`}
                />
                <Box px={4} py={3}>
                    <Heading.h2 textAlign="center">{item.name}</Heading.h2>
                    <hr width="75%"/>
                    <Heading.h5 textAlign="center" color="#666">{this.toFixedLength(item.description, maxDescriptionLength)}</Heading.h5>
                </Box>
                <Flex px={4} height={3} borderTop={1} borderColor={'#E8E8E8'}>
                    <Button.Text className={classes.button} onClick={e => this.onClickVisitWebsite(item.website)}>
                        Visit Website
                    </Button.Text>
                    <Link className={classes.link} to={`/company/${item.companyAddress}`}>Company Details</Link>
                </Flex>
            </Card>
            );
    }
}

export default withStyles(styles)(CompanyItem);
