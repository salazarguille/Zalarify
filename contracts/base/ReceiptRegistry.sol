pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../base/Base.sol";
import "../interface/IReceiptRegistry.sol";
import "../interface/IZalarifyCompany.sol";

/**
    @title This is used to register the employee receipt payments.
    @author Guillermo Salazar
    @dev Only the company owners can register a receipt payment.
 */
contract ReceiptRegistry is Base, IReceiptRegistry {

    /** Constants */
    string constant internal EMPTY_STRING = "";

    /** Properties */

    /** Double mapping to store the relation between Company <-> Employees <-> Receipts. */
    mapping (address => mapping (address => ZalarifyCommon.Receipt[])) public receipts;

    /** Events */

    /** Modifiers */

    /**
        @notice It validates whether an address is empty (0x0) or not.
        @dev It throws a require error if address is empty.
     */
    modifier isAddressNotEmpty(address _address) {
        require(_address != address(0x0), "Address must not be 0x0.");
        _;
    }

    /**
        @notice It validates whether an address (sender) is the company owner/creator.
        @dev It throws a require error if sender is not the company owner/creator.
        @dev it calls the company smart contract to get the creator address.
     */
    modifier isCompanyOwner(address _company, address _sender) {
        ZalarifyCommon.Company memory companyInfo = IZalarifyCompany(_company).getInfo();
        require(companyInfo.creator == _sender, "Sender is not company owner.");
        _;
    }

    /**
        @notice It validates if an string value is empty.
        @dev It throws a require error if string value is empty.
     */
    modifier isStringNotEmpty(string memory _value) {
        require(keccak256(abi.encodePacked(_value)) != keccak256(abi.encodePacked(EMPTY_STRING)), "String must not be empty.");
        _;
    }

    /**
        @notice It validates if a bytes32 value is empty.
        @dev It throws a require error if bytes32 value is empty.
     */
    modifier isBytes32NotEmpty(bytes32 _value) {
        require(_value != bytes32(0x0), "Bytes32 must not be 0x0.");
        _;
    }

    /** Constructor */

    /**
        @notice It creates a ReceiptRegistry smart contract instance.
        @param _storageAddress the Eternal Storage implementation address.
     */
    constructor(address _storageAddress) Base(_storageAddress) public {}

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

    /**
        @notice It gets all the receipt payments for a specific company and employee relation.
        @param _company the company where the employee got the receipts.
        @param _employee the employee address who owns the receipts.
        @return It returns a list of receipt payments for a specific company/employee relation.
     */
    function getReceipts(address _company, address _employee)
        public
        view
        returns (ZalarifyCommon.Receipt[] memory) {
        return receipts[_company][_employee];            
    }

    /**
        @notice It tests whether a company and employee relation has receipts.
        @param _company the company where the employee got the receipts.
        @param _employee the employee address who owns the receipts.
        @return true if the employee has receipt payments in the company. Otherwise it returns false.
     */
    function hasReceipts(address _company, address _employee)
        public
        view
        returns (bool) {
            return receipts[_company][_employee].length > 0;
    }
}
