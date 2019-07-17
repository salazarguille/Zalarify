pragma solidity 0.5.3;

import "../Base.sol";
import "./DelegateProxy.sol";
import "../../interface/IStorage.sol";

contract IsContract {

    /*
    * NOTE: this should NEVER be used for authentication
    * (see pitfalls: https://github.com/fergarrui/ethereum-security/tree/master/contracts/extcodesize).
    *
    * This is only intended to be used as a sanity check that an address is actually a contract,
    * RATHER THAN an address not being a contract.
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