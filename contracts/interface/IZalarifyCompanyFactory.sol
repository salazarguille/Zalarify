pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../util/ZalarifyCommon.sol";
import "./IZalarifyCompany.sol";

/**
    @title This is used to create a ZalarifyCompany instance.
    @notice It creates ZalarifyComapny instances.
    @author Guillermo Salazar
 */
contract IZalarifyCompanyFactory {

    /** Events */

    /** Functions */

    /**
        @notice It creates a new ZalarifyCompany instance associated to a company struct information.
        @param company struct with the company informationl
        @return the new ZalarifyCompany address.
     */
    function createZalarifyCompany(ZalarifyCommon.Company memory company)
    public
    returns (IZalarifyCompany);
}