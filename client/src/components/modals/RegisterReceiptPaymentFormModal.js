import React from "react";
import axios from "axios";
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
import RegisterReceiptPaymentForm from "../forms/RegisterReceiptPaymentForm";
import { listenOn } from "../utils/txs";

class RegisterReceiptPaymentFormModal extends React.Component {
  state = {
    processing: false,
  };

  getReceiptRegistryContract = () => {
    const { contracts, web3 } = this.props;
    const receiptRegistryData = contracts.find(contract => contract.name === 'IReceiptRegistry');
    const contract = receiptRegistryData.abi;
    const instance = new web3.eth.Contract(
      contract.abi,
      receiptRegistryData.address
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
    if( nextProps.paymentData) {
        return {
          paymentData: nextProps.paymentData,
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

  handleSubmit = async () => {
    try {
      this.setProcessing();
      
      const { config, companyAddress, info, registerReceiptPaymentCallback } = this.props;
      const { paymentData } = this.state;
      const { employee } = paymentData;
      const receiptData = {
        employee,
        tokenRate: paymentData.tokenRate,
        sourceToken: paymentData.sourceToken,
        companyAddress,
      };
      const response = await axios.post(`${config.urls.backend}/receipts`, receiptData);
      const data = response.data;
  
      const receiptRegistryContract = this.getReceiptRegistryContract();
  
      const createReceiptResult = receiptRegistryContract
        .methods
        .createReceipt(
          companyAddress,
          employee.wallet,
          data.path,
          data.hash
        )
        .send({from: info.selectedAddress});
      listenOn(createReceiptResult, this, config, () => {
        registerReceiptPaymentCallback(data);
      });
    } catch (error) {
      this.toast(<div>
        {`Message: ${error.message}`}
      </div>, true);
    }
  };

  renderContent = () => {
    return (
      <React.Fragment>
        <Box mb={3}>
          <Heading.h2>Register Receipt Payment</Heading.h2>
          <Text my={3} textAlign={"center"}>
            It allows you to register receipt payment for your employees after transferring their payrolls.
          </Text>
        </Box> 
        <Flex
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          mx={-2}
          mt={4}
          mb={4}
        >
          <RegisterReceiptPaymentForm
            width={1}
            info={this.props.info}
            config={this.props.config}
            paymentData={this.state.paymentData}
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

export default RegisterReceiptPaymentFormModal;
