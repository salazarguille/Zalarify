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
            <WithWeb3
              config={this.state.config}
              network={this.state.config.network}
              handleStatus={false}
              contracts={this.state.config.contracts}
              currentContract="IZalarify"
            >
              {(props) => (
              <Layout config={this.state.config}>
                <Route
                  path="/"
                  exact
                  render={ () => <p>Hi</p>}
                />
                <Route
                  path="/companies/"
                  render={ ()=> <CompanyList {...props} items={this.state.companies} config={this.state.config}/>}
                />
                <Route
                  path="/company/:companyAddress"
                  render={ ({match}) => <CompanyDetails {...match.params}  {...props}/> }
                />
                {/* <Route
                  path='*'
                  exact={true}
                  render={ ({match}) => <p>Page not found.</p>}
                /> */}
              </Layout>
              )}
            </WithWeb3>
          </Router>
        );
    }
}

export default withStyles(styles)(App);
