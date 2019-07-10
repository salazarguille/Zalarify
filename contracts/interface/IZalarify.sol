pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../util/SafeMath.sol";
import "../util/ZalarifyCommon.sol";
import "../util/Bytes32ArrayLib.sol";

contract IZalarify {
    using SafeMath for uint256;
    using Bytes32ArrayLib for bytes32[];

    /** Events */

    event NewCompanyCreated(
        address indexed thisContract,
        address companyAddress,
        uint createdAt,
        address creator
    );

    /** Functions */

    function createCompany(bytes32 _id, bytes32 _name, bytes32 _website, bytes32 _description) external returns (address companyAddress);

    function getCompanies() public view returns (ZalarifyCommon.Company[] memory);

    function getCompany(bytes32 _id) public view returns (address);
}