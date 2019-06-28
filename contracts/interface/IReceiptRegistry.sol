pragma solidity 0.5.9;
pragma experimental ABIEncoderV2;

import "../util/ZalarifyCommon.sol";

contract IReceiptRegistry {

    /** Events */

    event NewReceiptCreated(
        address indexed thisContract,
        address company,
        address employee,
        bytes32 receiptHash
    );

    /** Functions */

    /** Company functions */
    
    function createReceipt(address _company, address _employee, bytes32 _receiptHash) 
        public
        returns (bool);

    function getReceipts(address _company, address _employee)
        public
        view
        returns (ZalarifyCommon.Receipt[] memory);

    function hasReceipts(address _company, address _employee)
        public
        view
        returns (bool);
}