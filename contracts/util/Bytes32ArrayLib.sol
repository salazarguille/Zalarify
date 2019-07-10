pragma solidity 0.5.3;

library Bytes32ArrayLib {

  function add(bytes32[] storage self, bytes32 newItem) internal returns (bytes32[] memory) {
    require(newItem != 0x0, "Invalid value.");
    self.push(newItem);
    return self;
  }

  function removeAt(bytes32[] storage self, uint index) internal returns (bytes32[] memory) {
    if (index >= self.length) return self;

    bytes32 temp = self[self.length - 1];
    self[self.length - 1] = self[index];
    self[index] = temp;

    delete self[self.length - 1];
    self.length--;

    return self;
  }
}
