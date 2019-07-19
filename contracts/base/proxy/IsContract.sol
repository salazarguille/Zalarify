pragma solidity 0.5.3;

import "../Base.sol";
import "./DelegateProxy.sol";
import "../../interface/IStorage.sol";

/**
    @title It validates whether an address is a contract or an user address.
    @author Guillermo Salazar
    @dev It is used by the delegate proxy contract before delegating a function call.
    @notice It may be implemented using a library.
 */
contract IsContract {

    /**
        @notice It verifies whether an address is a contract or an user address.
        @dev NOTE: this should NEVER be used for authentication (see pitfalls: https://github.com/fergarrui/ethereum-security/tree/master/contracts/extcodesize).
        @dev This is only intended to be used as a sanity check that an address is actually a contract, RATHER THAN an address not being a contract.

        @param targetAddress to validate whether it is a contract or user address.
        @return true if is a contract address. Otherwise it returns false.
    */
    function isContract(address targetAddress) internal view returns (bool) {
        if (targetAddress == address(0)) {
            return false;
        }

        uint256 size;
        assembly { size := extcodesize(targetAddress) }
        return size > 0;
    }
}