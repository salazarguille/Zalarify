import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { withStyles } from '@material-ui/styles';
import Layout from './components/common/Layout';
import CompanyList from './components/lists/CompanyList';
import CompanyDetails from './components/company/CompanyDetails';
import WithWeb3 from './ethereum/web3/hoc/WithWeb3';

import { getCurrentConfig } from './config';
const config = getCurrentConfig();

const styles = theme => ({
  
});

class App extends Component {
    state = {
      config,
      companies: [],
    };

    componentDidMount() { }

    render() {
        return (
          <Router>
            <Layout config={this.state.config}>
              <Route path="/" exact render={ (props) => <p>Hola</p>}/>
              <Route path="/companies/" render={ (props)=> <CompanyList {...props} items={this.state.companies} config={this.state.config}/>}/>
              <Route path="/company/:companyAddress" component={ ({match}) => 
              <WithWeb3
                config={this.state.config}
                network={this.state.config.network}
                handleStatus={false}
                contracts={this.state.config.contracts}
                currentContract="IZalarify"
              >
                {(props) => (
                  <CompanyDetails {...match.params}  {...props}/> 
                )}
                </WithWeb3>
              }/>
            </Layout>
          </Router>
        );
    }
}

export default withStyles(styles)(App);
