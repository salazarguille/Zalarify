import { withStyles } from '@material-ui/styles';
import React from "react";
import axios from "axios";
import {
  Button,
  Form,
  Text,
  Flex,
  Checkbox
} from "rimble-ui";
import BigNumber from 'bignumber.js';

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

class EmployeePaymentForm extends React.Component {
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
      salaryAmount: 0,
      wallet: '',
    },
    tokenRate: {
      minRate: 0,
      maxRate: 0,
      provider: '',
      providerKey: '',
      targetAmount: 0,
    },
    tokenSelected: undefined,
    processing: false,
    isLoadingRate: true,
    isTokenApprove: false,
  };

  componentDidMount = async () => {
    const { employee, config } = this.props;
    const tokens = await axios.get(`${config.urls.backend}/tokens`);
    const tokenSelected = tokens.data[0];
    this.setState({
      employee,
      tokens: tokens.data,
      tokenSelected,
    });
    await this.updateTokenRate(tokenSelected);
    const isTokenApprove = await this.isApproveTokens(tokenSelected);
    this.setState({
      isTokenApprove
    });
  };

  onClickApprove = e => {
    e.preventDefault();
    const { tokenSelected, tokenRate, isTokenApprove } = this.state;
    console.log('On approve ', isTokenApprove);

    if( this.props.onClickApproveERC20Contract !== undefined && !isTokenApprove) {

      const approvePromise = this.props.onClickApproveERC20Contract(tokenSelected, tokenRate);
      if(approvePromise !== undefined) {
        approvePromise.then( async result => {
          const tokenSelected = this.state.tokenSelected;
          const isTokenApprove = await this.isApproveTokens(tokenSelected);
          this.setState({
            isTokenApprove,
          });
        });
      }
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const { wallet, preferedTokenPayment } = this.state.employee;
    const { minRate, maxRate, targetAmount, providerKey} = this.state.tokenRate;
    console.log('handleSubmit ', preferedTokenPayment);

    if(this.props.handleSubmit !== undefined) {
      const { tokenSelected } = this.state;
      /*
        address to;
        address sourceToken;
        address targetToken;
        uint targetAmount;
        uint sourceAmount;
        uint minRate;
        uint maxRate;
        bytes32 provider;
  */
      const payment = [
        wallet,
        tokenSelected.address,
        preferedTokenPayment.address,
        targetAmount,
        maxRate,
        minRate,
        maxRate,
        providerKey
      ];
      console.log(payment);
      console.log('On click payWithTokens ', maxRate);
      this.props.handleSubmit(payment);
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
    if( nextProps.processing && nextProps.employee) {
        return {
          processing: nextProps.processing,
          employee: nextProps.employee,
        };
    }
    return null;
  }

  updateTokenRate = async (tokenSelected) => {
    const { salaryAmount, preferedTokenPayment } = this.state.employee;
    const { config } = this.props;
    this.setState({
      isLoadingRate: true,
    });
    console.log(`updateTokenRate Token Selected:  `, tokenSelected);
    console.log(`updateTokenRate Employee preferedTokenPayment:  `, preferedTokenPayment);
    const rateResult = await axios.get(`${config.urls.backend}/tokens/${tokenSelected.address}/rate/${preferedTokenPayment.address}?targetAmount=${salaryAmount}`);
    this.setState({
      tokenRate: rateResult.data,
      isLoadingRate: false,
    });
  }

  getERC20Contract = (address) => {
    const { contracts, web3 } = this.props;
    const currentContractData = contracts.find(contract => contract.name === 'ERC20');
    const contract = currentContractData.abi;
    const instance = new web3.eth.Contract(
        contract.abi,
        address
    );
    return instance;
  }

  isApproveTokens = async (newTokenSelected) =>{
    const { info, companyAddress } = this.props;
    const { tokenRate } = this.state;
    const erc20 = this.getERC20Contract(newTokenSelected.address);
    const tokenAllowance = await erc20.methods.allowance(info.selectedAddress, companyAddress).call({from: info.selectedAddress});
    
    const tokenAllowanceResult = BigNumber(tokenAllowance.toString()).gte(tokenRate.maxRate);
    console.log('Allowance');
    console.log(`Current Allowance: ${tokenAllowance.toString()}`);
    console.log(`Current amount:    ${tokenRate.maxRate}`);
    console.log(`Is Allowed?:       ${tokenAllowanceResult}`);
    return tokenAllowanceResult;
  }

  onChangeToken = async (event) => {
    const newTokenSelected = this.state.tokens.find(item => item.address.toString() === event.target.value.toString());
    await this.updateTokenRate(newTokenSelected);
    const isTokenApprove = await this.isApproveTokens(newTokenSelected);
    this.setState({
      tokenSelected: newTokenSelected,
      isTokenApprove,
    });
  };

  render() {
    const { classes } = this.props;
    const { employee, tokenRate, tokenSelected, isLoadingRate, isTokenApprove } = this.state;
    console.log('On render, isTokenApprove  ', isTokenApprove);
    const renderProcessing = this.props.processing ? <Text width={1} p={2} mr={5} textAlign="center" fontSize="21px">
    Transaction is processing...
    </Text> : '';
    const renderRate = isLoadingRate ? 'Loading rate...' : <>Max Rate: {tokenRate.maxRateUnit} {tokenSelected.symbol} ~= {employee.salaryAmount} {employee.preferedTokenPayment.symbol}</>;

    const renderApproveTokens = isLoadingRate || isTokenApprove ? '' : <Checkbox
              label="Approve tokens"
              //required={true}
              defaultChecked={isTokenApprove}
              disabled={this.props.processing || this.state.isLoadingRate }//|| this.state.isTokenApprove
              onClick={ e => this.onClickApprove(e)}
            />;
    return (
      <Form width={'100vw'} p={15} onSubmit={this.handleSubmit}>
        <Flex width={1} flexDirection="column">
          <Text
            bold={true}
            fontSize={3}
          >Name</Text>
          <Text
          >{this.state.employee.name || '--'}</Text>
        </Flex>
        <Flex width={1} flexDirection="column">
          <Text
            bold={true}
            fontSize={3}
          >Wallet</Text>
          <Text
          >{this.state.employee.wallet || '--'}</Text>
        </Flex>
        <Flex width={1} flexDirection="column">
          <Text
            bold={true}
            fontSize={3}
          >Salary Amount / Prefered Token</Text>
          <Text
          >
            {`${employee.salaryAmount} ` || '-- '}
            {employee.preferedTokenPayment ? `${employee.preferedTokenPayment.name} (${employee.preferedTokenPayment.symbol})` : '--'}
          </Text>
        </Flex>
        <Form.Field validated={this.state.validated} label="ERC20 Token" width={1}>
          <select
            required
            className={classes.inputSelect}
            onChange={this.onChangeToken}
          >
            {this.renderSelectOptions()}
          </select>
        </Form.Field>
        <Flex width={1} flexDirection="column">
          <Text
            bold={true}
            fontSize={3}>Rate</Text>
          <Text>
            {renderRate}
          </Text>
        </Flex>
        {renderApproveTokens}
        {renderProcessing}
        <Button disabled={this.props.processing || this.state.isLoadingRate || !this.state.isTokenApprove } type="submit" style={{width:'100%'}}>
          Create
        </Button>
      </Form>
    );
  }
}

export default withStyles(styles)(EmployeePaymentForm);