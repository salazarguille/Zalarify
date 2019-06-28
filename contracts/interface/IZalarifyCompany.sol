pragma solidity 0.5.9;
pragma experimental ABIEncoderV2;

import "../util/ZalarifyCommon.sol";

contract IZalarifyCompany {

    /** Events */

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
        bytes32 role,
        bytes32 email,
        address preferedTokenPayment,
        ZalarifyCommon.EmployeeType employeeType,
        uint salaryAmount
    );

    event EmployeeUpdated(
        address indexed thisContract,
        address employee,
        bytes32 role,
        bytes32 email,
        address preferedTokenPayment,
        ZalarifyCommon.EmployeeType employeeType,
        uint salaryAmount
    );

    event DisableEmployee(
        address indexed thisContract,
        address owner,
        address employee,
        bytes32 reason
    );

    event EnabledEmployee(
        address indexed thisContract,
        address owner,
        address employee
    );

    event DisabledCompany(
        address indexed thisContract,
        address owner,
        bytes32 reason
    );

    event EnabledCompany(
        address indexed thisContract,
        address owner
    );

    /** Functions */

    /** Company functions */

    function getInfo() public view returns (ZalarifyCommon.Company memory);

    function id() public view returns (bytes32);

    function addCompanyOwner(address _newOwner) public returns (bool);

    function removeCompanyOwner(address _owner) public returns (bool);

    function isEnabled() public view returns (bool);

    function disable(bytes32 _reason) public returns (bool);

    function enable() public returns (bool);

    /** Employee functions */

    function isEnabled(address _employee) public view returns (bool);

    function getEmployees() public view returns (ZalarifyCommon.Employee[] memory);

    function disableEmployee(address _employee, bytes32 _reason) public returns (bool);

    function enableEmployee(address _employee) public returns (bool);

    function addEmployee(address _newEmployee, ZalarifyCommon.EmployeeType _employeeType, bytes32 _name, bytes32 _role, bytes32 _email, address _preferedTokenPayment, uint _salaryAmount) public returns (bool);

    function updateEmployee(address _employee, ZalarifyCommon.EmployeeType _employeeType, bytes32 _role, bytes32 _email, address _preferedTokenPayment, uint _salaryAmount) public returns (bool);

    function pay(ZalarifyCommon.Payment memory _payment) public returns (bool);
}