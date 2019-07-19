pragma solidity 0.5.3;

import "../interface/IStorage.sol";

/**
    @title This is an Eternal Storage pattern implementation.
    @notice This storage is used by all the smart contracts in the platform.
    @author Guillermo Salazar
    @dev To see more details about the Eternal Storage pattern: https://fravoll.github.io/solidity-patterns/eternal_storage.html
 */
contract Storage is IStorage {

    /**** Storage Types *******/
  
    mapping(bytes32 => string)     private stringStorage;
    mapping(bytes32 => address)    private addressStorage;
    mapping(bytes32 => bytes)      private bytesStorage;
    mapping(bytes32 => bool)       private boolStorage;
    mapping(bytes32 => int256)     private intStorage;
    mapping(bytes32 => uint256)    private uIntStorage;
    mapping(bytes32 => uint16)     private uInt16Storage;

    /** Modifiers */

    /**
        @notice It checks (when the platform is initialised) whether the sender is only a known smart contract (registered in the platform).
        @dev If the platform is not initialised (when is is being deployed), it checks whether the sender is a platform owner.
     */
    modifier onlyKnownContracts() {
        // The owner and other contracts are only allowed to set the storage upon deployment to register the initial contracts/settings, afterwards their direct access is disabled
        if (boolStorage[keccak256("contract.storage.initialised")] == true) {
            // Make sure the access is permitted to only contracts in our control
            require(addressStorage[keccak256(abi.encodePacked("contract.address", msg.sender))] != address(0x0), "Sender is not a valid contract.");
        } else {
            require(boolStorage[keccak256(abi.encodePacked("access.role", "owner", msg.sender))], "Sender is not an owner.");
        }
        _;
    }
    
    /**
        @notice It creates an Eternal Storage implementation instance.
        @dev It saves the sender as an owner.
     */
    constructor() public {
        // Set the main owner upon deployment
        // TODO implement ownable using access.role to allow admins
        boolStorage[keccak256(abi.encodePacked("access.role", "owner", msg.sender))] = true;
    }

    /** Get Functions */
   
    /**
        @notice It gets an address value associated to a key.
        @param _key key to get the current value.
     */
    function getAddress(bytes32 _key) external view returns (address) {
        return addressStorage[_key];
    }

    /**
        @notice It gets an uint value associated to a key.
        @param _key key to get the current value.
     */
    function getUint(bytes32 _key) external view returns (uint) {
        return uIntStorage[_key];
    }

    /**
        @notice It gets a string value associated to a key.
        @param _key key to get the current value.
     */
    function getString(bytes32 _key) external view returns (string memory) {
        return stringStorage[_key];
    }

    /**
        @notice It get a bytes value associated to a key.
        @param _key key to get the current value.
     */
    function getBytes(bytes32 _key) external view returns (bytes memory) {
        return bytesStorage[_key];
    }

    /**
        @notice It gets a bool value associated to a key.
        @param _key key to get the current value.
     */
    function getBool(bytes32 _key) external view returns (bool) {
        return boolStorage[_key];
    }

    /**
        @notice It gets an int value associated to a key.
        @param _key key to get the current value.
     */
    function getInt(bytes32 _key) external view returns (int) {
        return intStorage[_key];
    }

    /**
        @notice It gets an uint26 value associated to a key.
        @param _key key to get the current value.
     */
    function getUint16(bytes32 _key) external view returns (uint16) {
        return uInt16Storage[_key];
    }

    /** Set Functions */

    /**
        @notice It sets a key / address pair.
        @param _key key to associated to the value.
        @param _value value to store with the key.
     */
    function setAddress(bytes32 _key, address _value) external onlyKnownContracts {
        addressStorage[_key] = _value;
    }

    /**
        @notice It sets a key / uint pair.
        @param _key key to associated to the value.
        @param _value value to store with the key.
     */
    function setUint(bytes32 _key, uint _value) external onlyKnownContracts {
        uIntStorage[_key] = _value;
    }

    /**
        @notice It sets a key / string pair.
        @param _key key to associated to the value.
        @param _value value to store with the key.
     */
    function setString(bytes32 _key, string calldata _value) external onlyKnownContracts {
        stringStorage[_key] = _value;
    }

    /**
        @notice It sets a key / bytes pair.
        @param _key key to associated to the value.
        @param _value value to store with the key.
     */
    function setBytes(bytes32 _key, bytes calldata _value) external onlyKnownContracts {
        bytesStorage[_key] = _value;
    }

    /**
        @notice It sets a key / bool pair.
        @param _key key to associated to the value.
        @param _value value to store with the key.
     */
    function setBool(bytes32 _key, bool _value) external onlyKnownContracts {
        boolStorage[_key] = _value;
    }

    /**
        @notice It sets a key / int pair.
        @param _key key to associated to the value.
        @param _value value to store with the key.
     */
    function setInt(bytes32 _key, int _value) external onlyKnownContracts {
        intStorage[_key] = _value;
    }

    /**
        @notice It sets a key / uint16 pair.
        @param _key key to associated to the value.
        @param _value value to store with the key.
     */
    function setUint16(bytes32 _key, uint16 _value) external onlyKnownContracts {
        uInt16Storage[_key] = _value;
    }

    /** Delete Functions */

    /**
        @notice It deletes an address value asociated to a specific key.
        @param _key key to associated to the value to delete.
     */
    function deleteAddress(bytes32 _key) external onlyKnownContracts {
        delete addressStorage[_key];
    }

    /**
        @notice It deletes an uint value asociated to a specific key.
        @param _key key to associated to the value to delete.
     */
    function deleteUint(bytes32 _key) external onlyKnownContracts {
        delete uIntStorage[_key];
    }

    /**
        @notice It deletes a string value asociated to a specific key.
        @param _key key to associated to the value to delete.
     */
    function deleteString(bytes32 _key) external onlyKnownContracts {
        delete stringStorage[_key];
    }

    /**
        @notice It deletes a bytes value asociated to a specific key.
        @param _key key to associated to the value to delete.
     */
    function deleteBytes(bytes32 _key) external onlyKnownContracts {
        delete bytesStorage[_key];
    }

    /**
        @notice It deletes a bool value asociated to a specific key.
        @param _key key to associated to the value to delete.
     */
    function deleteBool(bytes32 _key) external onlyKnownContracts {
        delete boolStorage[_key];
    }

    /**
        @notice It deletes an int value asociated to a specific key.
        @param _key key to associated to the value to delete.
     */
    function deleteInt(bytes32 _key) external onlyKnownContracts {
        delete intStorage[_key];
    }

    /**
        @notice It deletes an uint16 value asociated to a specific key.
        @param _key key to associated to the value to delete.
     */
    function deleteUint16(bytes32 _key) external onlyKnownContracts {
        delete uInt16Storage[_key];
    }
}