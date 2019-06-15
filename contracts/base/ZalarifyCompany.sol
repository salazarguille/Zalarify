pragma solidity 0.5.9;
pragma experimental ABIEncoderV2;

import "../base/Base.sol";
import "../util/SafeMath.sol";
import "../util/ZalarifyCommon.sol";

contract ZalarifyCompany is Base {
    using SafeMath for uint256;

    /** Constants */

    /** Properties */
    address public zalarify;

    mapping ( address => bool) public companyOwners;
    mapping ( address => ZalarifyCommon.Employee) public employees;
    mapping ( address => ZalarifyCommon.Receipt[]) public receipts;

    address[] public employeesList;

    /** Events */

    /** Modifiers */

    modifier isZalarify(address _sender) {
        require(zalarify == _sender, "Sender is not Zalarify.");
        _;
    }

    modifier isCompanyOwner(address _address) {
        require(companyOwners[_address] == true, "Sender is not a company owner.");
        _;
    }

    modifier isEmployee(address _address) {
        require(employees[_address].exist == true, "Address is not an employee.");
        require(employees[_address].isEmployee == true, "Address is not a current employee.");
        _;
    }

    modifier isNotEmployee(address _address) {
        require(employees[_address].exist == false, "Address is not an employee.");
        require(employees[_address].isEmployee == false, "Address is already an employee.");
        _;
    }

    /** Constructor */

    constructor(address _zalarify, address _storageAddress)
        public Base(_storageAddress) {
        zalarify = _zalarify;
    }

    /** Fallback Method */

    /** Functions */
    function isAnEmployee(address _employee)
    public
    view
    returns (bool){
        return employees[_employee].isEmployee;
    }
    
    function getReceipts(address _employee)
    public
    view
    returns (ZalarifyCommon.Receipt[] memory){
        return receipts[_employee];
    }

    function addEmployee(address _newEmployee, bytes32 _name, bytes32 _email, address _preferedTokenPayment, uint _salaryAmount)
    public
    isCompanyOwner(msg.sender)
    isNotEmployee(_newEmployee){
        employees[_newEmployee] = ZalarifyCommon.Employee({
            name: _name,
            email: _email,
            preferedTokenPayment: _preferedTokenPayment,
            salaryAmount: _salaryAmount,
            isEmployee: true,
            exist: true
        });
        emit NewEmployeeAdded(
            address(this),
            _newEmployee,
            _name,
            _email,
            _preferedTokenPayment,
            _salaryAmount
        );
    }

    function addCompanyOwner(address _newOwner)
    public
    isCompanyOwner(msg.sender){
        companyOwners[_newOwner] = true;
        emit NewCompanyOwnerAdded(
            address(this),
            msg.sender,
            _newOwner
        );
    }

    function removeCompanyOwner(address _owner)
    public
    isCompanyOwner(msg.sender){
        companyOwners[_owner] = false;
        emit NewCompanyOwnerRemoved(
            address(this),
            msg.sender,
            _owner
        );
    }

    event NewCompanyOwnerRemoved(
        address indexed thisContract,
        address currentCompanyOwner,
        address removedCompanyOwner
    );

    event NewCompanyOwnerAdded(
        address indexed thisContract,
        address currentCompanyOwner,
        address newCompanyOwner
    );

    event NewEmployeeAdded(
        address indexed thisContract,
        address newEmployee,
        bytes32 name,
        bytes32 email,
        address preferedTokenPayment,
        uint salaryAmount
    );

    

    
}
