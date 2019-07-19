pragma solidity 0.5.3;

/**
  @notice This library is used to manager array of bytes32.
  @author Guillermo Salazar
 */
library Bytes32ArrayLib {

  /**
    @notice It adds an bytes32 value to the array.
    @param self current array.
    @param newItem new item to add.
    @return the current array with the new item.
   */
  function add(bytes32[] storage self, bytes32 newItem) internal returns (bytes32[] memory) {
    require(newItem != 0x0, "Invalid value.");
    self.push(newItem);
    return self;
  }

  /**
    @notice It removes the value at the given index in an array.
    @param self the current array.
    @param index remove an item in a specific index.
    @return the current array without the item removed.
   */
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
