pragma solidity 0.5.3;

contract IUpgrade {

  /** Events */

  event ContractUpgraded (
      address indexed contractAddress,
      address indexed oldContractAddress,
      address indexed newContractAddress,
      string contractName
  );

  event PendingBalance (
      address indexed contractAddress,
      address indexed oldContractAddress,
      address indexed newContractAddress,
      string contractName,
      uint balance
  );

  /** Functions */

  function upgradeContract(string calldata _name, address _upgradedContractAddress) external returns (bool);
}