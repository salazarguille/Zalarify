pragma solidity 0.5.3;

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