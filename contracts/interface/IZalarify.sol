pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../util/SafeMath.sol";
import "../util/ZalarifyCommon.sol";
import "../util/Bytes32ArrayLib.sol";

/**
    @title This is one of the main smart contract for the platform. This is the entry point to create companies.
    @notice It creates companies using a factory instance called IZalarifyCompanyFactory.
    @author Guillermo Salazar
 */
contract IZalarify {
    using SafeMath for uint256;
    using Bytes32ArrayLib for bytes32[];

    /** Events */

    /**
        @notice This event is emitted when a new company is created.
        @param thisContract this smart contract address.
        @param companyAddress the new company address created.
        @param createdAt the timestamp when company was created.
        @param creator who created the company.
     */
    event NewCompanyCreated(
        address indexed thisContract,
        address companyAddress,
        uint createdAt,
        address creator
    );

    /** Functions */

    /**
        @notice It creates a compamy in the platform.
        @dev It is created using a company factory.
        @param _id id associated to the company.
        @param _name name associated to the company.
        @param _website website URL associated to the company.
        @param _description description associated to the company.
        @return the new company address created.
     */
    function createCompany(bytes32 _id, bytes32 _name, bytes32 _website, bytes32 _description) external returns (address companyAddress);

    /**
        @notice Get all the companies registered in the platform.
        @return a list of companies.
     */
    function getCompanies() public view returns (ZalarifyCommon.Company[] memory);

    /**
        @notice It gets the company address associated to a specific id.
        @return the company address for a specific id.
     */
    function getCompany(bytes32 _id) public view returns (address);
}