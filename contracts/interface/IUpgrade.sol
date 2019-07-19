pragma solidity 0.5.3;

/**
    @title This allows to upgrade any smart contract of the platform.
    @author Guillermo Salazar

    @notice It is used in some emergency situation where the platform needs to be fixed.
    @dev It must be executed by an owner.
 */
contract IUpgrade {

  /** Events */

  /**
    @notice This event is emitted when a contract is upgraded.
    @param contractAddress this smart contract address.
    @param oldContractAddress old smart contract address.
    @param newContractAddress new smart contract address.
    @param contractName contract name updated.
   */
  event ContractUpgraded (
      address indexed contractAddress,
      address indexed oldContractAddress,
      address indexed newContractAddress,
      string contractName
  );

  /**
    @notice This event is emitted when an upgraded smart contract still has Ether balance.
    @param contractAddress this smart contract address.
    @param oldContractAddress old smart contract address.
    @param newContractAddress new smart contract address.
    @param contractName contract name updated.
    @param balance current Ether balance.
   */
  event PendingBalance (
      address indexed contractAddress,
      address indexed oldContractAddress,
      address indexed newContractAddress,
      string contractName,
      uint balance
  );

  /** Functions */

  /**
    @notice It upgrades a smart contract of the platform associated to a contract name.
    @dev It must be executed by an owner platform only.
    @param _name smart contract name to be upgraded.
    @param _upgradedContractAddress the new smart contract address.
    @return true if the contract is updated. Otherwise it returns false.
  */
  function upgradeContract(string calldata _name, address _upgradedContractAddress) external returns (bool);
}