pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../../base/ZalarifyCompany.sol";
import "../../util/ZalarifyCommon.sol";

contract ZalarifyCompanyMock is ZalarifyCompany {

    /** Events */

    /** Modifiers */

    /** Constructor */

    constructor(ZalarifyCommon.Company memory _company, address _storageAddress)
        public ZalarifyCompany(_company, _storageAddress) {}

    /** Functions */

    function _isCompanyOwner(address anAddress)
        public 
        view
        isCompanyOwner(anAddress)
        returns (bool){
        return true;
    }

    function _isEmployee(address anAddress)
        public
        view
        isEmployee(anAddress)
        returns (bool){
        return true;
    }

    function _isNotEmployee(address anAddress)
        public
        view
        isNotEmployee(anAddress)
        returns (bool){
        return true;
    }
}