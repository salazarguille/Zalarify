pragma solidity 0.5.3;

import "./Base.sol";

contract Upgrade is Base {

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

    /** Constructor */

    constructor(address _storageAddress) Base(_storageAddress) public {
        version = 1;
    }

    /** Functions */

    function upgradeContract(string calldata _name, address _upgradedContractAddress)  external onlySuperUser {
        address oldContractAddress = _storage.getAddress(keccak256(abi.encodePacked(CONTRACT_NAME, _name)));
        
        require(oldContractAddress != address(0x0), "Old contract address must not be 0x0.");
        require(oldContractAddress != _upgradedContractAddress, "Old and new contract addresses must not be equals.");
        uint oldContractBalance = oldContractAddress.balance;

        if( oldContractBalance > 0 ) {
            emit PendingBalance (
                address(this),
                oldContractAddress,
                _upgradedContractAddress,
                _name,
                oldContractBalance
            );
        }
        
        _storage.setAddress(keccak256(abi.encodePacked(CONTRACT_NAME, _name)), _upgradedContractAddress);
        _storage.setAddress(keccak256(abi.encodePacked(CONTRACT_ADDRESS, _upgradedContractAddress)), _upgradedContractAddress);
        _storage.deleteAddress(keccak256(abi.encodePacked(CONTRACT_ADDRESS, oldContractAddress)));

        emit ContractUpgraded(address(this), oldContractAddress, _upgradedContractAddress, _name);
    }
}