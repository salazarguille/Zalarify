pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../util/ZalarifyCommon.sol";
import "./IZalarifyCompany.sol";

contract IZalarifyCompanyFactory {

    /** Events */

    /** Functions */

    function createZalarifyCompany(ZalarifyCommon.Company memory company)
    public
    returns (IZalarifyCompany);
}