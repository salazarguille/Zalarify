import { withStyles } from '@material-ui/styles';
import React from 'react';

import Color from 'color';

/*
const Btn = props => (
    <Label as="a" {...props}>
        <Image spaced="right" src="metamask-logo.svg" />
        {props.children}
    </Label>
);
*/

const orange = Color('#f6851B');
/*
const MetamaskButton = styled(Btn)`
    &&&,
    &&&:hover {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        color: ${orange.lighten(0.2).hex()};
        border: 1px solid ${orange.hex()};
        background-color: ${orange.lighten(0.8).hex()};
        border-radius: 5px;
        margin: 0;

        &:hover {
            box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 10px;
        }
    }
`;
*/

const styles = theme => ({
    wrapper: {
	    padding: '6rem 0 4rem 0',
    },
});

class MetamaskButton extends React.Component {
    state = { }
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                {this.props.text || 'Install Metamask!'}
			</div>
        );
    }
}

export default withStyles(styles)(MetamaskButton);
