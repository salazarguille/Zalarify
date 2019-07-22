import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import Header from './Header';
import { Flex, Text, Link } from 'rimble-ui';

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
        const { config, info } = this.props;
        return (
                <div style={{width: '100%', height:'100hv'}}>
                    <Header config={config} info={info} clickOnMenu={this.clickOnMenu}/>
                    {this.props.children}
                    <Flex width={1} height="70px" bg="#e8e8e8" borderRadius="10px" align="center">
                        <Text.p width={2/3} height={1} verticalAlign="middle" textAlign="center" fontSize="20px" bold>
                        ConsenSys Academy’s 2019 Blockchain Developer Bootcamp
                        </Text.p>
                        <Text.p width={1/4} height={1} verticalAlign="middle" textAlign="center" fontSize="20px" bold>
                            <Link href="https://github.com/salazarguille/Zalarify" fontSize="20px" bold height="100%" target="_blank" title="Github Repository">
                            Github Repo
                            </Link>
                        </Text.p>
                        <Text.p width={1/4} height={1} verticalAlign="middle" textAlign="center" fontSize="20px" bold>
                            <Link href="mailto:guillesalazar@gmail.com" fontSize="20px" bold height="100%" title="Send me an email">
                            Email me
                            </Link>
                        </Text.p>
                    </Flex>
                </div>
        );
    }
}

export default withStyles(styles)(Layout);