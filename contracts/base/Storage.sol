pragma solidity 0.5.9;

import "../interface/IStorage.sol";

contract Storage is IStorage {

    /**** Storage Types *******/
  
    mapping(bytes32 => string)     private stringStorage;
    mapping(bytes32 => address)    private addressStorage;
    mapping(bytes32 => bytes)      private bytesStorage;
    mapping(bytes32 => bool)       private boolStorage;
    mapping(bytes32 => int256)     private intStorage;
    mapping(bytes32 => uint256)    private uIntStorage;
    mapping(bytes32 => uint16)     private uInt16Storage;


    /*** Modifiers ************/

    /// @dev Only allow access from known contracts
    modifier onlyKnownContracts() {
        // The owner and other contracts are only allowed to set the storage upon deployment to register the initial contracts/settings, afterwards their direct access is disabled
        if (boolStorage[keccak256("contract.storage.initialised")] == true) {
            // Make sure the access is permitted to only contracts in our control
            require(addressStorage[keccak256(abi.encodePacked("contract.address", msg.sender))] != address(0x0));
        } else {
            require(boolStorage[keccak256(abi.encodePacked("access.role", "owner", msg.sender))]);
        }
        _;
    }


    /// @dev constructor
    constructor() public {
        // Set the main owner upon deployment
        // TODO implement ownable using access.role to allow admins
        boolStorage[keccak256(abi.encodePacked("access.role", "owner", msg.sender))] = true;
    }


    /**** Get Methods ***********/
   
    /// @param _key The key for the record
    function getAddress(bytes32 _key) external view returns (address) {
        return addressStorage[_key];
    }

    /// @param _key The key for the record
    function getUint(bytes32 _key) external view returns (uint) {
        return uIntStorage[_key];
    }

    /// @param _key The key for the record
    function getString(bytes32 _key) external view returns (string memory) {
        return stringStorage[_key];
    }

    /// @param _key The key for the record
    function getBytes(bytes32 _key) external view returns (bytes memory) {
        return bytesStorage[_key];
    }

    /// @param _key The key for the record
    function getBool(bytes32 _key) external view returns (bool) {
        return boolStorage[_key];
    }

    /// @param _key The key for the record
    function getInt(bytes32 _key) external view returns (int) {
        return intStorage[_key];
    }



    /// @param _key The key for the record
    function getUint16(bytes32 _key) external view returns (uint16) {
        return uInt16Storage[_key];
    }

    /**** Set Methods ***********/

    /// @param _key The key for the record
    function setAddress(bytes32 _key, address _value) external onlyKnownContracts {
        addressStorage[_key] = _value;
    }

    /// @param _key The key for the record
    function setUint(bytes32 _key, uint _value) external onlyKnownContracts {
        uIntStorage[_key] = _value;
    }

    /// @param _key The key for the record
    function setString(bytes32 _key, string calldata _value) external onlyKnownContracts {
        stringStorage[_key] = _value;
    }

    /// @param _key The key for the record
    function setBytes(bytes32 _key, bytes calldata _value) external onlyKnownContracts {
        bytesStorage[_key] = _value;
    }

    /// @param _key The key for the record
    function setBool(bytes32 _key, bool _value) external onlyKnownContracts {
        boolStorage[_key] = _value;
    }

    /// @param _key The key for the record
    function setInt(bytes32 _key, int _value) external onlyKnownContracts {
        intStorage[_key] = _value;
    }


    /// @param _key The key for the record
    function setUint16(bytes32 _key, uint16 _value) external onlyKnownContracts {
        uInt16Storage[_key] = _value;
    }

    /**** Delete Methods ***********/

    /// @param _key The key for the record
    function deleteAddress(bytes32 _key) external onlyKnownContracts {
        delete addressStorage[_key];
    }

    /// @param _key The key for the record
    function deleteUint(bytes32 _key) external onlyKnownContracts {
        delete uIntStorage[_key];
    }

    /// @param _key The key for the record
    function deleteString(bytes32 _key) external onlyKnownContracts {
        delete stringStorage[_key];
    }

    /// @param _key The key for the record
    function deleteBytes(bytes32 _key) external onlyKnownContracts {
        delete bytesStorage[_key];
    }

    /// @param _key The key for the record
    function deleteBool(bytes32 _key) external onlyKnownContracts {
        delete boolStorage[_key];
    }

    /// @param _key The key for the record
    function deleteInt(bytes32 _key) external onlyKnownContracts {
        delete intStorage[_key];
    }

    /// @param _key The key for the record
    function deleteUint16(bytes32 _key) external onlyKnownContracts {
        delete uInt16Storage[_key];
    }
}