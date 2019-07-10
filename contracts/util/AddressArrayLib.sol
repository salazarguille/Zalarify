pragma solidity 0.5.3;

library AddressArrayLib {

  function add(address[] storage self, address newItem) internal returns (address[] memory) {
    require(newItem != address(0x0), "Invalid address.");
    self.push(newItem);
    return self;
  }

  function getAt(address[] storage self, uint index) internal view returns (address) {
    if (index >= self.length) return address(0x0);
    return self[index];
  }

  /** Removes the value at the given index in an array. */
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
