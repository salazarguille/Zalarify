import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import Header from './Header';

const styles = theme => ({
    footer: {
        width: '100wv',
    }
});

class Layout extends Component {
    state = { };

    clickOnMenu = (event, menuName) => {
        console.log(menuName);
    };


    render() {
        const { config } = this.props;
        return (
                <div style={{width: '100%', height:'100hv'}}>
                    <Header config={config} clickOnMenu={this.clickOnMenu}/>
                    {this.props.children}
                </div>
        );
    }
}

export default withStyles(styles)(Layout);