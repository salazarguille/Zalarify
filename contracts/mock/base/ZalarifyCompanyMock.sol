pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../../base/ZalarifyCompany.sol";
import "../../util/ZalarifyCommon.sol";

/**
    @title Mock contract to test ZalarifyCompany functions and modifiers.
    @author Guillermo Salazar
 */
contract ZalarifyCompanyMock is ZalarifyCompany {

    /** Events */

    /** Modifiers */

    /** Constructor */

    /**
        @notice It creates a new ZalarifyCompanyFactoryMock instance associated to an Eternal Storage implementation.
        @param _company company information.
        @param _storageAddress the Eternal Storage implementation.
        @dev The Eternal Storage implementation must implement the IStorage interface.
     */
    constructor(ZalarifyCommon.Company memory _company, address _storageAddress)
        public ZalarifyCompany(_company, _storageAddress) {}

    /** Functions */

    /**
        @notice Mock function to test the modifier isCompanyOwner.
        @param anAddress the address to test.
        @return true if it was ok. Otherwise it returns false.
     */
    function _isCompanyOwner(address anAddress)
        public 
        view
        isCompanyOwner(anAddress)
        returns (bool){
        return true;
    }

    /**
        @notice Mock function to test the modifier onlyOwner.
        @param anAddress the address to test.
        @return true if it was ok. Otherwise it returns false.
     */
    function _isEmployee(address anAddress)
        public
        view
        isEmployee(anAddress)
        returns (bool){
        return true;
    }

    /**
        @notice Mock function to test the modifier onlyOwner.
        @param anAddress the address to test.
        @return true if it was ok. Otherwise it returns false.
     */
    function _isNotEmployee(address anAddress)
        public
        view
        isNotEmployee(anAddress)
        returns (bool){
        return true;
    }
}