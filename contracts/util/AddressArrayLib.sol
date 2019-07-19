pragma solidity 0.5.3;

/**
  @notice This library is used to manager array of addresses.
  @author Guillermo Salazar
 */
library AddressArrayLib {

  /**
    @notice It adds an address value to the array.
    @param self current array.
    @param newItem new item to add.
    @return the current array with the new item.
   */
  function add(address[] storage self, address newItem) internal returns (address[] memory) {
    require(newItem != address(0x0), "Invalid address.");
    self.push(newItem);
    return self;
  }

  /**
    @notice It gets an item in a specific index.
    @param self the current array.
    @param index position to get item.
    @return the item in the index.
   */
  function getAt(address[] storage self, uint index) internal view returns (address) {
    if (index >= self.length) return address(0x0);
    return self[index];
  }

  /**
    @notice It removes the value at the given index in an array.
    @param self the current array.
    @param index remove an item in a specific index.
    @return the current array without the item removed.
   */
  function removeAt(address[] storage self, uint index) internal returns (address[] memory) {
    if (index >= self.length) return self;

    address temp = self[self.length - 1];
    self[self.length - 1] = self[index];
    self[index] = temp;

    delete self[self.length - 1];
    self.length--;

    return self;
  }
}
