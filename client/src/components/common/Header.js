import { withStyles } from '@material-ui/styles';
import React from 'react';
import { Flex, Text } from 'rimble-ui';
import MenuButton from './MenuButton';

const styles = theme => ({
  header: {
    '-moz-justify-content': 'space-between',
    '-webkit-justify-content': 'space-between',
    '-ms-justify-content': 'space-between',
    justifyContent: 'space-between',
    //color: 'rgba(255, 255, 255, 0.5)',
    cursor: 'default',
    height: '3.25rem',
    lineHeight: '3.25rem',
    //position: 'fixed',
    //top: 0,
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
    constructor(props) {
        super(props);
    }

    onClickMenuButton = (e, name) => {
        console.log(name);
    }

    render() {
        const { classes } = this.props;
        return (
            <Flex
                //className={classes.header}
                width={1}
                flexDirection={'row'}
                bg="#4468ca">
                <Flex
                    width={1/4}
                    pl="15px"
                    pt="5px"
                    verticalAlign="middle"
                    flexDirection={'row'}>
                    <Text
                        fontFamily="Fjalla One"
                        fontSize="24px"
                        color="white"
                        height={'100hv'} verticalAlign="middle">Zalarify</Text>
                </Flex>
                <Flex width={3 / 4} flexDirection={'row'}>
                    <MenuButton width="25vw" text="Home" value="home" link="/" onClick={this.onClickMenuButton} />
                    <MenuButton width="25vw" text="Companies" value="company" link="/companies" onClick={this.onClickMenuButton} />
                    <MenuButton width="25vw" text="Integration" value="integration" onClick={this.onClickMenuButton} />
                </Flex>
			</Flex>
        );
    }
}

export default withStyles(styles)(Header);
