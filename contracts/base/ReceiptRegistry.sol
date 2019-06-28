pragma solidity 0.5.9;
pragma experimental ABIEncoderV2;

import "../base/Base.sol";
import "../interface/IReceiptRegistry.sol";

contract ReceiptRegistry is Base, IReceiptRegistry {

    /** Constants */

    /** Properties */

    mapping (address => mapping (address => ZalarifyCommon.Receipt[])) public receipts;

    /** Events */

    /** Modifiers */

    modifier isAddressNotEmpty(address _address) {
        require(_address != address(0x0), "Address must not be 0x0.");
        _;
    }

    modifier isBytes32NotEmpty(bytes32 _value) {
        require(_value != bytes32(0x0), "Bytes32 must not be 0x0.");
        _;
    }

    /** Constructor */

    constructor(address _storageAddress) Base(_storageAddress) public {
        version = 1;
    }

    /** Functions */

    function createReceipt(address _company, address _employee, bytes32 _receiptHash) 
        public
        isAddressNotEmpty(_company)
        isAddressNotEmpty(_employee)
        isBytes32NotEmpty(_receiptHash)
        returns (bool) {

        //ZalarifyCommon.Receipt[] memory theReceipts = receipts[_company][_employee];
        //theReceipts[theReceipts.length] = ZalarifyCommon.Receipt({ 
        receipts[_company][_employee].push(ZalarifyCommon.Receipt({
            createdAt: now,
            hash: _receiptHash
        }));
        emit NewReceiptCreated(
            address(this),
            _company,
            _employee,
            _receiptHash
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
