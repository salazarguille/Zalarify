pragma solidity 0.5.3;

import "./Base.sol";
import "../interface/IUpgrade.sol";

contract Upgrade is Base, IUpgrade {

    /** Constants */
    string constant internal CONTRACT_ADDRESS = "contract.address";

    /** Events */

    /** Constructor */

    constructor(address _storageAddress) Base(_storageAddress) public {}

    /** Functions */

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