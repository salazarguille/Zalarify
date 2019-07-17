pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../base/Base.sol";
import "../base/ZalarifyCompany.sol";
import "../interface/IZalarifyCompanyFactory.sol";

contract ZalarifyCompanyFactory is Base, IZalarifyCompanyFactory {

    /** Constants */

    /** Properties */

    /** Events */

    /** Modifiers */

    modifier isZalarify(address anAddress) {
        require(getZalarifyAddress() == anAddress, "Sender is not Zalarify.");
        _;
    }

    /** Constructor */

    constructor(address _storageAddress)
        public Base(_storageAddress) {
    }

    /** Fallback Method */

    /** Functions */

    function createZalarifyCompany(ZalarifyCommon.Company memory _company)
        public 
        isZalarify(msg.sender)
        returns (IZalarifyCompany){
        ZalarifyCompany newCompanyAddress = new ZalarifyCompany(
            _company,
            Base.getStorageAddress()
        );
        return IZalarifyCompany(newCompanyAddress);
    }
}
