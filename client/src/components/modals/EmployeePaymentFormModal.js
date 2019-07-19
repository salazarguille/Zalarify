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
import { listenOn } from "../utils/txs";

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
    if( nextProps.processing && nextProps.employee && nextProps.company) {
        return {
          processing: nextProps.processing,
          employee: nextProps.employee,
          company: nextProps.company,
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

  invokeZalarifyContractPayWithTokens = (data) => {
    const { payment } = data;
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

  handleSubmit = async (data) => {
    const { config, paymentSentCallback } = this.props;

    const result = this.invokeZalarifyContractPayWithTokens(data);

    listenOn(result, this, config, () => {
      paymentSentCallback(data);
    });
  };

  renderContent = () => {
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
            company={this.props.company}
            handleSubmit={this.handleSubmit}
            processing={this.state.processing}
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
