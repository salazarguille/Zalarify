pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../base/Base.sol";
import "../interface/IReceiptRegistry.sol";
import "../interface/IZalarifyCompany.sol";

contract ReceiptRegistry is Base, IReceiptRegistry {

    /** Constants */
    string constant internal EMPTY_STRING = "";

    /** Properties */

    mapping (address => mapping (address => ZalarifyCommon.Receipt[])) public receipts;

    /** Events */

    /** Modifiers */

    modifier isAddressNotEmpty(address _address) {
        require(_address != address(0x0), "Address must not be 0x0.");
        _;
    }

    modifier isCompanyOwner(address _company, address _sender) {
        ZalarifyCommon.Company memory companyInfo = IZalarifyCompany(_company).getInfo();
        require(companyInfo.creator == _sender, "Sender is not company owner.");
        _;
    }

    modifier isStringNotEmpty(string memory _value) {
        require(keccak256(abi.encodePacked(_value)) != keccak256(abi.encodePacked(EMPTY_STRING)), "String must not be empty.");
        _;
    }

    modifier isBytes32NotEmpty(bytes32 _value) {
        require(_value != bytes32(0x0), "Bytes32 must not be 0x0.");
        _;
    }

    /** Constructor */

    constructor(address _storageAddress) Base(_storageAddress) public {}

    /** Functions */

    function createReceipt(address _company, address _employee, string memory _path, string memory _receiptHash) 
        public
        isCompanyOwner(_company, msg.sender)
        isAddressNotEmpty(_company)
        isAddressNotEmpty(_employee)
        isStringNotEmpty(_receiptHash)
        isStringNotEmpty(_path)
        returns (bool) {

        receipts[_company][_employee].push(ZalarifyCommon.Receipt({
            createdAt: now,
            path: _path,
            ipfsHash: _receiptHash
        }));
        emit NewReceiptCreated(
            address(this),
            _company,
            _employee,
            _receiptHash,
            _path
        );
        return true;
    }

    function getReceipts(address _company, address _employee)
        public
        view
        returns (ZalarifyCommon.Receipt[] memory) {
        return receipts[_company][_employee];            
    }

    function hasReceipts(address _company, address _employee)
        public
        view
        returns (bool) {
            return receipts[_company][_employee].length > 0;
    }

}
