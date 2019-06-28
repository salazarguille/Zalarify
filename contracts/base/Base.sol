pragma solidity 0.5.9;

import "../interface/IStorage.sol";
import "../interface/IVault.sol";
import "../interface/ISettings.sol";
import "../interface/IZalarifyCompanyFactory.sol";
import "../util/ZalarifyCommon.sol";

/**
     @notice Reentrancy Guard: Remco Bloemen <remco@2π.com>: If you mark a function `nonReentrant`, you should also mark it `external`.
 */
contract Base {
    /** Constants */

    bytes constant internal ZALARIFY = "Zalarify";
    uint256 constant internal ZERO = 0;
    address constant internal ADDRESS_EMPTY = address(0x0);
    uint256 constant internal AVOID_DECIMALS = 100000000000000;
    string constant internal STATE_PAUSED = "state.paused";
    string constant internal STATE_DISABLED_COMPANY = "state.disabled.company";
    string constant internal PLATFORM_FEE = "config.platform.fee";

    string constant internal STABLE_PAY_NAME = "StablePay";
    string constant internal ZALARIFY_COMPANY_FACTORY_NAME = "ZalarifyCompanyFactory";
    string constant internal SETTINGS_NAME = "Settings";
    string constant internal VAULT_NAME = "Vault";
    string constant internal ROLE_NAME = "Role";
    string constant internal CONTRACT_NAME = "contract.name";
    string constant internal CONTRACT_ADDRESS = "contract.address";

    string constant internal OWNER = "owner";
    string constant internal ADMIN = "admin";
    string constant internal ACCESS_ROLE = "access.role";


    /** Properties */
    uint8 public version;  // Version of this contract

    /**
    * @dev We use a single lock for the whole contract.
    */
    bool private rentrancy_lock = false;

    /**
        @dev The main storage contract where primary persistant storage is maintained    
     */
    IStorage public _storage = IStorage(0);     

    /** Events */

    /**
        @dev This event is emitted when a deposit is received.
     */
    event DepositReceived (
        address indexed thisContract,
        address from,
        uint amount
    );

    /** Modifiers */

    /**
    * @dev Prevents a contract from calling itself, directly or indirectly.
    * @notice If you mark a function `nonReentrant`, you should also
    * mark it `external`. Calling one nonReentrant function from
    * another is not supported. Instead, you can implement a
    * `private` function doing the actual work, and a `external`
    * wrapper marked as `nonReentrant`.
    */
    modifier nonReentrant() {
        require(!rentrancy_lock, "rentrancy_lock");
        rentrancy_lock = true;
        _;
        rentrancy_lock = false;
    }

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
        roleCheck(OWNER, msg.sender);
        _;
    }

    /**
    * @dev Modifier to scope access to admins
    */
    modifier onlyAdmin() {
        roleCheck(ADMIN, msg.sender);
        _;
    }

    /**
    * @dev Modifier to scope access to admins
    */
    modifier onlySuperUser() {
        require(
            roleHas(OWNER, msg.sender) == true || 
            roleHas(ADMIN, msg.sender) == true,
            "Msg sender does not have permission."
        );
        _;
    }

    /**
    * @dev Reverts if the address doesn't have this role
    */
    modifier onlyRole(string memory _role) {
        roleCheck(_role, msg.sender);
        _;
    }

    /**
        @dev This modifier checks whether the platform is in paused state.
     */
    modifier isNotPaused() {
        require(_storage.getBool(keccak256(abi.encodePacked(STATE_PAUSED))) == false, "Platform is paused.");
        _;
    }

    modifier isDisabledCompany(address _company) {
        require(_storage.getBool(keccak256(abi.encodePacked(STATE_DISABLED_COMPANY, _company))) == true, "Company is disabled.");
        _;
    }

    modifier isEnabledCompany(address _company) {
        require(_storage.getBool(keccak256(abi.encodePacked(STATE_DISABLED_COMPANY, _company))) == false, "Company is enabled.");
        _;
    }

    function () external payable {
        require(msg.value > 0, "Msg value > 0");
        bool depositResult = IVault(getVault()).deposit.value(msg.value)();
        require(depositResult, "The deposit was not successful.");
        emit DepositReceived(
            address(this),
            msg.sender,
            msg.value
        );
    }

    /** Constructor */
   
    /**
        @dev Set the main Storage address
     */
    constructor(address _storageAddress) public {
        // Update the contract address
        _storage = IStorage(_storageAddress);
    }

    /**
        @dev Get the current Settings smart contract configured in the platform.
     */
    function getSettings()
        internal
        view
        returns (ISettings) {
        address settingsAddress = _storage.getAddress(keccak256(abi.encodePacked(CONTRACT_NAME, SETTINGS_NAME)));
        return ISettings(settingsAddress);
    }

    function getZalarifyCompanyFactory()
        internal
        view
        returns (IZalarifyCompanyFactory) {
        address settingsAddress = _storage.getAddress(keccak256(abi.encodePacked(CONTRACT_NAME, ZALARIFY_COMPANY_FACTORY_NAME)));
        return IZalarifyCompanyFactory(settingsAddress);
    }

    function getVault()
        internal
        view
        returns (address) {
        return _storage.getAddress(keccak256(abi.encodePacked(CONTRACT_NAME, VAULT_NAME)));
    }

    function getStablePayAddress()
        internal
        view
        returns (address) {
        return _storage.getAddress(keccak256(abi.encodePacked(CONTRACT_NAME, STABLE_PAY_NAME)));
    }

    function getStorageAddress()
        internal
        view
        returns (address) {
        return address(_storage);
    }

    /** Role utilities */

    /**
    * @dev Check if an address has this role
    * @return bool
    */
    function roleHas(string memory _role, address _address) internal view returns (bool) {
        return _storage.getBool(keccak256(abi.encodePacked(ACCESS_ROLE, _role, _address)));
    }

    /**
    * @dev Check if an address has this role, reverts if it doesn't
    */
    function roleCheck(string memory _role, address _address) internal view {
        require(roleHas(_role, _address) == true, "Invalid role");
    }
}