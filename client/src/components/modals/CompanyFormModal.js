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
import CompanyForm from "../forms/CompanyForm";

class CompanyFormModal extends React.Component {
  state = {
    processing: false,
  };

  getZalarifyContract = () => {
    const { contracts, web3 } = this.props;
    const currentContractData = contracts.find(contract => contract.name === 'IZalarify');
    const contract = currentContractData.abi;
    const contractAddress = currentContractData.address;
    const instance = new web3.eth.Contract(
        contract.abi,
        contractAddress
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

  invokeContract = (item) => {
    const { web3, info } = this.props;
    const { utils } = web3;
    let result;

    try {
      const zalarify = this.getZalarifyContract();
      this.setProcessing();
      //createCompany(bytes32 _id, bytes32 _name, bytes32 _website, bytes32 _description) external returns (address companyAddress);
      result = zalarify.methods.createCompany(
        utils.fromAscii(item.name).padEnd(66, '0'), // Id
        utils.fromAscii(item.name).padEnd(66, '0'),
        utils.fromAscii(item.website).padEnd(66, '0'),
        utils.fromAscii(item.description).padEnd(66, '0')
      ).send({from: info.selectedAddress});
    } catch (error) {
      this.toast(<div>
        {`Message: ${error.message}`}
      </div>, true);
    }
    return result;
  }

  handleSubmit = async (item) => {
    const { config, companyCreatedCallback } = this.props;

    const result = this.invokeContract(item);
    result.on('transactionHash', (hash) => {
        if(config.network === 'unknown') {
          this.setNotProcessing();
          companyCreatedCallback(item, undefined);
          result.removeAllListeners();
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
            companyCreatedCallback(item, receipt);
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
    return (
      <React.Fragment>
        <Box mb={3}>
          <Heading.h2>Company Form</Heading.h2>
          <Text my={3} textAlign={"center"}>
            It allows you to create a company.
          </Text>
          <Text textAlign="center" fontSize="12px" italic color="#ff0000">
            * Please, verify all the input values. The new company will not able to be modified in this platform version.
          </Text>
        </Box> 
        <Flex
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          mx={-2}
          mt={4}
          mb={4}
        >
          <CompanyForm
            width={1}
            config={this.props.config}
            companies={this.props.companies}
            handleSubmit={this.handleSubmit}
            currentCompany={this.props.currentCompany}
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

export default CompanyFormModal;
