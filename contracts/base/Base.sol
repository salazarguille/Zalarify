pragma solidity 0.5.3;

import "../interface/IStorage.sol";
import "../interface/IVault.sol";
import "../interface/ISettings.sol";
import "../interface/IZalarifyCompanyFactory.sol";

/**
    @title It is the base smart contract for the Zalarify platform.
    @notice It is a base smart contract to able to update any smart contract in the platform.
    @author Guillermo Salazar

    @dev All smart contracts should inherit from this one in order to able to access the other platform smart contracts.
    @dev It contains an IStorage implementation which implements the Eternal Storage pattern (details https://fravoll.github.io/solidity-patterns/eternal_storage.html).
    @dev Reentrancy Guard: Remco Bloemen <remco@2π.com>: If you mark a function `nonReentrant`, you should also mark it `external`.
 */
contract Base {
    /** Constants */

    uint8 constant internal VERSION_ONE = 1;
    // uint256 constant internal AVOID_DECIMALS = 100000000000000;
    string constant internal STATE_PAUSED = "state.paused";
    string constant internal STATE_DISABLED_COMPANY = "state.disabled.company";

    string constant internal STABLE_PAY_NAME = "StablePay";
    string constant internal ZALARIFY_COMPANY_FACTORY_NAME = "ZalarifyCompanyFactory";
    string constant internal SETTINGS_NAME = "Settings";
    string constant internal VAULT_NAME = "Vault";
    string constant internal CONTRACT_NAME = "contract.name";
    string constant internal OWNER = "owner";
    string constant internal ADMIN = "admin";
    string constant internal ACCESS_ROLE = "access.role";


    /** Properties */

    /** @dev Version of this contract. By default it is 1. */
    uint8 public version;

    /** @dev We use a single lock for the whole contract. */
    bool private rentrancyLock = false;

    /** @dev The main storage contract where primary persistant storage is maintained. */
    IStorage public _storage = IStorage(0);     

    /** Events */

    /** @notice This event is emitted when a deposit is received. */
    event DepositReceived (
        address indexed thisContract,
        address from,
        uint amount
    );

    /** Modifiers */

    /**
        @notice Prevents a contract from calling itself, directly or indirectly.
        @dev If you mark a function `nonReentrant`, you should also mark it `external`.
        @dev Calling one nonReentrant function from another is not supported.
        @dev Instead, you can implement a `private` function doing the actual work, and a `external`wrapper marked as `nonReentrant`.
     */
    modifier nonReentrant() {
        require(!rentrancyLock, "Invalid rentrancy lock state.");
        rentrancyLock = true;
        _;
        rentrancyLock = false;
    }

    /** @notice Throws if called by any account other than the owner. */
    modifier onlyOwner() {
        roleCheck(OWNER, msg.sender);
        _;
    }

    /** @notice Modifier to scope access to admins */
    modifier onlyAdmin() {
        roleCheck(ADMIN, msg.sender);
        _;
    }

    /** @notice Modifier to scope access to admins */
    modifier onlySuperUser() {
        require(
            roleHas(OWNER, msg.sender) == true || 
            roleHas(ADMIN, msg.sender) == true,
            "Msg sender does not have permission."
        );
        _;
    }

    /**
        @notice Reverts if the address doesn't have this role
        @param aRole role name to validate against the message sender.
     */
    modifier onlyRole(string memory aRole) {
        roleCheck(aRole, msg.sender);
        _;
    }

    /**
        @notice It checks whether the platform is in paused state.
     */
    modifier isNotPaused() {
        require(_storage.getBool(keccak256(abi.encodePacked(STATE_PAUSED))) == false, "Platform is paused.");
        _;
    }

    /**
        @notice This fallback function transfer the ether received to a IVault implementation.
        @notice If ether value is zero, it throws an require error. 
        @dev If the transfer was succesfully, it emits an DepositReceived event.
     */
    function () external payable {
        require(msg.value > 0, "Msg value > 0.");
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
        @notice It creates an instance associated to a IStorage instance.
        @dev It sets the main Storage address.
        @dev It sets the smart contract version to 1 as default.
        @param storageAddress the eternal storage (IStorage interface) implementation.
     */
    constructor(address storageAddress) public {
        // Update the contract address
        _storage = IStorage(storageAddress);
        version = VERSION_ONE;
    }

    /** @notice It gets the current Settings smart contract configured in the platform. */
    function getSettings()
        internal
        view
        returns (ISettings) {
        address settingsAddress = _storage.getAddress(keccak256(abi.encodePacked(CONTRACT_NAME, SETTINGS_NAME)));
        return ISettings(settingsAddress);
    }

    /** @notice It gets the current ZalarifyCompanyFactory smart contract configured in the platform. */
    function getZalarifyCompanyFactory()
        internal
        view
        returns (IZalarifyCompanyFactory) {
        address settingsAddress = _storage.getAddress(keccak256(abi.encodePacked(CONTRACT_NAME, ZALARIFY_COMPANY_FACTORY_NAME)));
        return IZalarifyCompanyFactory(settingsAddress);
    }

    /** @notice It gets the current Vault smart contract address configured in the platform. */
    function getVault()
        internal
        view
        returns (address) {
        return _storage.getAddress(keccak256(abi.encodePacked(CONTRACT_NAME, VAULT_NAME)));
    }

    /** @notice It gets the current StablePay smart contract address configured in the platform. */
    function getStablePayAddress()
        internal
        view
        returns (address) {
        return _storage.getAddress(keccak256(abi.encodePacked(CONTRACT_NAME, STABLE_PAY_NAME)));
    }

    /** @notice It gets the current Zalarify smart contract address configured in the platform. */
    function getZalarifyAddress()
        internal
        view
        returns (address) {
        return _storage.getAddress(keccak256(abi.encodePacked(CONTRACT_NAME, "Zalarify")));
    }

    /** @notice It gets the current Storage smart contract address configured in the platform. */
    function getStorageAddress()
        internal
        view
        returns (address) {
        return address(_storage);
    }

    /**
        @notice It checks whether a specific address has a specific role.
        @param aRole role name to validate against an address.
        @param anAddress address to validate.
        @return true if the address has the role. Otherwise it returns false.
     */
    function roleHas(string memory aRole, address anAddress) internal view returns (bool) {
        return _storage.getBool(keccak256(abi.encodePacked(ACCESS_ROLE, aRole, anAddress)));
    }

    /**
        @notice It validates whether an address has a specific role. If not, it throw a require error.
        @dev It calls the roleHas internal function.
     */
    function roleCheck(string memory aRole, address anAddress) internal view {
        require(roleHas(aRole, anAddress) == true, "Invalid role");
    }
}