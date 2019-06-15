pragma solidity 0.5.9;

library Bytes32ArrayLib {

  function add(bytes32[] storage self, bytes32 newItem) internal returns (bytes32[] memory) {
    require(newItem != 0x0, "invalid address_");
    self.push(newItem);
    return self;
  }
}
