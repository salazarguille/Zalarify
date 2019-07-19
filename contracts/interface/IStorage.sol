pragma solidity 0.5.3;

/**
    @notice This is an abstraction for the Eternal Storage pattern implementation.
    @author Guillermo Salazar.
 */
contract IStorage {
 
    /** Set Functions */

    /**
        @notice It sets a key / address pair.
        @param _key key to associated to the value.
        @param _value value to store with the key.
     */
    function setAddress(bytes32 _key, address _value) external;

    /**
        @notice It sets a key / uint pair.
        @param _key key to associated to the value.
        @param _value value to store with the key.
     */
    function setUint(bytes32 _key, uint _value) external;

    /**
        @notice It sets a key / string pair.
        @param _key key to associated to the value.
        @param _value value to store with the key.
     */
    function setString(bytes32 _key, string calldata _value) external;

    /**
        @notice It sets a key / bytes pair.
        @param _key key to associated to the value.
        @param _value value to store with the key.
     */
    function setBytes(bytes32 _key, bytes calldata _value) external;

    /**
        @notice It sets a key / bool pair.
        @param _key key to associated to the value.
        @param _value value to store with the key.
     */
    function setBool(bytes32 _key, bool _value) external;

    /**
        @notice It sets a key / int pair.
        @param _key key to associated to the value.
        @param _value value to store with the key.
     */
    function setInt(bytes32 _key, int _value) external;

    /**
        @notice It sets a key / uint16 pair.
        @param _key key to associated to the value.
        @param _value value to store with the key.
     */
    function setUint16(bytes32 _key, uint16 _value) external;

    /** Delete Functions */

    /**
        @notice It deletes an address value asociated to a specific key.
        @param _key key to associated to the value to delete.
     */
    function deleteAddress(bytes32 _key) external;

    /**
        @notice It deletes an uint value asociated to a specific key.
        @param _key key to associated to the value to delete.
     */
    function deleteUint(bytes32 _key) external;

    /**
        @notice It deletes a string value asociated to a specific key.
        @param _key key to associated to the value to delete.
     */
    function deleteString(bytes32 _key) external;

    /**
        @notice It deletes a bytes value asociated to a specific key.
        @param _key key to associated to the value to delete.
     */
    function deleteBytes(bytes32 _key) external;
    
    /**
        @notice It deletes a bool value asociated to a specific key.
        @param _key key to associated to the value to delete.
     */
    function deleteBool(bytes32 _key) external;

    /**
        @notice It deletes an int value asociated to a specific key.
        @param _key key to associated to the value to delete.
     */
    function deleteInt(bytes32 _key) external;

    /**
        @notice It deletes an uint16 value asociated to a specific key.
        @param _key key to associated to the value to delete.
     */
    function deleteUint16(bytes32 _key) external;

    /** Getter Functions */

    /**
        @notice It gets an address value associated to a key.
        @param _key key to get the current value.
     */
    function getAddress(bytes32 _key) external view returns (address);

    /**
        @notice It gets an uint value associated to a key.
        @param _key key to get the current value.
     */
    function getUint(bytes32 _key) external view returns (uint);

    /**
        @notice It gets a string value associated to a key.
        @param _key key to get the current value.
     */
    function getString(bytes32 _key) external view returns (string memory);

    /**
        @notice It get a bytes value associated to a key.
        @param _key key to get the current value.
     */
    function getBytes(bytes32 _key) external view returns (bytes memory);

    /**
        @notice It gets a bool value associated to a key.
        @param _key key to get the current value.
     */
    function getBool(bytes32 _key) external view returns (bool);

    /**
        @notice It gets an int value associated to a key.
        @param _key key to get the current value.
     */
    function getInt(bytes32 _key) external view returns (int);

    /**
        @notice It gets an uint26 value associated to a key.
        @param _key key to get the current value.
     */
    function getUint16(bytes32 _key) external view returns (uint16);
}

