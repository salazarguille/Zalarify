pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../../base/ZalarifyBase.sol";

/**
    @title Mock contract to test ZalarifyBase functions and modifiers.
    @author Guillermo Salazar
 */
contract ZalarifyBaseMock is ZalarifyBase {

    /** Events */

    /** Modifiers */

    /** Constructor */

    /**
        @notice It creates a new ZalarifyBaseMock instance associated to an Eternal Storage implementation.
        @param _storageAddress the Eternal Storage implementation.
        @dev The Eternal Storage implementation must implement the IStorage interface.
     */
    constructor(address _storageAddress)
        public ZalarifyBase(_storageAddress) {}

    /** Functions */

    /**
        @notice It is a mock function to test the createCompanyStruct function in ZalarifyBase smart contract.
        @param _id id associated to the company.
        @param _name name associated to the company.
        @param _website website URL associated to the company.
        @param _description description associated to the company.
        @param _creator who created the company.
        @return the new struct instance.
     */
    function _createCompanyStruct(bytes32 _id, bytes32 _name, bytes32 _website, bytes32 _description, address _creator)
        public
        view
        returns (ZalarifyCommon.Company memory company){
            return createCompanyStruct(
                _id,
                _name,
                _website,
                _description,
                _creator
            );
    }

    /**
        @notice It is a mock function to test the registerCompany function.
        @param _id id associated to the company.
        @param _zalarifyCompany the zalarify contract address.
     */
    function _registerCompany(bytes32 _id, IZalarifyCompany _zalarifyCompany)
        public 
        returns (bool){
        return registerCompany(
            _id,
            _zalarifyCompany
        );
    }
}