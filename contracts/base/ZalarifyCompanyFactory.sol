pragma solidity 0.5.9;
pragma experimental ABIEncoderV2;

import "../base/Base.sol";
import "../base/ZalarifyCompany.sol";
import "../interface/IZalarifyCompanyFactory.sol";

contract ZalarifyCompanyFactory is Base, IZalarifyCompanyFactory {

    /** Constants */

    /** Properties */

    /** Events */

    /** Modifiers */

    /** Constructor */

    constructor(address _storageAddress)
        public Base(_storageAddress) {
    }

    /** Fallback Method */

    /** Functions */

    function createZalarifyCompany(address _creator, ZalarifyCommon.Company memory _company)
        public 
        returns (IZalarifyCompany){
        ZalarifyCompany newCompanyAddress = new ZalarifyCompany(
            _creator,
            _company,
            Base.getStorageAddress()
        );
        return IZalarifyCompany(newCompanyAddress);
    }
}
