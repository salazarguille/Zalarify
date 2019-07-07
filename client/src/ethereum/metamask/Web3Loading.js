import { withStyles } from '@material-ui/styles';
import React from 'react';
import Color from 'color';

const blue = Color('#516bf0');

/*
const Div = styled.div`
    &&& {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        color: ${blue.lighten(0.2).hex()};
        border: 1px solid ${blue.hex()};
        background-color: ${blue.lighten(0.8).hex()};
        border-radius: 10px;
    }
`;
*/

const styles = theme => ({
    div: {
	    display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        color: blue.lighten(0.2).hex(),
        border: `1px solid ${blue.hex()}`,
        backgroundColor: `${blue.lighten(0.8).hex()}`,
        borderRadius: '10px'
    },
});

class Web3Loading extends React.Component {
    state = {}
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.div}>
                Loading Web3. Please, signin to Metamask.
			</div>
        );
    }
}

export default withStyles(styles)(Web3Loading);
