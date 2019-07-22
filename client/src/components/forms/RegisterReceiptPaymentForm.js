import { withStyles } from '@material-ui/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import {
  Button,
  Form,
  Text,
  Flex,
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

class RegisterReceiptPaymentForm extends React.Component {
  state = {
    validation: {
      isValid: false,
      message: undefined,
    },
    paymentData: {
      companyAddress: undefined,
      employee: undefined,
      payment: undefined,
      sourceToken: undefined,
      tokenRate: undefined,
    },
    processing: false,
  };

  componentDidMount = async () => {
    const { paymentData } = this.props;
    this.setState({
      paymentData,
    });
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
    this.clearValidationError();
    this.setState({
      processing: false,
    });
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { handleSubmit } = this.props;
    if( handleSubmit !== undefined ){
      handleSubmit();
    }
  };

  static getDerivedStateFromProps(nextProps, nextContext) {
    if( nextProps.processing || nextProps.paymentData) {
        return {
          processing: nextProps.processing,
          paymentData: nextProps.paymentData,
        };
    }
    return null;
  }

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

  render() {
    const { paymentData } = this.state;
    const { employee, tokenRate, sourceToken, companyAddress } = paymentData;
    const renderProcessing = this.state.processing ? <Text width={1} p={2} mr={5} textAlign="center" fontSize="21px">
    Transaction is processing...
    </Text> : '';

    return (
      <Form width={'100vw'} p={15} onSubmit={this.handleSubmit}>
        <Flex width={1} flexDirection="column">
          <Text
            bold={true}
            fontSize={3}
          >Name</Text>
          <Text
          >{employee.name || '--'}</Text>
        </Flex>
        <Flex width={1} flexDirection="column">
          <Text
            bold={true}
            fontSize={3}
          >Wallet</Text>
          <Text
          >{employee.wallet || '--'}</Text>
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
        <Flex width={1} flexDirection="column">
          <Text
            bold={true}
            fontSize={3}
          >Company Address</Text>
          <Text
          >
            {companyAddress}
          </Text>
        </Flex>
        <Flex width={1} flexDirection="column">
          <Text
            bold={true}
            fontSize={3}
          >Provider / Source Token</Text>
          <Text
          >
            {tokenRate.provider} / ~={new BigNumber(tokenRate.maxRateUnit).toFixed(2)} {sourceToken.symbol} ({sourceToken.name})
          </Text>
        </Flex>
        <br/>
        {renderProcessing}
        <br/>
        <Button disabled={this.state.processing }  type="submit" style={{width:'100%'}}>
          Register Receipt
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

export default withStyles(styles)(RegisterReceiptPaymentForm);