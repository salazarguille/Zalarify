import { withStyles } from '@material-ui/styles';
import React from 'react';
import Color from 'color';
import { Button, Flex } from "rimble-ui";

const orange = Color('#f6851B');


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
    div: {
	    display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        color: orange.lighten(0.2).hex(),
        border: `1px solid ${orange.hex()}`,
        backgroundColor: `${orange.lighten(0.8).hex()}`,
        borderRadius: '5px',
        textAlign: 'center',
        margin: 0
    },
});

class MetamaskLocked extends React.Component {
    state = {}

    render() {
        const { classes, network } = this.props;
        console.log(network);
        return (
            <div className={classes.wrapper}>
                <div className={classes.inner}>
					<header className={classes.header}>
						<h1>Your Metamask Extension is Locked</h1>
                    <p>Please, signin into your Metamask account to interact to Zalarify.</p>
                    </header>
                    <Flex width={1} flexDirection="row" justifyContent="center">
                        <Button.Outline onClick={this.props.onClick} title="Connect">Connect</Button.Outline>
                    </Flex>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(MetamaskLocked);
