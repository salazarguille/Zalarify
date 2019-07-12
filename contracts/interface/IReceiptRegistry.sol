pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../util/ZalarifyCommon.sol";

contract IReceiptRegistry {

    /** Events */

    event NewReceiptCreated(
        address indexed thisContract,
        address company,
        address employee,
        string receiptHash,
        string path
    );

    /** Functions */

    /** Company functions */
    
    function createReceipt(address _company, address _employee, string memory _path, string memory _receiptHash) 
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