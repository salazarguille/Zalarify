pragma solidity 0.5.3;

import "./IsContract.sol";
import "../../interface/IERCProxy.sol";

/**
    @title It delegates a call function to a destination address.
    @dev Borrowed from the Awesome AragonOS project.
 */
contract DelegateProxy is IERCProxy, IsContract {

    uint256 internal constant FWD_GAS_LIMIT = 10000;

   /**
    * @dev Performs a delegatecall and returns whatever the delegatecall returned (entire context execution will return!)
    * @param destination Destination address to perform the delegatecall
    * @param callData Calldata for the delegatecall
    */
    function delegatedFwd(address destination, bytes memory callData) internal {
        require(isContract(destination), "Destination address is not a contract.");
        uint256 fwdGasLimit = FWD_GAS_LIMIT;

        assembly {
            let result := delegatecall(sub(gas, fwdGasLimit), destination, add(callData, 0x20), mload(callData), 0, 0)
            let size := returndatasize
            let ptr := mload(0x40)
            returndatacopy(ptr, 0, size)

            // revert instead of invalid() bc if the underlying call failed with invalid() it already wasted gas.
            // if the call returned error data, forward it
            switch result case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }
}