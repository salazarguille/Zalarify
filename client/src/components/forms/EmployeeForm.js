import { withStyles } from '@material-ui/styles';
import React from "react";
import axios from "axios";
import {
  Button,
  Form,
  Text
} from "rimble-ui";

const styles = theme => ({
  inputSelect: {
    color: '#3F3D4B',
    backgroundColor: '#fff',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: '16px',
    paddingRight: '16px',
    height: "3rem",
    border: '1px solid transparent',
    borderColor: '#CCC',
    borderRadius: '4px',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
    fontSize: '1rem',
    fontFamily: '"Source Sans Pro",sans-serif',
    width:'100%'
  },
});

class EmployeeForm extends React.Component {
  state = {
    validated: false,
    tokens: [],
    tokenSelected: "0",
    employee: {
      name: '',
      role: '',
      email: '',
      preferedTokenPayment: undefined,
      employeeType: 0,
      salaryAmount: '',
      wallet: '',
    },
    processing: false,
  };

  componentDidMount = async () => {
    const { employee, config } = this.props;

    const defaultToken = config.network.toLowerCase() === 'unknown' ? 'KNC' : 'DAI';
    const tokens = await axios.get(`${config.urls.backend}/tokens/${defaultToken}`);
    
    if( employee !== undefined) {
      employee.preferedTokenPayment = tokens.data;
      this.setState({
        employee,
        tokens: [tokens.data],
      });
    } else {
      this.setState({
        employee: {
          ...this.state.employee,
          preferedTokenPayment: tokens.data,
        },
        tokens: [tokens.data],
      });
    }
  };

  handleValidation = (e, field) => {
    e.preventDefault();
    this.setState({
      employee: {
        ...this.state.employee,
        [field]: e.target.value
      }
    });
    e.target.parentNode.classList.add('was-validated');
  };

  handleAddressValidation = (e, field) => {
    e.preventDefault();
    const { web3 } = this.props;
    const result = web3.utils.isAddress(e.target.value);
    this.setState({
      employee: {
        ...this.state.employee,
        [field]: e.target.value
      }
    });
    if(result === true) {
      e.target.parentNode.classList.add('was-validated');
      this.setState({
        validated: true,
      })
    } else {
      e.target.parentNode.classList.remove('was-validated');
      this.setState({
        validated: false,
      })
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const newEmployee = this.state.employee;
    if(this.props.handleSubmit !== undefined) {
      this.props.handleSubmit(newEmployee);
    }
  };

  renderSelectOptions = () => {
    return this.state.tokens.map(token => {
      return <option
              value={token.address}
              key={token.address}>{token.name} ({token.symbol} - {token.address})</option>;
    });
  };

  static getDerivedStateFromProps(nextProps, nextContext) {
    console.log('Derivative Form  ', nextProps);
    if( nextProps.processing ) {
        return {
          processing: nextProps.processing,
        };
    }
    return null;
}

  onChangeToken = (event) => {
    const newTokenSelected = this.state.tokens.find(item => item.address.toString() === event.target.value.toString());
    this.setState({
      ...this.state,
      employee: {
        ...this.state.employee,
        preferedTokenPayment: newTokenSelected
      }
    });
  };

  onChangeEmployeeType = (event) => {
    this.setState({
      ...this.state,
      employee: {
        ...this.state.employee,
        employeeType: event.target.value,
      }
    });
  };

  render() {
    const { classes } = this.props;
    const renderProcessing = this.props.processing ? <Text width={1} p={2} mr={5} textAlign="center" fontSize="21px">
    Transaction is processing...
  </Text> : '';
    return (
      <Form width={'100vw'} p={15} onSubmit={this.handleSubmit}>
        <Form.Field validated={this.state.validated} label="Name" width={1}>
          <Form.Input
            type="text"
            required
            style={{width:'100%'}}
            placeholder="John Smith"
            onChange={ e => this.handleValidation(e,'name')}
            value={this.state.employee.name}
          />
        </Form.Field>
        <Form.Field validated={this.state.validated} label="Employee Type" width={1}>
          <select
            required
            className={classes.inputSelect}
            onChange={this.onChangeEmployeeType}
          >
            <option value={0} key={0}>Employee</option>
            <option value={1} key={1}>Freelancer</option>
          </select>
        </Form.Field>
        <Form.Field validated={this.state.validated} label="Role" width={1}>
          <Form.Input
            type="text"
            required
            style={{width:'100%'}}
            placeholder="Blockchain Engineer"
            onChange={e => this.handleValidation(e, 'role')}
            value={this.state.employee.role}
          />
        </Form.Field>
        <Form.Field validated={this.state.validated} label="Email" width={'100%'}>
          <Form.Input
            type="email"
            required
            style={{width:'100%'}}
            placeholder="user@email.io"
            onChange={e => this.handleValidation(e, 'email')}
            value={this.state.employee.email}
          />
        </Form.Field>
        <Form.Field validated={this.state.validated} label="Wallet" width={1}>
          <Form.Input
            type="text"
            required
            style={{width:'100%'}}
            placeholder="0x000000000000000000000000000000"
            onChange={e => this.handleAddressValidation(e, 'wallet')}
            value={this.state.employee.wallet}
          />
        </Form.Field>
        <Form.Field validated={this.state.validated} label="ERC20 Token" width={1}>
          <select
            required
            className={classes.inputSelect}
            onChange={this.onChangeToken}
          >
            {this.renderSelectOptions()}
          </select>
        </Form.Field>
        <Form.Field validated={this.state.validated} label={`Salary Amount (${this.state.employee.preferedTokenPayment ? this.state.employee.preferedTokenPayment.symbol : '' })`} width={1}>
          <Form.Input
            type="number"
            required
            style={{width:'100%'}}
            placeholder={`10 (${this.state.employee.preferedTokenPayment ? this.state.employee.preferedTokenPayment.symbol : ''})`}
            onChange={e => this.handleValidation(e, 'salaryAmount')}
            value={this.state.employee.salaryAmount}
          />
        </Form.Field>
        {renderProcessing}
        <Button disabled={this.props.processing} type="submit" style={{width:'100%'}}>
          Create
        </Button>
      </Form>
    );
  }
}

export default withStyles(styles)(EmployeeForm);