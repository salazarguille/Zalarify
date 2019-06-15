pragma solidity 0.5.9;
pragma experimental ABIEncoderV2;

import "../base/Base.sol";
import "../base/ZalarifyCompany.sol";
import "../interface/IZalarify.sol";
import "../util/SafeMath.sol";
import "../util/ZalarifyCommon.sol";

contract ZalarifyBase is Base, IZalarify {
    using SafeMath for uint256;

    /** Constants */

    /** Properties */

    mapping (bytes32 => ZalarifyCommon.CompanyDefinition) public companies;

    /** Events */

    /** Modifiers */

    modifier isSender(address _sender, address _to) {
        require(_sender == _to, "Sender is not equals to 'to' address.");
        _;
    }

    modifier existCompanyDefinition(bytes32 _id) {
        require(companies[_id].exist == true, "Company definition doesn't exist.");
        _;
    }

    modifier notExistCompanyDefinition(bytes32 _id) {
        require(companies[_id].exist == false, "Company definition already exists.");
        _;
    }

    modifier isValidBytes32(bytes32 _id) {
        require(_id != bytes32(0x0), "Id must not be 0x0.");
        _;
    }

    /** Constructor */

    constructor(address _storageAddress)
        public Base(_storageAddress) {
    }

    /** Fallback Method */

    /** Functions */

    function createCompany(bytes32 _id, bytes32 _name, bool _enabled)
        public
        isValidBytes32(_id)
        isValidBytes32(_name)
        notExistCompanyDefinition(_id)
        returns (address zalarifyCompanyAddress) {

        ZalarifyCompany zalarifyCompany = new ZalarifyCompany(address(this), Base.getStorageAddress());
        companies[_id] = ZalarifyCommon.CompanyDefinition({
            name: _name,
            zalarifyCompanyAddress: address(zalarifyCompany),
            enabled: _enabled,
            exist: true
        });
        companies[_id].owners[msg.sender] = true;
        emit CompanyDefinitionCreated(
            address(this),
            companies[_id].zalarifyCompanyAddress,
            now,
            msg.sender
        );
        return companies[_id].zalarifyCompanyAddress;
    }

    function payEmployees(ZalarifyCommon.CompanyPayment memory _payment)
    public
    returns (bool){
        _payment;
        return false;
    }
}
