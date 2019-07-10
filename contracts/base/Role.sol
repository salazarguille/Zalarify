pragma solidity 0.5.3;

import "./Base.sol";

contract Role is Base {

    /** Events */

    event RoleAdded(
        address indexed anAddress,
        string roleName
    );

    event RoleRemoved(
        address indexed anAddress,
        string roleName
    );

    event OwnershipTransferred(
        address indexed previousOwner, 
        address indexed newOwner
    );

    /** Modifier */

    /**
        @dev Only allow access from the latest version of the role contract
     */
    modifier onlyLatestRole() {
        require(address(this) == _storage.getAddress(keccak256(abi.encodePacked(CONTRACT_NAME, ROLE_NAME))), "Only the latest version contract.");
        _;
    }
  
    /** Constructor */

    constructor(address _storageAddress)  public Base(_storageAddress) {
        // Set the version
        version = 1;
    }

     /**
    * @dev Allows the current owner to transfer control of the contract to a newOwner.
    * @param _newOwner The address to transfer ownership to.
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
   * @dev Give an address access to this role
   */
    function adminRoleAdd(string memory _role, address _address) public onlyLatestRole onlySuperUser {
        roleAdd(_role, _address);
    }

    /**
   * @dev Remove an address access to this role
   */
    function adminRoleRemove(string memory _role, address _address) public onlyLatestRole onlySuperUser {
        roleRemove(_role, _address);
    }

    /** Internal Role Methods */
   
    /**
   * @dev Give an address access to this role
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
    * @dev Remove an address' access to this role
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