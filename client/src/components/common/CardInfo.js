import React from "react";
import { Tooltip, Text, Box, Heading, Card, Button } from "rimble-ui";

class CardInfo extends React.Component {

  render() {
    const {
      title,
      width = 1 / 3,
      borderRadius = 10,
      primaryTooltip = 'Accept action',
      primaryText = 'Accept',
      onPrimaryClick = e => console.log(e),
      onPrimaryLink = undefined,

      secondaryTooltip = undefined,
      secondaryText = undefined,
      onSecondaryClick = e => console.log(e),

      viewButtons = true,
    } = this.props;

    let primaryButtonRender = '';
    if(viewButtons) {
      primaryButtonRender = onPrimaryLink === undefined ? <Button mr={3} onClick={onPrimaryClick}>
                                                                {primaryText}
                                                              </Button>:
                                                              <Button mr={3} as="a" href={onPrimaryLink}>
                                                                {primaryText}
                                                              </Button>
                                                              ;
    }

    const secondaryActionRender = secondaryText === undefined ? '' : (
        <Tooltip message={secondaryTooltip} placement="top">
          <Button.Outline onClick={onSecondaryClick}>
            {secondaryText}
          </Button.Outline>
        </Tooltip>
    );
    return (
      <Card width={width} m={2} px={4} borderRadius={borderRadius}>
        <Heading width={1} textAlign="center">{title}</Heading>
        <Box width={1}>
          <hr></hr>
          <Text mb={4}>
            {this.props.children}
          </Text>
        </Box>
        <Tooltip message={primaryTooltip} placement="top">
          {primaryButtonRender}
        </Tooltip>
        {secondaryActionRender}
      </Card>
    );
  }
}

export default CardInfo;
