import { withStyles } from '@material-ui/styles';
import React from "react";
import {
  Heading,
  Text,
  Modal,
  Flex,
  Box,
} from "rimble-ui";
import ModalCard from './ModalCard';

const styles = theme => ({
  labelSuccess: {
    textAlign: 'center',
    color: 'green',
  },
  labelError: {
    textAlign: 'center',
    color: 'red',
  },
  labelWarning: {
    textAlign: 'center',
    color: '#cccc0f',
  },
});

class MessageModal extends React.Component {
  state = { };

  renderContent = () => {
    const { description, classes, messageStyle = 'success' } = this.props;
    
    const titleStyle = messageStyle === 'success' ? classes.labelSuccess : ( messageStyle === 'warn' ? classes.labelWarning : classes.labelError);
    const title = messageStyle === 'success' ? 'Success' : ( messageStyle === 'warn' ? 'Warning' : 'Error');
    
    return (
      <React.Fragment>
        <Box mb={3}>
          <Heading.h2 className={titleStyle}>{title}</Heading.h2>
          <Text my={3} textAlign={"center"}>
            {description}
          </Text>
        </Box> 
        <Flex
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          mx={-2}
          mt={4}
          mb={4}
        >
          {this.props.children}
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
      </Modal>
    );
  }
}

export default withStyles(styles)(MessageModal);