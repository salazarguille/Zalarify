import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { withStyles } from '@material-ui/styles';
import Layout from './components/common/Layout';
import CompanyList from './components/lists/CompanyList';
import EmployeeDetails from './components/employee/EmployeeDetails';
import CompanyDetails from './components/company/CompanyDetails';
import Home from './components/home/Home';
import Integration from './components/home/Integration';
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
                  render={ () => <Home {...props} config={this.state.config}/>}
                />
                <Route
                  path="/integration"
                  render={ () => <Integration {...props} config={this.state.config}/>}
                />
                <Route
                  path="/companies/"
                  render={ ()=> <CompanyList {...props} items={this.state.companies} config={this.state.config}/>}
                />
                <Route
                  path="/company/:companyAddress/employee/:employeeAddress"
                  exact
                  render={ ({match}) => <EmployeeDetails {...match.params}  {...props}/> }
                />
                <Route
                  path="/company/:companyAddress"
                  exact
                  render={ ({match}) => <CompanyDetails {...match.params}  {...props}/> }
                />
              </Layout>
              )}
            </WithWeb3>
          </Router>
        );
    }
}

export default withStyles(styles)(App);
