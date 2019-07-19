pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../base/Base.sol";
import "../base/ZalarifyCompany.sol";
import "../interface/IZalarifyCompanyFactory.sol";

/**
    @title This is used to create a ZalarifyCompany instance.
    @notice It creates ZalarifyComapny instances.
    @author Guillermo Salazar
 */
contract ZalarifyCompanyFactory is Base, IZalarifyCompanyFactory {

    /** Constants */

    /** Properties */

    /** Events */

    /** Modifiers */

    /**
        @notice It checks whether an address is Zalarify instance or not.
        @dev It throws a require error, if the address is not Zalarify.
     */
    modifier isZalarify(address anAddress) {
        require(getZalarifyAddress() == anAddress, "Sender is not Zalarify.");
        _;
    }

    /** Constructor */

    /**
        @notice It creates a new ZalarifyCompanyFactory instance associated to an Eternal Storage implementation.
        @param _storageAddress the Eternal Storage implementation.
        @dev The Eternal Storage implementation must implement the IStorage interface.
     */
    constructor(address _storageAddress)
        public Base(_storageAddress) {
    }

    /** Fallback Method */

    /** Functions */

    /**
        @notice It creates a new ZalarifyCompany instance associated to a company struct information.
        @param _company struct with the company informationl
        @return the new ZalarifyCompany address.
     */
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
