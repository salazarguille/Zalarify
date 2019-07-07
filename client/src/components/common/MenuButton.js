import { withStyles } from '@material-ui/styles';
import React from 'react';
import { NavLink } from "react-router-dom";

const styles = theme => ({
    menuButton: {
        borderColor: 'transparent',
        color: 'white',
        '&:active': { },
    },
    menuLink: {
        borderColor: 'transparent',
        background: 'transparent',
        fontFamily: '"Fjalla One", sans-serif',
        fontSize: '1.2rem',
        display: 'block',
        color: 'rgba(255, 255, 255, 0.5)',
        height: '100%',
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

class MenuButton extends React.Component {

    onClick = e => {
        e.preventDefault();
        const { onClick, value } = this.props;
        if( onClick ) {
            onClick(e, value);
        }
    }

    render() {
        const { classes, text, link, width } = this.props;
        return (
            <button style={{background: 'transparent', width: width, 'borderColor': 'transparent'}}>
                <NavLink
                className={classes.menuLink}
                to={`${link}`}>{text}</NavLink>
            </button>
        );
    }
}
export default withStyles(styles)(MenuButton);
