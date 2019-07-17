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

    event PausedCompany(
        address indexed thisContract,
        address owner,
        bytes32 reason
    );

    event UnpausedCompany(
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

    function isCompanyPaused() external view returns (bool);

    function pause(bytes32 _reason) external returns (bool);

    function unpause() external returns (bool);

    /** Employee functions */

    function getEmployees() external view returns (ZalarifyCommon.Employee[] memory);

    function addEmployee(address _newEmployee, ZalarifyCommon.EmployeeType _employeeType, bytes32 _name, bytes32 _role, bytes32 _email, address _preferedTokenPayment, uint _salaryAmount) external returns (bool);

    function payWithTokens(ZalarifyCommon.Payment memory _payment) public returns (bool);
}