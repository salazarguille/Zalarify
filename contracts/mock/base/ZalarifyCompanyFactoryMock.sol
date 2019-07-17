pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../../base/ZalarifyCompanyFactory.sol";

contract ZalarifyCompanyFactoryMock is ZalarifyCompanyFactory {

    /** Events */

    /** Modifiers */

    /** Constructor */

    constructor(address _storageAddress)
        public ZalarifyCompanyFactory(_storageAddress) {}

    /** Functions */

    function _isZalarify(address anAddress)
        public
        view
        isZalarify(anAddress)
        returns (bool){
        return true;
    }
}