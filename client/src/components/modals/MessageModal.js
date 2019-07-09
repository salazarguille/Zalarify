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
    color: 'green'
  },
  labelError: {
    textAlign: 'center',
    color: 'red'
  },
});

class MessageModal extends React.Component {
  state = { };

  renderContent = () => {
    const { message, isSuccess, classes } = this.props;
    let title = isSuccess ? 'Success' : 'Error';
    const titleStyle = isSuccess ? classes.labelSuccess : classes.labelError;
    let description = isSuccess ? 'Your action was done successfully.' : 'Your action was not done successfully. Please try it again in a few minutes.';
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
          {message}
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