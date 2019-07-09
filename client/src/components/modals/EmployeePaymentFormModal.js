import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Heading,
  Text,
  Modal,
  Flex,
  Box,
} from "rimble-ui";
import ModalCard from './ModalCard';
import EmployeePaymentForm from "../forms/EmployeePaymentForm";

class EmployeePaymentFormModal extends React.Component {
  state = {
    processing: false,
  };

  getZalarifyCompanyContract = () => {
    const { contracts, web3, companyAddress } = this.props;
    const currentContractData = contracts.find(contract => contract.name === 'IZalarifyCompany');
    const contract = currentContractData.abi;
    const instance = new web3.eth.Contract(
        contract.abi,
        companyAddress
    );
    return instance;
  }

  setProcessing = () => {
    this.setState({
      processing: true,
    });
  }

  setNotProcessing = () => {
    this.setState({
      processing: false,
    });
  }

  static getDerivedStateFromProps(nextProps, nextContext) {
    console.log('Derivative Form Modal  ', nextProps);
    if( nextProps.processing && nextProps.employee) {
        return {
          processing: nextProps.processing,
          employee: nextProps.employee,
        };
    }
    return null;
  }

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
  }

  invokeZalarifyContractPay = (payment) => {
    const { info, config } = this.props;
    let result;

    try {
      const zalarifyCompany = this.getZalarifyCompanyContract();
      this.setProcessing();
      result = zalarifyCompany.methods.payWithTokens(payment).send({from: info.selectedAddress, gas: config.maxGas});
    } catch (error) {
      this.toast(<div>
        {`Message: ${error.message}`}
      </div>, true);
    }
    return result;
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

  onClickApproveERC20Contract = (tokenSelected, tokenRate) => { 
    try {
      const { info, config, companyAddress } = this.props;
      const erc20 = this.getERC20Contract(tokenSelected.address);
      console.log('On click approve ', tokenRate.maxRate);
      console.log('On click approve ', erc20.address);
      console.log('tokenSelected ', tokenSelected);

      const approveResult = erc20
        .methods
        .approve(companyAddress, tokenRate.maxRate)
        .send({from: info.selectedAddress});
      this.setProcessing();

      approveResult.on('transactionHash', (hash) => {
        if(config.network === 'unknown') {
          this.setNotProcessing();
          approveResult.removeAllListeners();
        }
        this.toast(<div>
          <a href={`${config.explorer.tx}${hash}`} rel="noopener noreferrer" target="_blank">Processing Transaction</a>
        </div>);
      })
      .on('receipt', (receipt) => {
        console.log(receipt);
        this.toast(<div>
          Success <a href={`${config.explorer.tx}${receipt.tx}`} rel="noopener noreferrer" target="_blank">Transaction</a>
        </div>);
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        if(confirmationNumber < 2) {
          this.toast(<div>
            {`Confirmation #${confirmationNumber}`} <a href={`${config.explorer.tx}${receipt.tx}`} rel="noopener noreferrer" target="_blank">View Transaction</a>
          </div>);
        } else {
          if (confirmationNumber === 2) {
            this.setNotProcessing();
            approveResult.removeAllListeners();
          }
        }
      })
      .on('error', (error) => {
        this.toast(<div>
          {`Message: ${error.message}`}
        </div>, true);
      });
      
      return approveResult;
    } catch (error) {
      this.toast(<div>
        {`Message: ${error.message}`}
      </div>, true);
    }
  }

  handleSubmit = async (item) => {
    const { config, employeeCreatedCallback } = this.props;

    const result = this.invokeZalarifyContractPay(item);
    result.on('transactionHash', (hash) => {
        this.toast(<div>
          <a href={`${config.explorer.tx}${hash}`} rel="noopener noreferrer" target="_blank">Processing Transaction</a>
        </div>);
      })
      .on('receipt', (receipt) => {
        console.log(receipt);
        this.toast(<div>
          Success <a href={`${config.explorer.tx}${receipt.tx}`} rel="noopener noreferrer" target="_blank">Transaction</a>
        </div>);
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        if(confirmationNumber < 2) {
          this.toast(<div>
            {`Confirmation #${confirmationNumber}`} <a href={`${config.explorer.tx}${receipt.tx}`} rel="noopener noreferrer" target="_blank">View Transaction</a>
          </div>);
        } else {
          if (confirmationNumber === 2) {
            this.setNotProcessing();
            employeeCreatedCallback(item, receipt);
            result.removeAllListeners();
          }
        }
      })
      .on('error', (error) => {
        this.toast(<div>
          {`Message: ${error.message}`}
        </div>, true);
      });

  };

  renderContent = () => {
    const {currentCompany} = this.props;
    return (
      <React.Fragment>
        <Box mb={3}>
          <Heading.h2>Employee Payment Form</Heading.h2>
          <Text my={3} textAlign={"center"}>
            It allows you to transfer payroll to your employees.
          </Text>
        </Box> 
        <Flex
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          mx={-2}
          mt={4}
          mb={4}
        >
          <EmployeePaymentForm
            width={1}
            info={this.props.info}
            config={this.props.config}
            employee={this.props.selectedEmployee}
            handleSubmit={this.handleSubmit}
            processing={this.state.processing}
            onClickApproveERC20Contract={this.onClickApproveERC20Contract}
            {...this.props}
          />
        </Flex>
      </React.Fragment>
    );
  }
  
  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        <ModalCard closeFunc={this.props.closeModal}>
            <React.Fragment>
              <ModalCard.Body>
                {this.renderContent()}
              </ModalCard.Body>
            </React.Fragment>
        </ModalCard>
        <div>
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
        </div>
      </Modal>
    );
  }
}

export default EmployeePaymentFormModal;
