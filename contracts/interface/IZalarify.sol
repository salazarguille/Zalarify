pragma solidity 0.5.9;
pragma experimental ABIEncoderV2;

import "../util/ZalarifyCommon.sol";

contract IZalarify {

    /** Events */

    event CompanyDefinitionCreated(
        address indexed thisContract,
        address zalarifyCompanyAddress,
        uint createdAt,
        address owner
    );

    /** Functions */

    function payEmployees(ZalarifyCommon.CompanyPayment memory _payment)
    public
    returns (bool);
    
}