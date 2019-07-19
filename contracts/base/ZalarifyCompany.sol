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

/**
    @notice This represents a register company in the platform.
    @dev It is used by the owner to register employees and transfer payrolls.
    @author Guillermo Salazar
 */
contract ZalarifyCompany is Base, IZalarifyCompany {
    using SafeMath for uint256;
    using AddressArrayLib for address[];

    /** Constants */
    bytes constant internal ZALARIFY_BYTES = "Zalarify";
    uint256 constant internal ZERO = 0;
    address constant internal ADDRESS_EMPTY = address(0x0);

    /** Properties */

    /**
        @notice The current company information.
     */
    ZalarifyCommon.Company public company;

    mapping ( address => bool) public companyOwners;
    mapping ( address => ZalarifyCommon.Employee) public employees;

    address[] public employeesList;

    /** Events */

    /** Modifiers */

    /**
        @notice It checks whether an address is a company owner.
        @dev It throws a require error, if the address is not a company owner.
        @param _address addres to be validated
     */
    modifier isCompanyOwner(address _address) {
        require(companyOwners[_address] == true, "Sender is not a company owner.");
        _;
    }

    /**
        @notice It checks whether an address is an employee.
        @dev It throws a require error, if the address is not an employee.
        @param _address addres to be validated
     */
    modifier isEmployee(address _address) {
        require(employees[_address].exist == true, "Address is not an employee.");
        _;
    }

    /**
        @notice It checks whether an address is a company owner.
        @dev It throws a require error, if the address is an employee.
        @param _address addres to be validated
     */
    modifier isNotEmployee(address _address) {
        require(employees[_address].exist == false, "Address is already an employee.");
        _;
    }

    /**
        @notice It checks whether this company is paused or not.
        @dev It throws a require error, if the company is paused.
        @param aCompany addres to be validated
     */
    modifier _isCompanyPaused(address aCompany) {
        require(company.paused == true, "Company is not paused.");
        _;
    }

    /**
        @notice It checks whether this comapny is paused or not.
        @dev It throws a require error, if the company is not paused.
        @param aCompany addres to be validated
     */
    modifier isCompanyNotPaused(address aCompany) {
        require(company.paused == false, "Company is paused.");
        _;
    }

    /** Constructor */

    /**
        @notice It creates a new ZalarifyCompany instance associated to a company data and an Eternal Storage implementation.
        @param _company struct with the company information.    
        @param _storageAddress the Eternal Storage implementation.
        @dev The Eternal Storage implementation must implement the IStorage interface.
     */
    constructor(ZalarifyCommon.Company memory _company, address _storageAddress)
        public Base(_storageAddress) {
        company = _company;
        companyOwners[_company.creator] = true;
    }

    /** Fallback Method */

    /** Functions */

    /**
        @notice It gets the company information.
        @return a company struct with the company information.
     */
    function getInfo()
    public
    view
    returns (ZalarifyCommon.Company memory){
        return company;
    }

    /**
        @notice It gets the company id.
        @return the company id.
     */
    function id()
    public
    view
    returns (bytes32){
        return company.id;
    }

    /**
        @notice It returns whether this company is paused or not.
        @return true if the company is paused. Otherwise it returns false.
     */
    function isCompanyPaused()
    public
    view
    returns (bool){
        return company.paused;
    }

    /**
        @notice It gets all the employees registered in the company.
        @return a list of employees.
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

    /**
        @notice It pauses this company due to a specific reason.
        @dev It must be executed by the company owner.
        @param _reason why the company is being paused.
        @return true if the company is paused. Otherwise it returns false.
     */
    function pause(bytes32 _reason)
    public
    isCompanyOwner(msg.sender)
    isCompanyNotPaused(address(this))
    returns (bool){
        company.paused = true;

        emit PausedCompany(
            address(this),
            msg.sender,
            _reason
        );
        return true;
    }

    /**
        @notice It unpauses this company.
        @dev It must be executed by the company owner.
        @return true if the company is unpaused. Otherwise it returns false.
     */
    function unpause()
    public
    isCompanyOwner(msg.sender)
    _isCompanyPaused(address(this))
    returns (bool){
        company.paused = false;

        emit UnpausedCompany(
            address(this),
            msg.sender
        );
        return true;
    }

    /**
        @notice It creates a company struct associated to employee information.
        @param _newEmployee the addres of the new employee.
        @param _employeeType the type of employee in the company.
        @param _name full name of the employee.
        @param _role role associated to the employee.
        @param _email email associated to the employee.
        @param _preferedTokenPayment preferred token payment associated to the employee.
        @param _salaryAmount salary amount of the employee.
        @return a new Employee struct with the information populated.
     */
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
            exist: true
        });
    }

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
    function addEmployee(address _newEmployee, ZalarifyCommon.EmployeeType _employeeType, bytes32 _name, bytes32 _role, bytes32 _email, address _preferedTokenPayment, uint _salaryAmount)
    public
    isCompanyOwner(msg.sender)
    isCompanyNotPaused(address(this))
    isNotEmployee(_newEmployee)
    returns (bool){
        
        // Create the employee struct instance and register it.
        employees[_newEmployee] = createEmployee(_newEmployee, _employeeType, _name, _role, _email, _preferedTokenPayment, _salaryAmount);
        employeesList.add(_newEmployee);

        // Emit event.
        emitNewEmployeeAdded(_newEmployee, _employeeType, _name, _role, _email, _preferedTokenPayment, _salaryAmount);
        return true;
    }

    /**
        @notice Emit the NewEmployeeAdded event.
        @param _newEmployee the addres of the new employee.
        @param _employeeType the type of employee in the company.
        @param _name full name of the employee.
        @param _role role associated to the employee.
        @param _email email associated to the employee.
        @param _preferedTokenPayment preferred token payment associated to the employee.
        @param _salaryAmount salary amount of the employee.
        @return true if the event is emitted. Otherwise it returns false.
     */
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

    /**
        @notice It verifies whether this contract is allowed to transfer a specific amount of tokens in an ERC20 token.
        @param _payment struct with the payment information.
        @return true if the verification is success. Otherwise it returns false.
     */
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

    /**
        @notice It transfer the payroll to a specific employee.
        @dev It calls StablePay smart contract. So it needs to create an Order struct.
        @param _payment contains all the payment and employee information.
        @return true if the payment is transfered. Otherwise it returns false.
     */
    function payWithTokens(ZalarifyCommon.Payment memory _payment)
    public
    isCompanyOwner(msg.sender)
    isEmployee(_payment.to)
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

    /**
        @notice It emits the PaymentSent event.
        @param _payment information about the payment.
        @param diffTokens amount of tokens.
        @return true if the event is emitted. Otherwise it returns false.
     */
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

    /**
        @notice It transfers the diff source tokens to a specific address.
        @dev The transfer is done if the difference between initial and final balances is greater than zero.
        @param token ERC20 address to use for the transfer.
        @param to address which will receive the tokens.
        @param initialBalance initial balance to calculate the difference.
        @param finalBalance final balance to calculate the difference.
        @return true if the transfer is success. Otherwise it returns false.
        @return the amount of tokens transfered.
     */
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

    /**
        @notice It creates an Order struct to call StablePay with a payment strcut information.
        @return a new Order struct instance.
     */
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
