pragma solidity 0.5.9;

import "../../base/proxy/IsContract.sol";

contract IsContractMock is IsContract {

    /** Functions */

    function _isContract(address _target)
        public
        view
        returns (bool) {
        return super.isContract(_target);
    }
}