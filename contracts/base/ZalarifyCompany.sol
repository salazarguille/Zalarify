pragma solidity 0.5.9;
pragma experimental ABIEncoderV2;

import "../base/Base.sol";
import "../util/SafeMath.sol";
import "../util/AddressArrayLib.sol";
import "../util/ZalarifyCommon.sol";
import "../services/erc20/ERC20.sol";
import "../services/stablepay/StablePayCommon.sol";
import "../services/stablepay/IStablePay.sol";
import "../interface/IZalarifyCompany.sol";

contract ZalarifyCompany is Base, IZalarifyCompany {
    using SafeMath for uint256;
    using AddressArrayLib for address[];

    /** Constants */

    /** Properties */

    ZalarifyCommon.Company public company;

    mapping ( address => bool) public companyOwners;
    mapping ( address => ZalarifyCommon.Employee) public employees;
    //mapping ( address => ZalarifyCommon.Receipt[]) public receipts;

    address[] public employeesList;

    /** Events */

    /** Modifiers */

    modifier isCompanyOwner(address _address) {
        require(companyOwners[_address] == true, "Sender is not a company owner.");
        _;
    }

    modifier isEmployee(address _address) {
        require(employees[_address].exist == true, "Address is not an employee.");
        _;
    }

    modifier isEmployeeEnabled(address _address) {
        require(employees[_address].enabled == true, "Address is not enabled as an employee.");
        _;
    }

    modifier isNotEmployee(address _address) {
        require(employees[_address].exist == false, "Address is not an employee.");
        _;
    }

    modifier isEmployeeNotEnabled(address _address) {
        require(employees[_address].enabled == false, "Address is already enabled as an employee.");
        _;
    }

    /** Constructor */

    constructor(address currentOwner, ZalarifyCommon.Company memory _company, address _storageAddress)
        public Base(_storageAddress) {
        company = _company;
        companyOwners[currentOwner] = true;
    }

    /** Fallback Method */

    /** Functions */

    function createOrder(ZalarifyCommon.Payment memory _payment)
    internal
    view
    returns (StablePayCommon.Order memory){
        ZalarifyCommon.Employee memory employee = employees[_payment.to];
        return StablePayCommon.Order({
            sourceAmount: _payment.sourceAmount,
            targetAmount: _payment.targetAmount,
            makerAssetAmount: ZERO,
            takerAssetAmount: ZERO,
            makerFee: ZERO,
            takerFee: ZERO,
            expirationTimeSeconds: ZERO,
            salt: ZERO,
            minRate: _payment.minRate,
            maxRate: _payment.maxRate,
            sourceToken: _payment.sourceToken,
            targetToken: employee.preferedTokenPayment,
            toAddress: _payment.to,
            fromAddress: msg.sender,
            makerAddress: ADDRESS_EMPTY,
            takerAddress: ADDRESS_EMPTY,
            feeRecipientAddress: ADDRESS_EMPTY,
            senderAddress: ADDRESS_EMPTY,
            signature: "",
            data: ZALARIFY,
            makerAssetData: "",
            takerAssetData: ""
        });
    }

    function getInfo()
    public
    view
    returns (ZalarifyCommon.Company memory){
        return company;
    }

    function id()
    public
    view
    returns (bytes32){
        return company.id;
    }

    function isEnabled(address _employee)
    public
    view
    returns (bool){
        return employees[_employee].enabled;
    }

    function isEnabled()
    public
    view
    returns (bool){
        return _storage.getBool(keccak256(abi.encodePacked(STATE_DISABLED_COMPANY, address(this))));
    }
    /*
    function getReceipts(address _employee)
    public
    view
    returns (ZalarifyCommon.Receipt[] memory){
        return receipts[_employee];
    }
    */

    function getEmployees()
    public
    view
    returns (ZalarifyCommon.Employee[] memory){
        
        ZalarifyCommon.Employee[] memory _employees = new ZalarifyCommon.Employee[](employeesList.length);

        for (uint256 index = 0; index < employeesList.length; index = index.add(1)) {
            _employees[index] = employees[employeesList[index]];
        }
        return _employees;
    }

    function disable(bytes32 _reason)
    public
    isCompanyOwner(msg.sender)
    isEnabledCompany(address(this))
    returns (bool){
        setStateDisabledCompany(true);

        emit DisabledCompany(
            address(this),
            msg.sender,
            _reason
        );
        return true;
    }

    function setStateDisabledCompany(bool _value) internal {
        _storage.setBool(keccak256(abi.encodePacked(STATE_DISABLED_COMPANY, address(this))), _value);
    }

    function enable()
    public
    isCompanyOwner(msg.sender)
    isDisabledCompany(address(this))
    returns (bool){
        setStateDisabledCompany(false);

        emit EnabledCompany(
            address(this),
            msg.sender
        );
        return true;
    }

    function disableEmployee(address _employee, bytes32 _reason)
    public
    isCompanyOwner(msg.sender)
    isEnabledCompany(address(this))
    isEmployee(_employee)
    isEmployeeEnabled(_employee)
    returns (bool){
        employees[_employee].enabled = false;

        emit DisableEmployee(
            address(this),
            msg.sender,
            _employee,
            _reason
        );
        return true;
    }

    function enableEmployee(address _employee)
    public
    isCompanyOwner(msg.sender)
    isEnabledCompany(address(this))
    isEmployee(_employee)
    isEmployeeNotEnabled(_employee)
    returns (bool){
        employees[_employee].enabled = true;

        emit EnabledEmployee(
            address(this),
            msg.sender,
            _employee
        );
        return true;
    }

    function updateEmployee(address _employee, ZalarifyCommon.EmployeeType _employeeType, bytes32 _role, bytes32 _email, address _preferedTokenPayment, uint _salaryAmount)
    public
    isCompanyOwner(msg.sender)
    isEnabledCompany(address(this))
    isEmployee(_employee)
    returns (bool){
        employees[_employee].employeeType = _employeeType;
        employees[_employee].role = _role;
        employees[_employee].email = _email;
        employees[_employee].preferedTokenPayment = _preferedTokenPayment;
        employees[_employee].salaryAmount = _salaryAmount;

        emit EmployeeUpdated(
            address(this),
            _employee,
            _role,
            _email,
            _preferedTokenPayment,
            _employeeType,
            _salaryAmount
        );
        return true;
    }

    function createEmployee(ZalarifyCommon.EmployeeType _employeeType, bytes32 _name, bytes32 _role, bytes32 _email, address _preferedTokenPayment, uint _salaryAmount)
    internal
    pure
    returns (ZalarifyCommon.Employee memory) {
        return ZalarifyCommon.Employee({
            name: _name,
            role: _role,
            email: _email,
            preferedTokenPayment: _preferedTokenPayment,
            employeeType: _employeeType,
            salaryAmount: _salaryAmount,
            enabled: true,
            exist: true
        });
    }

    function addEmployee(address _newEmployee, ZalarifyCommon.EmployeeType _employeeType, bytes32 _name, bytes32 _role, bytes32 _email, address _preferedTokenPayment, uint _salaryAmount)
    public
    isCompanyOwner(msg.sender)
    isEnabledCompany(address(this))
    isNotEmployee(_newEmployee)
    returns (bool){
        
        // Create the employee struct instance and register it.
        employees[_newEmployee] = createEmployee(_employeeType, _name, _role, _email, _preferedTokenPayment, _salaryAmount);
        employeesList.add(_newEmployee);

        // Emit event.
        emitNewEmployeeAdded(_newEmployee, _employeeType, _name, _role, _email, _preferedTokenPayment, _salaryAmount);
        return true;
    }

    function emitNewEmployeeAdded(address _newEmployee, ZalarifyCommon.EmployeeType _employeeType, bytes32 _name, bytes32 _role, bytes32 _email, address _preferedTokenPayment, uint _salaryAmount)
    internal
    returns (bool){
        emit NewEmployeeAdded(
            address(this),
            _newEmployee,
            _name,
            _role,
            _email,
            _preferedTokenPayment,
            _employeeType,
            _salaryAmount
        );
        return true;
    }

    function addCompanyOwner(address _newOwner)
    public
    isCompanyOwner(msg.sender)
    isEnabledCompany(address(this))
    returns (bool){
        companyOwners[_newOwner] = true;
        emit NewCompanyOwnerAdded(
            address(this),
            msg.sender,
            _newOwner
        );
        return true;
    }

    function removeCompanyOwner(address _owner)
    public
    isCompanyOwner(msg.sender)
    isEnabledCompany(address(this))
    returns (bool){
        companyOwners[_owner] = false;
        emit NewCompanyOwnerRemoved(
            address(this),
            msg.sender,
            _owner
        );
        return true;
    }

    function pay(ZalarifyCommon.Payment memory _payment)
    public
    isNotEmployee(_payment.to)
    returns (bool){
        require(_payment.sourceAmount > 0, "Source amount > 0.");

        address stablePayAddress = getStablePayAddress();

        require(
            ERC20(_payment.sourceToken).transferFrom(
                address(this),
                stablePayAddress,
                _payment.sourceAmount
            ),
            "Transfer from failed."
        );
        StablePayCommon.Order memory order = createOrder(_payment);
        
        bytes32[] memory providers = new bytes32[](1);
        providers[0] = _payment.provider;

        bool transferWithTokensResult = IStablePay(stablePayAddress).transferWithTokens(
            order,
            providers
        );
        require(transferWithTokensResult, "Transfer payment failed.");

        return true;
    }

    

    
}
