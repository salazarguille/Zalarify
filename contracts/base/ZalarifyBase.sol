pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../base/Base.sol";
import "../interface/IZalarifyCompany.sol";
import "../interface/IZalarify.sol";

contract ZalarifyBase is Base, IZalarify {

    /** Constants */

    /** Properties */

    mapping (bytes32 => address) public companies;

    bytes32[] public companiesList;

    /** Events */

    /** Modifiers */

    modifier existCompany(bytes32 _id) {
        require(companies[_id] != address(0x0), "Company definition doesn't exist.");
        _;
    }

    modifier notExistCompany(bytes32 _id) {
        require(companies[_id] == address(0x0), "Company definition already exists.");
        _;
    }

    modifier isValidBytes32(bytes32 _id) {
        require(_id != bytes32(0x0), "Bytes must not be empty.");
        _;
    }

    /** Constructor */

    constructor(address _storageAddress)
        public Base(_storageAddress) {
    }

    /** Fallback Method */

    /** Functions */

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

    function registerCompany(bytes32 _id, IZalarifyCompany _zalarifyCompany)
        internal 
        returns (bool){
        address zalarifyCompanyAddress = address(_zalarifyCompany);
        companies[_id] = zalarifyCompanyAddress;
        companiesList.add(_id);
        return true;
    }

    function getCompany(bytes32 _id)
        public
        view
        returns (address) {
        return companies[_id];
    }

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
