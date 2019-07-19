pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../util/ZalarifyCommon.sol";

/**
    @notice This is a receipt registry abstraction.
    @author Guillermo Salazar.
 */
contract IReceiptRegistry {

    /** Events */

    /**
        @notice This event is emitted when a new receipt is created.
        @param thisContract the current smart contract address.
        @param company the company address.
        @param employee the employee address.
        @param receiptHash the receipt hash created on IPFS.
        @param path the path created on IPFS.
     */
    event NewReceiptCreated(
        address indexed thisContract,
        address company,
        address employee,
        string receiptHash,
        string path
    );

    /** Functions */
    
    /**
        @notice It creates a receipt payment associated to a company and employee.
        @dev It can be invoked only by the company owner/creator.
        @dev The receipt parameter values must be not empty.

        @param _company the company address where the employee works.
        @param _employee the employee address who receives the receipt payment.
        @param _path the IPFS path where the receipt was stored.
        @param _receiptHash the IPFS hash from the receipt document.
     */
    function createReceipt(address _company, address _employee, string memory _path, string memory _receiptHash) 
        public
        returns (bool);

    /**
        @notice It gets all the receipt payments for a specific company and employee relation.
        @param _company the company where the employee got the receipts.
        @param _employee the employee address who owns the receipts.
        @return It returns a list of receipt payments for a specific company/employee relation.
     */
    function getReceipts(address _company, address _employee)
        public
        view
        returns (ZalarifyCommon.Receipt[] memory);

    /**
        @notice It tests whether a company and employee relation has receipts.
        @param _company the company where the employee got the receipts.
        @param _employee the employee address who owns the receipts.
        @return true if the employee has receipt payments in the company. Otherwise it returns false.
     */
    function hasReceipts(address _company, address _employee)
        public
        view
        returns (bool);
}