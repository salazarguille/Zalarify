import { withStyles } from '@material-ui/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import axios from "axios";
import {
  Button,
  Form,
  Text,
  Flex,
  Checkbox,
} from "rimble-ui";
import BigNumber from 'bignumber.js';
import { listenOn } from "../utils/txs";

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
    validation: {
      isValid: false,
      message: undefined,
    },
    tokens: [],
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
    tokenBalance: 0,
    processing: false,
    isLoadingRate: true,
    isTokenApprove: false,
    isEnoughBalance: false,
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
    await this.updateTokensApprove(tokenSelected);
  };

  toast = (component, isError = false) => {
    if (isError) {
      this.setNotProcessing();
      toast.error(component, {
        hideProgressBar: false,
      });
    } else {
      toast.info(component, {
        hideProgressBar: false,
      });
    }
  };

  setProcessing = () => {
    this.setState({
      processing: true,
    });
  }

  setNotProcessing = async () => {
    const { tokenSelected } = this.state;
    this.clearValidationError();
    await this.updateTokenRate(tokenSelected);
    await this.updateTokensApprove(tokenSelected);
    this.setState({
      processing: false,
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

  onClickApprove = e => {
    e.preventDefault();
    const { tokenSelected, tokenRate } = this.state;

    const { info, config, companyAddress } = this.props;
    const erc20 = this.getERC20Contract(tokenSelected.address);
    console.log('On click approve ', tokenRate.maxRate);
    console.log('On click approve ', erc20.address);
    console.log('tokenSelected ', tokenSelected);
    try {
      this.setProcessing();
      
      const approveResult = erc20
        .methods
        .approve(companyAddress, tokenRate.maxRate)
        .send({from: info.selectedAddress});

      listenOn(approveResult, this, config);

    } catch (error) {
      this.toast(<div>
        {`Message: ${error.message}`}
      </div>, true);
    }

  };

  handleSubmit = e => {
    e.preventDefault();
    const { wallet, preferedTokenPayment } = this.state.employee;
    const { minRate, maxRate, targetAmount, providerKey} = this.state.tokenRate;
    const { companyAddress } = this.props;

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
      this.props.handleSubmit({
        payment,
        sourceToken: this.state.tokenSelected,
        tokenRate: this.state.tokenRate,
        employee: this.state.employee,
        companyAddress,
      });
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

  updateTokensApprove = async (newTokenSelected) =>{
    const { info, companyAddress } = this.props;
    const { tokenRate } = this.state;
    const erc20 = this.getERC20Contract(newTokenSelected.address);
    const tokenAllowance = await erc20.methods.allowance(info.selectedAddress, companyAddress).call({from: info.selectedAddress});
    const tokenBalance = await erc20.methods.balanceOf(info.selectedAddress).call({from: info.selectedAddress});
    
    const tokenBalanceResult = BigNumber(tokenBalance.toString()).gte(tokenRate.maxRate);
    const tokenAllowanceResult = BigNumber(tokenAllowance.toString()).gte(tokenRate.maxRate);
    // console.log('Allowance');
    // console.log(`Current Allowance: ${tokenAllowance.toString()}`);
    // console.log(`Current Balance:   ${tokenBalance.toString()}`);
    // console.log(`Current Balance:   ${BigNumber(tokenBalance.toString()).toFixed(2)}`);
    // console.log(`Current amount:    ${tokenRate.maxRate}`);
    // console.log(`Is Allowed?:       ${tokenAllowanceResult}`);
    // console.log(`Enough Balance?:   ${tokenBalanceResult}`);

    this.setState({
      tokenBalance: tokenBalance.toString(),
      isTokenApprove: tokenAllowanceResult,
      isEnoughBalance: tokenBalanceResult,
    });

    if (!tokenBalanceResult) {
      this.setValidationError(`Not enough ${newTokenSelected.symbol} token balance.`);
      return;
    }
    
    if (!tokenAllowanceResult) {
      this.setValidationError(`Please, approve ${newTokenSelected.symbol} tokens transfer.`);
    }
  }

  onChangeToken = async (event) => {
    this.clearValidationError();
    const newTokenSelected = this.state.tokens.find(item => item.address.toString() === event.target.value.toString());
    await this.updateTokenRate(newTokenSelected);
    await this.updateTokensApprove(newTokenSelected);
    this.setState({
      tokenSelected: newTokenSelected,
    });
  };

  setValidationError = (errorMessage) => {
    this.setState({
      validation: {
        isValid: false,
        message: errorMessage,
      }
    });
  }

  clearValidationError = () => {
    this.setState({
      validation: {
        isValid: true,
        message: undefined,
      }
    });
  }

  renderValidation = () => {
    const { validation } = this.state;
    return validation.isValid ? '' : 
      <Text
        width={1}
        bold={true}
        color={'red'}
        m="1"
        textAlign="center"
        borders={'1px'}
        borderColor="red"
        borderRadius="15px"
        fontSize={3}
        visible={false}>
        {validation.message}
      </Text>;
  }

  renderBalanceRate = () => {
    const { employee, tokenRate, tokenSelected, isLoadingRate, isTokenApprove } = this.state;
    if (isLoadingRate) {
      return 'Loading rate...'
    } else {
      const maxRateUnitFixed = BigNumber(tokenRate.maxRateUnit.toString()).toFixed(2);
      let rate = <>{maxRateUnitFixed} {tokenSelected.symbol} ~= {employee.salaryAmount} {employee.preferedTokenPayment.symbol}</>;
      if(isTokenApprove) {
        rate = <>
                {rate}
                <br/>
                <Text
                  bold={true}
                  fontSize={2}
                  >Approved tokens
                </Text>
              </>;
      } else {
        rate = <>
                {rate}
                <br/>
                <Checkbox
                  label="Approve Tokens"
                  defaultChecked={false}
                  disabled={this.state.processing || isLoadingRate || isTokenApprove}
                  onClick={ e => this.onClickApprove(e)}
                />
              </>;
      }
      return rate;
    }
  }

  render() {
    const { classes, info, company } = this.props;
    const { employee } = this.state;
    const renderProcessing = this.state.processing ? <Text width={1} p={2} mr={5} textAlign="center" fontSize="21px">
    Transaction is processing...
    </Text> : '';
    const renderRate = this.renderBalanceRate();
    const preferredTokenName = employee.preferedTokenPayment ? `${employee.preferedTokenPayment.name} (${employee.preferedTokenPayment.symbol})` : '--';

    const isOwner = info.selectedAddress.toUpperCase() === company.creator.toUpperCase();
    const ownerMessage = !isOwner ? <Text width={1} p={2} mr={5} textAlign="left" fontSize="14px" italic color="#ff0000">
                                      The current account {info.selectedAddress} is not a company owner. Sorry, you can't transfer payrolls to employees.
                                    </Text> : '';
    return (
      <Form width={'100vw'} p={15} onSubmit={this.handleSubmit}>
        {this.renderValidation()}
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
            {preferredTokenName}
          </Text>
        </Flex>
        <Form.Field label="ERC20 Token" width={1}>
          <select
            required
            className={classes.inputSelect}
            onChange={this.onChangeToken}
          >
            {this.renderSelectOptions()}
          </select>
          <Text width={1} p={2} mr={5} textAlign="left" fontSize="14px" italic>
            The ERC20 token you would like to use to transfer the payroll to the employee. The employee will receive {preferredTokenName}.
          </Text>
        </Form.Field>
        <Flex width={1} flexDirection="column">
          <Text
            bold={true}
            fontSize={3}>Rate</Text>
          <Text>
            {renderRate}
          </Text>
          <Text width={1} p={2} mr={5} textAlign="left" fontSize="14px" italic>
            The payment must be made in two steps. First allow to Zalarify to use the tokens you selected, and finally make the payment.
          </Text>
          <Text width={1} p={2} mr={5} textAlign="left" fontSize="14px" italic color="red">
            Remember to increase the gas fee in the payment transaction in order to decrease the processing time. 
          </Text>
        </Flex>
        {renderProcessing}
        {ownerMessage}
        <Button disabled={this.state.processing || this.state.isLoadingRate || !this.state.isTokenApprove || !isOwner} type="submit" style={{width:'100%'}}>
          Pay Salary
        </Button>
        <ToastContainer
          position="bottom-right"
          autoClose={10000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
      </Form>
    );
  }
}

export default withStyles(styles)(EmployeePaymentForm);