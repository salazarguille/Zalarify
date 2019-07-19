pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../services/stablepay/IProviderRegistry.sol";
import "../services/stablepay/StablePayCommon.sol";
import "../util/ZalarifyCommon.sol";

/**
    @notice This represents a register company in the platform.
    @dev It is used by the owner to register employees and transfer payrolls.
    @author Guillermo Salazar
 */
contract IZalarifyCompany {

    /** Events */

    /**
        @notice This event is emitted when a new employee is created.
        @param newEmployee the addres of the new employee.
        @param employeeType the type of employee in the company.
        @param name full name of the employee.
        @param role role associated to the employee.
        @param email email associated to the employee.
        @param preferedTokenPayment preferred token payment associated to the employee.
        @param salaryAmount salary amount of the employee.
     */
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

    /**
        @notice This event is emitted when a company is paused.
        @param thisContract this smart contract address.
        @param owner who paused the company.
        @param reason why the company was paused.
     */
    event PausedCompany(
        address indexed thisContract,
        address owner,
        bytes32 reason
    );

    /**
        @notice This event is emitted when a company is unpaused.
        @param thisContract this smart contract address.
        @param owner who unpaused the company.
     */
    event UnpausedCompany(
        address indexed thisContract,
        address owner
    );

    /**
        @notice This event is emitted when a payment is sent.
        @param providerKey the provider key used for the payment.
        @param sourceToken source token used for the payment.
        @param targetToken target token used for the payment.
        @param to address who recieved the payment.
        @param fromAmount total source amount used for the payment.
        @param toAmount total target amount used for the payment.
     */
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

    /**
        @notice It gets the company information.
        @return a company struct with the company information.
     */
    function getInfo() external view returns (ZalarifyCommon.Company memory);

    /**
        @notice It gets the company id.
        @return the company id.
     */
    function id() external view returns (bytes32);

    /**
        @notice It returns whether this company is paused or not.
        @return true if the company is paused. Otherwise it returns false.
     */
    function isCompanyPaused() external view returns (bool);

    /**
        @notice It pauses this company due to a specific reason.
        @dev It must be executed by the company owner.
        @param _reason why the company is being paused.
        @return true if the company is paused. Otherwise it returns false.
     */
    function pause(bytes32 _reason) external returns (bool);

    /**
        @notice It unpauses this company.
        @dev It must be executed by the company owner.
        @return true if the company is unpaused. Otherwise it returns false.
     */
    function unpause() external returns (bool);

    /** Employee functions */

    /**
        @notice It gets all the employees registered in the company.
        @return a list of employees.
     */
    function getEmployees() external view returns (ZalarifyCommon.Employee[] memory);

    /**
        @notice It add a new employee to this company.
        @param _newEmployee the addres of the new employee.
        @param _employeeType the type of employee in the company.
        @param _name full name of the employee.
        @param _role role associated to the employee.
        @param _email email associated to the employee.
        @param _preferedTokenPayment preferred token payment associated to the employee.
        @param _salaryAmount salary amount of the employee.
        @return true if the employee is added in this company. Otherwise it returns false.
     */
    function addEmployee(address _newEmployee, ZalarifyCommon.EmployeeType _employeeType, bytes32 _name, bytes32 _role, bytes32 _email, address _preferedTokenPayment, uint _salaryAmount) external returns (bool);

    /**
        @notice It transfer the payroll to a specific employee.
        @dev It calls StablePay smart contract. So it needs to create an Order struct.
        @param _payment contains all the payment and employee information.
        @return true if the payment is transfered. Otherwise it returns false.
     */
    function payWithTokens(ZalarifyCommon.Payment memory _payment) public returns (bool);
}