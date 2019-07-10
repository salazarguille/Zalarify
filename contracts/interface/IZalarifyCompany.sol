pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../services/stablepay/IProviderRegistry.sol";
import "../services/stablepay/StablePayCommon.sol";
import "../util/ZalarifyCommon.sol";

contract IZalarifyCompany {

    /** Events */

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

    event PaymentSent(
        bytes32 indexed providerKey,
        address sourceToken,
        address targetToken,
        address to,
        uint fromAmount,
        uint toAmount
    );

    /** Functions */

    /** Company functions */

    function getInfo() external view returns (ZalarifyCommon.Company memory);

    function id() external view returns (bytes32);

    function isCompanyEnabled() external view returns (bool);

    function disable(bytes32 _reason) external returns (bool);

    function enable() external returns (bool);

    /** Employee functions */

    function isEnabled(address _employee) external view returns (bool);

    // function getEmployee(address employee) external view returns (ZalarifyCommon.Employee memory);

    function getEmployees() external view returns (ZalarifyCommon.Employee[] memory);

    function disableEmployee(address _employee, bytes32 _reason) external returns (bool);

    function enableEmployee(address _employee) external returns (bool);

    function addEmployee(address _newEmployee, ZalarifyCommon.EmployeeType _employeeType, bytes32 _name, bytes32 _role, bytes32 _email, address _preferedTokenPayment, uint _salaryAmount) external returns (bool);

    function payWithTokens(ZalarifyCommon.Payment memory _payment) public returns (bool);
}