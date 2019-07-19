pragma solidity 0.5.3;

import "./Base.sol";

/**
    @title This manages the roles to access to the platform.
    @author Guillermo Salazar
    @notice This smart contract manages the roles for each address who access to the platform.
 */
contract Role is Base {

    /** Constants */
    string constant internal ROLE_NAME = "Role";

    /** Events */

    /**
        @notice This event is emitted when a new role is added.
        @param anAddress address where the role was added.
        @param roleName role name associated to the address.
    */
    event RoleAdded(
        address indexed anAddress,
        string roleName
    );

    /**
        @notice This event is emitted when a role is removed.
        @param anAddress address where the role was removed.
        @param roleName role name removed from the address.
    */
    event RoleRemoved(
        address indexed anAddress,
        string roleName
    );

    /**
        @notice This event is emitted when the platform owneship is transferred to a new address.
        @param previousOwner address which was the previous owner.
        @param newOwner address which represents the new owner.
    */
    event OwnershipTransferred(
        address indexed previousOwner, 
        address indexed newOwner
    );

    /** Modifier */

    /**
        @notice It checks whether this smart contract is the last version.
        @dev It checks getting the address for the contract name 'Role'.
        @dev If it is not the last version, it throws a require error.
     */
    modifier onlyLatestRole() {
        require(address(this) == _storage.getAddress(keccak256(abi.encodePacked(CONTRACT_NAME, ROLE_NAME))), "Only the latest version contract.");
        _;
    }
  
    /** Constructor */

    /**
        @notice It creates a new Role instance associated to an Eternal Storage implementation.
        @param _storageAddress the Eternal Storage implementation.
        @dev The Eternal Storage implementation must implement the IStorage interface.
     */
    constructor(address _storageAddress)  public Base(_storageAddress) {}

    /**
        @notice It transfers the ownership of the platform to another address.
        @param _newOwner The address to transfer ownership to.
     */
    function transferOwnership(address _newOwner) public onlyLatestRole onlyOwner {
        // Legit address?
        require(_newOwner != address(0x0),"Address != 0x0.");
        // Check the role exists 
        roleCheck("owner", msg.sender);
        // Remove current role
        _storage.deleteBool(keccak256(abi.encodePacked("access.role", "owner", msg.sender)));
        // Add new owner
        _storage.setBool(keccak256(abi.encodePacked("access.role", "owner", _newOwner)), true);

        emit OwnershipTransferred(msg.sender, _newOwner);
    }

    /** Admin Role Methods */

    /**
        @notice It adds a role to a specific address.
        @dev The sender must be a super user (owner or admin) only.

        @param _role the role name to give to the address.
        @param _address the address which will receive the role.
     */
    function adminRoleAdd(string memory _role, address _address) public onlyLatestRole onlySuperUser {
        roleAdd(_role, _address);
    }

    /**
        @notice It removes a role to a specific address.
        @dev The sender must be a super user (owner or admin).

        @param _role the role name to remove from the address.
        @param _address the address which will be removed from the role.
     */
    function adminRoleRemove(string memory _role, address _address) public onlyLatestRole onlySuperUser {
        roleRemove(_role, _address);
    }

    /** Internal Role Methods */
   
    /**
        @notice It gives a role to a specific address.
        
        @param _role the role name to give to the address.
        @param _address the address which will receive the role.
     */
    function roleAdd(string memory _role, address _address) internal {
        // Legit address?
        require(_address != address(0x0), "Address != 0x0.");
        require(keccak256(abi.encodePacked(_role)) != keccak256(""), "Role must not be empty.");

        // Only one owner to rule them all
        require(keccak256(abi.encodePacked(_role)) != keccak256("owner"), "Only one owner.");
        // Add it
        _storage.setBool(keccak256(abi.encodePacked("access.role", _role, _address)), true);
        // Log it
        emit RoleAdded(_address, _role);
    }

    /**
        @notice It removes a role to a specific address.

        @param _role the role name to remove from the address.
        @param _address the address which will be removed from the role.
     */
    function roleRemove(string memory _role, address _address) internal {
        // Only an owner can transfer their access
        require(!roleHas("owner", _address), "Only owner can transfer their access.");
        // Remove from storage
        _storage.deleteBool(keccak256(abi.encodePacked("access.role", _role, _address)));
        // Log it
        emit RoleRemoved(_address, _role);
    }
}