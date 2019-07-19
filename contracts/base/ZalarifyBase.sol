pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../base/Base.sol";
import "../interface/IZalarifyCompany.sol";
import "../interface/IZalarify.sol";

/**
    @title This is one of the main smart contract for the platform. This is the entry point to create companies.
    @notice It creates companies using a factory instance called IZalarifyCompanyFactory.
    @author Guillermo Salazar
 */
contract ZalarifyBase is Base, IZalarify {

    /** Constants */

    /** Properties */

    mapping (bytes32 => address) public companies;

    bytes32[] public companiesList;

    /** Events */

    /** Modifiers */

    /**
        @notice It checks whether a company id exists or not.
        @dev It throws a require error, if the company doesn't exist.
     */
    modifier existCompany(bytes32 _id) {
        require(companies[_id] != address(0x0), "Company definition doesn't exist.");
        _;
    }

    /**
        @notice It checks whether a company id exists or not.
        @dev It throws a require error, if the company does exist.
     */
    modifier notExistCompany(bytes32 _id) {
        require(companies[_id] == address(0x0), "Company definition already exists.");
        _;
    }

    /**
        @notice It checks whether a bytes32 value is equal to 0x0.
        @dev It throws a require error, if the value is equal to 0x0.
     */
    modifier isValidBytes32(bytes32 _id) {
        require(_id != bytes32(0x0), "Bytes must not be empty.");
        _;
    }

    /** Constructor */

    /**
        @notice It creates a new ZalarifyBase instance associated to an Eternal Storage implementation.
        @param _storageAddress the Eternal Storage implementation.
        @dev The Eternal Storage implementation must implement the IStorage interface.
     */
    constructor(address _storageAddress)
        public Base(_storageAddress) {
    }

    /** Fallback Method */

    /** Functions */

    /**
        @notice It creates a Company struct associated to company field values.
        @return a Company struct with all values populated.
     */
    function createCompanyStruct(bytes32 _id, bytes32 _name, bytes32 _website, bytes32 _description, address _creator)
        internal
        view
        returns (ZalarifyCommon.Company memory company){
            company = ZalarifyCommon.Company({
                id: _id,
                name: _name,
                description: _description,
                website: _website,
                creator: _creator,
                createdAt: now,
                paused: false
            });
    }

    /**
        @notice It registers a company in this smart contract.
        @dev It stores the company address and id in this contract.
        @return true if it stores the company. Otherwise it returns false.
     */
    function registerCompany(bytes32 _id, IZalarifyCompany _zalarifyCompany)
        internal 
        returns (bool){
        address zalarifyCompanyAddress = address(_zalarifyCompany);
        companies[_id] = zalarifyCompanyAddress;
        companiesList.add(_id);
        return true;
    }

    /**
        @notice It gets the company address associated to a specific id.
        @return the company address for a specific id.
     */
    function getCompany(bytes32 _id)
        public
        view
        returns (address) {
        return companies[_id];
    }

    /**
        @notice It creates a compamy in the platform.
        @dev It is created using a company factory.
        @param _id id associated to the company.
        @param _name name associated to the company.
        @param _website website URL associated to the company.
        @param _description description associated to the company.
        @return the new company address created.
     */
    function createCompany(bytes32 _id, bytes32 _name, bytes32 _website, bytes32 _description)
        public
        isValidBytes32(_id)
        isValidBytes32(_name)
        isValidBytes32(_website)
        notExistCompany(_id)
        returns (address companyAddress) {

        // Create company struct instance.
        ZalarifyCommon.Company memory company = createCompanyStruct(_id, _name, _website, _description, msg.sender);

        // Create company contract instance using the company stuct instance.
        IZalarifyCompany zalarifyCompany = getZalarifyCompanyFactory().createZalarifyCompany(company);

        // Register the new company.
        registerCompany(_id, zalarifyCompany);

        // Emit the event.
        emit NewCompanyCreated(
            address(this),
            companies[_id],
            company.createdAt,
            company.creator
        );
        return address(zalarifyCompany);
    }

    /**
        @notice Get all the companies registered in the platform.
        @return a list of companies.
     */
    function getCompanies()
        public
        view
        returns (ZalarifyCommon.Company[] memory) {
        ZalarifyCommon.Company[] memory result = new ZalarifyCommon.Company[](companiesList.length);
        for (uint256 index = 0; index < companiesList.length; index = index.add(1)) {
            bytes32 companyId = companiesList[index];
            result[index] = IZalarifyCompany(companies[companyId]).getInfo();
        }
        return result;
    }
}
