pragma solidity 0.5.3;

import "./Base.sol";
import "../interface/IUpgrade.sol";

/**
    @title This allows to upgrade any smart contract of the platform.
    @author Guillermo Salazar

    @notice It is used in some emergency situation where the platform needs to be fixed.
    @dev It must be executed by an owner.
 */
contract Upgrade is Base, IUpgrade {

    /** Constants */
    string constant internal CONTRACT_ADDRESS = "contract.address";

    /** Events */

    /** Constructor */

    /**
        @notice It creates a new Upgrade instance associated to an Eternal Storage implementation.
        @param _storageAddress the Eternal Storage implementation.
        @dev The Eternal Storage implementation must implement the IStorage interface.
     */
    constructor(address _storageAddress) Base(_storageAddress) public {}

    /** Functions */

    /**
        @notice It upgrades a smart contract of the platform associated to a contract name.
        @dev It must be executed by an owner platform only.
        @param _name smart contract name to be upgraded.
        @param _upgradedContractAddress the new smart contract address.
        @return true if the contract is updated. Otherwise it returns false.
     */
    function upgradeContract(string calldata _name, address _upgradedContractAddress)
    external
    onlySuperUser
    returns (bool){
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
        return true;
    }
}