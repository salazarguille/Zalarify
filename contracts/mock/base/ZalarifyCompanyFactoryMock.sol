pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../../base/ZalarifyCompanyFactory.sol";

/**
    @title Mock contract to test ZalarifyCompanyFactory functions and modifiers.
    @author Guillermo Salazar
 */
contract ZalarifyCompanyFactoryMock is ZalarifyCompanyFactory {

    /** Events */

    /** Modifiers */

    /** Constructor */

    /**
        @notice It creates a new ZalarifyCompanyFactoryMock instance associated to an Eternal Storage implementation.
        @param _storageAddress the Eternal Storage implementation.
        @dev The Eternal Storage implementation must implement the IStorage interface.
     */
    constructor(address _storageAddress)
        public ZalarifyCompanyFactory(_storageAddress) {}

    /** Functions */

    /**
        @notice Mock function to test the modifier isZalarify.
        @param anAddress address to test.
     */
    function _isZalarify(address anAddress)
        public
        view
        isZalarify(anAddress)
        returns (bool){
        return true;
    }
}