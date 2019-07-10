pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "../base/Base.sol";
import "../util/SafeMath.sol";
import "../util/AddressArrayLib.sol";
import "../util/ZalarifyCommon.sol";
import "../services/erc20/ERC20.sol";
import "../services/stablepay/StablePayCommon.sol";
import "../services/stablepay/IStablePay.sol";
import "../services/stablepay/IProviderRegistry.sol";
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

    constructor(ZalarifyCommon.Company memory _company, address _storageAddress)
        public Base(_storageAddress) {
        company = _company;
        companyOwners[_company.creator] = true;
    }

    /** Fallback Method */

    /** Functions */

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

    function isCompanyEnabled()
    public
    view
    returns (bool){
        return !_storage.getBool(keccak256(abi.encodePacked(STATE_DISABLED_COMPANY, address(this))));
    }

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

    function createEmployee(address _newEmployee, ZalarifyCommon.EmployeeType _employeeType, bytes32 _name, bytes32 _role, bytes32 _email, address _preferedTokenPayment, uint _salaryAmount)
    internal
    pure
    returns (ZalarifyCommon.Employee memory) {
        return ZalarifyCommon.Employee({
            employee: _newEmployee,
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
        employees[_newEmployee] = createEmployee(_newEmployee, _employeeType, _name, _role, _email, _preferedTokenPayment, _salaryAmount);
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

    function verifySourceTokens(ZalarifyCommon.Payment memory _payment)
    internal
    returns (bool){
        address stablePayAddress = getStablePayAddress();
        require(
            ERC20(_payment.sourceToken).allowance(msg.sender, address(this)) >= _payment.sourceAmount,
            "Allowance is not >= source amount."
        );
        require(
            ERC20(_payment.sourceToken).transferFrom(
                msg.sender,
                address(this),
                _payment.sourceAmount
            ),
            "Transfer from failed."
        );
        require(
            ERC20(_payment.sourceToken).approve(stablePayAddress, _payment.sourceAmount),
            "Approve tokens to StablePay failed."
        );
        return true;
    }

    function payWithTokens(ZalarifyCommon.Payment memory _payment)
    public
    isCompanyOwner(msg.sender)
    isEmployee(_payment.to)
    isEmployeeEnabled(_payment.to)
    returns (bool){
        require(_payment.provider != bytes32(0x0), "Provider != 0x0.");
        require(_payment.sourceAmount > 0, "Source amount > 0.");
        require(_payment.sourceToken != address(0x0), "Source token != 0x0.");
        require(_payment.targetAmount > 0, "Target amount > 0.");
        require(_payment.targetToken != address(0x0), "Target token != 0x0.");

        uint initialBalance = ERC20(_payment.sourceToken).balanceOf(address(this));

        verifySourceTokens(_payment);

        address stablePayAddress = getStablePayAddress();

        StablePayCommon.Order memory order = createOrder(_payment);
        
        bytes32[] memory providers = new bytes32[](1);
        providers[0] = _payment.provider;

        bool transferWithTokensResult = IStablePay(stablePayAddress).transferWithTokens(
            order,
            providers
        );
        require(transferWithTokensResult, "Transfer payment failed.");

        uint finalBalance = ERC20(_payment.sourceToken).balanceOf(address(this));
        (, uint diffTokens ) = transferDiffSourceTokensIfApplicable(_payment.sourceToken, msg.sender, initialBalance, finalBalance);

        emitPaymentSentEvent(_payment, diffTokens);

        return true;
    }

    function emitPaymentSentEvent(ZalarifyCommon.Payment memory _payment, uint diffTokens)
    internal
    returns (bool) {
        emit PaymentSent(
            _payment.provider,
            _payment.sourceToken,
            _payment.targetToken,
            _payment.to,
            _payment.sourceAmount.sub(diffTokens),
            _payment.targetAmount
        );
        return true;
    }

    function transferDiffSourceTokensIfApplicable(address token, address to, uint initialBalance, uint finalBalance)
    internal
    returns (bool, uint)
    {
        require(finalBalance >= initialBalance, "Final balance >= initial balance.");
        uint tokensDiff = finalBalance.sub(initialBalance);
        if(tokensDiff > 0) {
            bool transferResult = ERC20(token).transfer(to, tokensDiff);
            require(transferResult, "Transfer tokens back failed.");
        }
        return (true, tokensDiff);
    }

    function createOrder(ZalarifyCommon.Payment memory _payment)
    internal
    view
    returns (StablePayCommon.Order memory){
        ZalarifyCommon.Employee memory employee = employees[_payment.to];
        require(employee.preferedTokenPayment == _payment.targetToken, "Preferred token != target token.");
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
            fromAddress: address(this),
            makerAddress: ADDRESS_EMPTY,
            takerAddress: ADDRESS_EMPTY,
            feeRecipientAddress: ADDRESS_EMPTY,
            senderAddress: ADDRESS_EMPTY,
            signature: "",
            data: ZALARIFY_BYTES,
            makerAssetData: "",
            takerAssetData: ""
        });
    }    

    
}
